const mongoose = require('mongoose');
const validator = require('validator');

const clienteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    tipo_persona: {
        type: String,
        trim: true,
        maxlength: 25
    },
    tipo_documento: {
        type: String,
        trim: true,
        maxlength: 20
    },
    numero_documento: {
        type: Number,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        maxlength: 80
    },
    telefono: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error('Email is invalid');
            }
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;