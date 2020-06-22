const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const detalle_ventaSchema = new mongoose.Schema({
    idArticulo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    descuento: {
        type: Number,
        required: true
    },
    ventaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venta'
    }
},{ toJSON: { virtuals: true } });

detalle_ventaSchema.statics.toObject = async(arr, _id) => {
    let rv = arr;
    for (let i = 0; i < arr.length; ++i)
        rv[i].ventaId = _id
    return rv;
}

const Detalle_Venta = mongoose.model('Detalle_Venta', detalle_ventaSchema);

module.exports = Detalle_Venta;