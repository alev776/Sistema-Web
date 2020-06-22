const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const ventaSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    tipo_comprobante: {
        type: String,
        required: true
    },
    num_comprobante: {
        type: Number,
        required: true
    },
    serie_comprobante: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now()
    },
    impuesto: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        default: 'Activo'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    ventas: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Detalle_Venta'
    },
    detalles: {
        type: Array
    }
},{ toJSON: { virtuals: true } });

ventaSchema.plugin(uniqueValidator, { message: 'Expected {PATH} to be unique' });

ventaSchema.virtual('detalle', {
    ref: 'Detalle_Venta',
    localField: '_id',
    foreignField: 'ventaId'
});

const Venta = mongoose.model('Venta', ventaSchema);

module.exports = Venta;