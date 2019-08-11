const express = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express()


//Generando la semilla para la encriptacion
let salt = bcrypt.genSaltSync(10);


// GET
app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    Total_registros: conteo

                });

            });
        });



});

// POST 
app.post('/usuario', function(req, res) {

    //Obtenemos el body(objeto que se manda desde el fronted)
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, salt),
        role: body.role
    });

    usuario.save((err, UsuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
        res.json({
            ok: true,
            UsuarioDB
        })

    });


})


// PUT
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;

    //                             Seleccionamos los unicos campos que se pueden actualizar
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'estado', 'role']);


    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, UsuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: UsuarioDB
        })
    })


});


// DELETE
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    let CambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, CambiaEstado, { new: true }, (err, UsuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        };

        if (!UsuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            UsuarioBorrado
        })
    });
});


module.exports = app;