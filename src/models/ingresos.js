const mongoose = require('mongoose');

const date = new Date

const ingresoSchema = new mongoose.Schema({
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    tipo_comprobante: {
        type: String,
        required: true
    },
    num_comprobante: {
        type: Number
    },
    serie_comprobante: {
        type: Number
    },
    fecha: {
        type: Date,
        default: date.toISOString().substr(0, 10)
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
    }
});

const Ingresos = mongoose.model('Ingresos', ingresoSchema);

module.exports = Ingresos;