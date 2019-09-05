const mongoose = require('mongoose');


const Scheema = mongoose.Schema;

let categoriaSchema = new Scheema({

    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripcion es necesaria']
    },
    usuario: {
        type: Scheema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);