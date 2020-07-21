const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');
const Venta = require('../models/venta');
const Proveedor = require('../models/proveedor');
const Detalle_Venta = require('../models/detalle_venta');
const _ = require('underscore');

router.post('/ventas', auth, async(req, res) => {
    const venta = new Venta({
        ...req.body,
        owner: req.user._id
    });

    try {
        await venta.save();

        const detalles = Detalle_Venta.toObject(req.body.detalles, venta._id, req.user._id);
        const detalle = await Detalle_Venta.create(detalles);

        res.status(201).send({venta, detalle});
    } catch (error) {
        res.status(400).send(error);
    }

});

router.get('/ventas', auth, async(req, res) => {
    try {
        await req.user.populate({
            path: 'ventas',
            options: {
                limit: req.query.limit
            }
        }).execPopulate();

        const detalles = await Detalle_Venta.find({owner: req.user._id});
        const ventas = req.user.ventas;

        res.send({ventas, detalles});
    } catch (error) {
        res.status(400).send(error);
    }

});

router.get('/ventasByDate/:startDate/:endDate', auth, async(req, res) => {
    const startDate = req.params.startDate
    const endDate = req.params.endDate;
    try {
        if (endDate === '') {
            const ventas = await Venta.find({
                'fecha': {'$gte': startDate}
            });



            const detalles = await Detalle_Venta.find({owner: req.user._id});
            res.send({ventas, detalles});
        }else {
            const ventas = await Venta.find({
                'fecha': {'$gte': startDate, '$lte': endDate}
            });
            const detalles = await Detalle_Venta.find({owner: req.user._id});
            res.send({ventas, detalles});
        }

    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/ventaTotalPorMes/:year', auth, async(req, res) => {
    const year = req.params.year;
    try {
        const fecha = await Venta.aggregate(
            [
                {
                    $match: { owner: req.user._id, year: parseInt(year) }
                },
                {
                    $group: {
                        _id: { $month: { date: "$fecha" } },
                        total: {
                            $sum: '$doc'
                        }
                      }
                },
                { $sort : { fecha : -1} }
            ]
        );

        res.send(fecha)

    } catch (error) {
        res.send(error);
    }
});

router.get('/venta/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {
        const venta = await Venta.findOne({
            _id,
            owner: req.user._id
        });

        if (!venta) {
           return res.status(404).send();
        }

        res.send(venta);
    } catch (error) {
        res.status(400).send(error);
    }

});

router.patch('/venta/:id', auth, async(req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);

    try {
        const venta = await Venta.findOne({
            _id,
            owner: req.user._id
        });

        if (!venta) {
            return res.status(404).send();
        }

        updates.forEach(x => venta[x] = req.body[x]);
        await venta.save();

        const detallesToDelete = await Detalle_Venta.find({ventaId: _id});
        var filteredArray  = detallesToDelete.filter(function(array_el){
            return req.body.detalles.filter(function(anotherOne_el){
               return anotherOne_el._id == array_el._id;
            }).length == 0
         });

         if (filteredArray.length) {
             filteredArray.forEach(async x => {
                 await Detalle_Venta.findByIdAndDelete(x._id);
             });
         }

        var filteredAddArray  = req.body.detalles.filter(function(array_el){
            return detallesToDelete.filter(function(anotherOne_el){
               return anotherOne_el._id == array_el._id;
            }).length == 0
         });

        if (filteredAddArray.length) {
            const arreglo = Detalle_Venta.toObject(filteredAddArray, venta._id, req.user._id);
            arreglo.forEach(async x => {
                const detalleAdd = new Detalle_Venta(x)
                await detalleAdd.save()
            })
        }

        req.body.detalles.forEach(async x => {
            const allowedUpdates = _.pick(x, ['cantidad', 'precio']);
            const detalle = await Detalle_Venta.findOneAndUpdate({_id: x._id}, allowedUpdates, {new: true});
            if (detalle) {
                await detalle.save();
            }
        });

        res.send(venta);
    } catch (error) {
        res.status(500).send(error);
    }

});

router.delete('/venta/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try {
        const venta = await Venta.findOneAndDelete({
            _id,
            owner: req.user._id
        });

        if (venta) {
            const detalleVentas = await Detalle_Venta.find({ventaId: venta._id});
            if (detalleVentas) {
                detalleVentas.forEach(async x => {
                    await Detalle_Venta.findByIdAndDelete(x._id);
                });
            }
        }


        if (!venta) {
            return res.status(400).send();
        }

        res.send(venta);
    } catch (error) {
        res.status(400).send(error);
    }

});

module.exports = router;