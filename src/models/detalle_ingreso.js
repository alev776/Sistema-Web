const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const detalle_Ingresos = new mongoose.Schema({
    idArticulo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    idIngreso: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

detalle_Ingresos.statics.toObject = (arr, _id, owner) => {
    let rv = arr;
    for (let i = 0; i < arr.length; ++i) {
        rv[i].idIngreso = _id;
        rv[i].owner = owner;
        rv[i].idArticulo = arr[i]._id
        delete rv[i]._id
    }
    return rv;
}

const Detalle_Ingresos = mongoose.model('Detalle_Ingresos', detalle_Ingresos);

module.exports = Detalle_Ingresos;