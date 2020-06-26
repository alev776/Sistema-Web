const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('The password must not contain its own word')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('The age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: String
    }

}, {
    timestamps: true
});

userSchema.virtual('categorias', {
    ref: 'Categorias',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.virtual('ingresos', {
    ref: 'Ingresos',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.virtual('clientes', {
    ref: 'Cliente',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.virtual('proveedores', {
    ref: 'Proveedor',
    localField: '_id',
    foreignField: 'owner'
});
userSchema.virtual('ventas', {
    ref: 'Venta',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function() {

    const userObject = this.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compareSync(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, {expiresIn: '1h'});

    this.tokens = this.tokens.concat({ token });
    await this.save();

    return token;
}

userSchema.pre('save', async function(next) {

    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
