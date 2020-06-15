const mongoose = require('mongoose');

const articuloSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        maxlength: [30, 'El maximo de caracteres es de 30']
    },
    codigo: {
        type: Number,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        default: 0,
        trim: true
    },
    precio_venta: {
        type: Number,
        default: 0,
        trim: true
    },
    descripcion: {
        type: String,
        maxlength: [100, 'El maximo de caracteres es de 100']
    },
    activo: {
        type: String,
        default: 'Activo'
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const Articulo = mongoose.model('Articulo', articuloSchema);

module.exports = Articulo;