const express = require('express');
const router = new express.Router();
const Proveedor = require('../models/proveedor');
const auth = require('../middlewares/auth');

router.post('/proveedores', auth, async(req ,res) => {
    const proveedor = new Proveedor({
        ...req.body,
        owner: req.user._id
    });

    try {
        await proveedor.save();
        res.status(201).send(proveedor);
    } catch (error) {
        res.status(400).send(error);
    }

});

router.get('/proveedores', auth, async(req, res) => {

    try {
        await req.user.populate({
            path: 'proveedores',
            options: {
                limit: req.query.limit
            }
        }).execPopulate();

        res.send(req.user.proveedores);
    } catch (error) {
        res.status(400).send(error)
    }

});

router.get('/proveedor/:id', auth, async(req ,res) => {
    const _id = req.params.id;

    try {
        const proveedor = await Proveedor.findOne({
            _id,
            owner: req.user._id
        });

        if (!proveedor) {
            return res.status(404).send();
        }

        res.send(proveedor);
    } catch (error) {
        res.status(400).send(error);
    }

});

router.patch('/proveedor/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try {
        const proveedor = await Proveedor.findOneAndUpdate({
            _id,
            owner: req.user._id
        }, req.body, { new: true, runValidators: true, context: 'query' });

        if (!proveedor) {
            return res.status(404).send();
        }

        res.send(proveedor);
    } catch (error) {
        res.status(500).send(error);
    }

});

router.delete('/proveedor/:id', auth, async(req ,res) => {
    const _id = req.params.id;

    try {
        const proveedor = await Proveedor.findOneAndDelete({
            _id,
            owner: req.user._id
        });

        res.send(proveedor);
    } catch (error) {
        res.status(400).send(error);
    }

});

module.exports = router;

