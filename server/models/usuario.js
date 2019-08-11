const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


//Validacion de roles permitidos.
let RolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    messsage: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let UsuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']

    },
    password: {
        type: String,
        required: [true, 'la contrase;a es necesaria']

    },
    img: {
        type: String,
        required: false
    },

    role: {
        type: String,
        default: 'USER_ROLE',
        enum: RolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }





});

UsuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;
    return userObject;
};

UsuarioSchema.plugin(uniqueValidator, { messsage: '{PATH} es necesario' });
module.exports = mongoose.model('Usuario', UsuarioSchema);