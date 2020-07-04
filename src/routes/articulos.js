const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');
const Articulos = require('../models/articulos');
const Categorias = require('../models/categorias');

router.post('/articulos', auth, async(req, res) => {
    const articulos = new Articulos({
        ...req.body,
        owner: req.user._id
    });

    try {
        await articulos.save();
        res.status(201).send(articulos)
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/articulos', auth, async(req, res) => {
    try {
        const articulos = await Articulos.find({ owner: req.user._id });

        articulos.forEach(x => {
            const categoria = Categorias.find({ _id: x.categoria});
            categoria.then(el => {
                const nombreCategoria = {}
                nombreCategoria.nombre = el.nombre;
                nombreCategoria._id = el._id;
                x.nombreCategoria = nombreCategoria
            })
        });

        if (!articulos) {
            return res.status(404).send();
        }
        res.send(articulos);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/articulo/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try {
        const articulo = await Articulos.findOne({
            _id,
            owner: req.user._id
        });

        if (!articulo) {
            return res.status(404).send();
        }

        res.send(articulo);
    } catch (error) {
        res.status(500).send();
    }
});

router.patch('/articulo/:id', auth, async(req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);

    try {
        const articulo = await Articulos.findOne({ _id, owner: req.user._id });

        if (!articulo) {
            res.status(404).send();
        }

        updates.forEach(x => articulo[x] = req.body[x]);
        await articulo.save();

        res.send(articulo);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/articulo/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try {
        const articulo = await Articulos.findOneAndDelete({
            _id,
            owner: req.user._id
        });

        if (!articulo) {
            return res.status(404).send();
        }

        res.send(articulo);
    } catch (error) {
        res.status(400).send();
    }
});



module.exports = router;