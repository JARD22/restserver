const express = require('express')

let { VerificaToken, Verifica_Admin_Role } = require('../middlewares/autorizacion')

let app = express();

let Categoria = require('../models/categoria');

app.get('/categoria', VerificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias

            });
        });
})
app.get('/categoria/:id', VerificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe esa categoria'
                }
            });
        };

        res.json({
            ok: true,
            categoriaDB
        });

    });

});



app.post('/categoria', VerificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});




app.put('/categoria/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let descCategoria = {

        descripcion: body.descripcion
    };


    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            res.status(500).json({
                ok: true,
                err
            });
        };

        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});



app.delete('/categoria/:id', [VerificaToken, Verifica_Admin_Role], (req, res) => {
    //Solo un administrador puede borrar la categoria
    // categoria.findbyIdAndRemove

    let id = req.params.id

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });

        };

        if (!categoriaDB) {
            res.status(500).json({
                ok: false,
                err: { message: 'Categoria no encontrada' }
            });
        };

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })

    })

})


module.exports = app;