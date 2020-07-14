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
    ventaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

detalle_ventaSchema.statics.toObject = (arr, _id, owner) => {
    let rv = arr;
    for (let i = 0; i < arr.length; ++i){
        rv[i].ventaId = _id;
        rv[i].owner = owner;
        rv[i].idArticulo = arr[i]._id
        delete rv[i]._id
    }
        return rv;
}


const Detalle_Venta = mongoose.model('Detalle_Venta', detalle_ventaSchema);

module.exports = Detalle_Venta;