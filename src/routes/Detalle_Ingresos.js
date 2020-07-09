const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');
const Detalle_Ingresos = require('../models/detalle_ingreso');