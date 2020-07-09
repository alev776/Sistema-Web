const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');
const Venta = require('../models/venta');
const Proveedor = require('../models/proveedor');
const Detalle_Venta = require('../models/detalle_venta');

router.post('/ventas', auth, async(req, res) => {
    const venta = new Venta({
        ...req.body,
        owner: req.user._id
    });

    try {
        await venta.save();

        const detalles = await Detalle_Venta.toObject(req.body.detalle, venta._id);
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

        req.user.ventas.forEach(element => {
            const detalles = Detalle_Venta.find({ventaId: element._id});
            detalles.then(el => {
                el.forEach(detalle => {
                    if (detalle.length) {
                        element.detalles.forEach(el => {
                            const isAdded = el._id === detalle._id;
                            console.log(isAdded);
                            if (isAdded) {
                                element.detalles.push(detalle);
                            }
                        })
                    } else {
                        const isAdded = el._id === detalle._id;
                            console.log(isAdded);
                        element.detalles.push(detalle);
                    }
                });
                });
                element.save();
        });
        res.send(req.user.ventas);
    } catch (error) {
        res.status(400).send(error);
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

    try {
        const venta = await Venta.findOneAndUpdate({
            _id,
            owner: req.user._id
        }, req.body, { new: true, runValidators: true });

        if (!venta) {
            return res.status(404).send();
        }

        res.send(venta)
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

        if (!venta) {
            return res.status(404).send()
        }

        res.send(venta);
    } catch (error) {
        res.status(400).send(error);
    }

});

module.exports = router;