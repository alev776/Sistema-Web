const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const proveedorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    tipo_persona: {
        type: String,
        maxlength: 20,
        default: 'Proveedor'
    },
    tipo_documento: {
        type: String,
        maxlength: 10,
        required: true,
        uppercase: true,
        trim: true
    },
    num_documento: {
        type: Number,
        required: true,
        maxlength: 30,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        lowercase: true,
        maxlength: 80,
    },
    telefono: {
        type: Number,
        required: true,
        trim: true,
        maxlength: 16
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error('Not valid email')
            }
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

proveedorSchema.plugin(uniqueValidator, { message: 'Expected {PATH} to be unique' });

const Proveedor = mongoose.model('Proveedor', proveedorSchema);

module.exports = Proveedor;