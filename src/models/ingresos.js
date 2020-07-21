const mongoose = require('mongoose');

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
        default: new Date
    },
    impuesto: {
        type: Number
    },
    total: {
        type: Number,
        default: 0
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