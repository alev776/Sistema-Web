const Ingresos = require('../models/ingresos');
const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');
const Detalle_Ingresos = require('../models/detalle_ingreso');
const _ = require('underscore');

router.post('/ingresos', auth, async(req ,res) => {
    const ingreso = new Ingresos({
        ...req.body,
        owner: req.user._id
    });

    try {
        await ingreso.save();

        const detalles = Detalle_Ingresos.toObject(req.body.detalles, ingreso._id, req.user._id);
        const detalle = await Detalle_Ingresos.create(detalles);

        res.status(201).send({ingreso, detalle});
    } catch (error) {
        res.status(400).send(error);
    }

});

router.get('/ingresos', auth, async(req ,res) => {
    try {
        await req.user.populate({
            path: 'ingresos',
            options: {
                limit: req.query.limit
            }
        }).execPopulate();

        const detalles = await Detalle_Ingresos.find({owner: req.user._id});
        const ingresos = req.user.ingresos;

        res.send({ ingresos, detalles });
    } catch (error) {
        res.status(404).send(error);
    }
});

router.get('/ingreso/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try {
        const ingreso = await Ingresos.findOne({
            _id,
            owner: req.user._id
        });

        if (!ingreso) {
            return res.status(404).send();
        }

        res.send(ingreso);
    } catch (error) {
        res.status(500).send(error);
    }

});

router.patch('/ingreso/:id', auth, async(req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);

    try {
        const ingreso = await Ingresos.findOne({
            _id,
            owner: req.user._id
        });

        if (!ingreso) {
            return res.status(404).send();
        }

        updates.forEach(x => ingreso[x] = req.body[x]);
        await ingreso.save();

        const detallesToDelete = await Detalle_Ingresos.find({idIngreso: _id});
        var filteredArray  = detallesToDelete.filter(function(array_el){
            return req.body.detalles.filter(function(anotherOne_el){
               return anotherOne_el._id == array_el._id;
            }).length == 0
         });

         if (filteredArray.length) {
             filteredArray.forEach(async x => {
                 await Detalle_Ingresos.findByIdAndDelete(x._id);
             });
         }

        var filteredAddArray  = req.body.detalles.filter(function(array_el){
            return detallesToDelete.filter(function(anotherOne_el){
               return anotherOne_el._id == array_el._id;
            }).length == 0
         });

        if (filteredAddArray.length) {
            const arreglo = Detalle_Ingresos.toObject(filteredAddArray, ingreso._id, req.user._id);
            arreglo.forEach(async x => {
                const detalleAdd = new Detalle_Ingresos(x)
                await detalleAdd.save()
            })
        }

        req.body.detalles.forEach(async x => {
            const allowedUpdates = _.pick(x, ['cantidad', 'precio']);
            const detalle = await Detalle_Ingresos.findOneAndUpdate({_id: x._id}, allowedUpdates, {new: true});
            if (detalle) {
                await detalle.save();
            }
        });

        res.send(ingreso);
    } catch (error) {
        res.status(500).send(error);
    }

});

router.delete('/ingreso/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try {
        const ingreso = await Ingresos.findOneAndDelete({
            _id,
            owner: req.user._id
        });

        if (ingreso) {
            const detalleIngresos = await Detalle_Ingresos.find({idIngreso: ingreso._id});
            if (detalleIngresos) {
                detalleIngresos.forEach(async x => {
                    await Detalle_Ingresos.findByIdAndDelete(x._id);
                });
            }
        }


        if (!ingreso) {
            return res.status(400).send();
        }

        res.send(ingreso);

    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;