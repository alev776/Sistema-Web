const Ingresos = require('../models/ingresos');
const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');

router.post('/ingresos', auth, async(req ,res) => {
    const ingreso = new Ingresos({
        ...req.body,
        owner: req.user._id
    });

    try {
        await ingreso.save();
        res.status(201).send(ingreso);
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

        res.send(req.user.ingresos);
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
        if (!ingreso) {
            return res.status(400).send();
        }

        res.send(ingreso);

    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;