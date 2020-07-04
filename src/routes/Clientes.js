const Cliente = require('../models/cliente');
const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');

router.post('/clientes', auth, async(req ,res) => {
    const cliente = new Cliente({
        ...req.body,
        owner: req.user._id
    });

    try {
        await cliente.save();
        res.status(201).send(cliente);
    } catch (error) {
        res.status(400).send(error);
    }

});

router.get('/clientes', auth, async(req, res) => {
    try {
        await req.user.populate({
            path: 'clientes',
            options: {
                limit: req.query.limit
            }
        }).execPopulate();

        res.send(req.user.clientes);
    } catch (error) {
        res.status(400).send(error);
    }

});

router.get('/cliente/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try {
        const cliente = await Cliente.findOne({
            _id,
            owner: req.user._id
        });

        if (!cliente) {
            res.status(404).send();
        }

        res.send(cliente);
    } catch (error) {
        res.status(400).send(error);
    }

});

router.patch('/cliente/:id', auth, async(req ,res) => {
    const _id = req.params.id;

    try {
        const cliente = await Cliente.findOneAndUpdate({
            _id, owner: req.user._id
        },  req.body, { new: true, runValidators: true, context: 'query'});

        if (!cliente) {
            res.status(404).send();
        }

        res.send(cliente);
    } catch (error) {
        res.status(400).send(error);
    }

});

router.delete('/cliente/:id', auth, async(req ,res) => {
    const _id = req.params.id;

    try {
        const cliente = await Cliente.findOneAndDelete({ _id, owner: req.user._id});

        if (!cliente) {
            res.status(400).send()
        }

        res.send(cliente);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;