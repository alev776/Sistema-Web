const mongoose = require('mongoose');
const validator = require('validator');

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        maxlength: 30
    },
    descripcion: {
        type: String
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

const Categorias = mongoose.model('Categorias', categoriaSchema);

module.exports = Categorias;