const express = require('express');
const router = new express.Router();
const Detalle_Venta = require('../models/detalle_venta');
const auth = require('../middlewares/auth');

router.get('/detalle-ventas', auth, async(req ,res) => {
});

module.exports = router;