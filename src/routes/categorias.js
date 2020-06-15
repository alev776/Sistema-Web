const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');
const Categorias = require('../models/categorias');

router.post('/categorias', auth, async(req, res) => {
    const categoria = new Categorias({
        ...req.body,
        owner: req.user._id
    });

    try {
        await categoria.save();
        res.status(201).send(categoria);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/categorias', auth, async(req, res) => {
    try {
        await req.user.populate({
            path: 'categorias',
            options: {
                limit: req.query.limit
            }
        }).execPopulate();

        res.send(req.user.categorias)
    } catch (error) {
        res.status(404).send(error);
    }

});

router.get('/categoria/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try {
        const categoria = await Categorias.findOne({ _id, owner: req.user._id});

        if (!categoria) {
            return res.status(404).send();
        }

        res.send(categoria);
    } catch (error) {
        res.status(405).send(error);
    }

});

router.patch('/categoria/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body);

    try {
        const categoria = await Categorias.findOne({ _id: req.params.id, owner: req.user._id});

        if (!categoria) {
            return res.status(404).send();
        }

        updates.forEach(x => categoria[x] = req.body[x]);
        await categoria.save();

        res.send(categoria);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/categoria/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try {
        const categoria = await Categorias.findOneAndDelete({ _id, owner: req.user._id });
        if (!categoria) {
            return res.status(400).send();
        }

        res.send(categoria);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;