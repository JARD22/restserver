const express = require('express');
const app = express();

let { VerificaToken } = require('../middlewares/autorizacion');

//Requerimos el modelo
let Producto = require('../models/producto');


//=========================
//OBTENER TODOS LOS PRODUCTOS
//=========================

app.get('/productos', VerificaToken, (req, res) => {

    let body = req.body;
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let hasta = req.query.hasta || 10
    hasta = Number(hasta);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            if (!productos) {
                return res.json({
                    ok: false,
                    message: 'No hay productos disponibles'
                });

            };
            res.json({
                ok: true,
                productos
            })

        })


    //Trae todos los prodcutos
    //populate: usuario y categoria
    //paginado
});

//=========================
//OBTENER producto por Id
//=========================

app.get('/productos/:id', VerificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            if (!productoDB) {
                res.status(400).json({
                    ok: false,
                    message: 'No se encuentra ese producto'
                });
            };

            res.json({
                ok: true,
                productoDB
            });

        })


    //populate: usuario y categoria

});

//=========================
//buscar producto
//=========================

app.get('/productos/buscar/:termino', VerificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible: true })
        .populate()
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                productos
            })
        })


});


//=========================
//crear un producto
//=========================

app.post('/productos', VerificaToken, (req, res) => {

    let body = req.body;
    // Creamos una nueva instancia del producto
    let producto = new Producto({

        usuario: req.usuario._id, //Obtenemos del req no lo mandamos en el body.
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria

    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })

    //Grabar el usuario
    //grabar una categoria del listado
});


//=========================
//actualizar un producto
//=========================

app.put('/productos/:id', VerificaToken, (req, res) => {
    let id = req.params.id

    let body = req.body

    Producto.findById(id, (err, productoDB) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                producto: productoGuardado
            });

        })


    })

    //Grabar el usuario
    //grabar una categoria del listado
});

//=========================
//crear un producto
//=========================

app.delete('/productos/:id', VerificaToken, (req, res) => {

    let id = req.params.id

    let CambiaEstado = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, CambiaEstado, { new: true }, (err, ProductoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encuentra ese ID'
                }
            });
        };

        res.json({
            ok: true,
            Producto: ProductoBorrado
        })

    })


    //Grabar el usuario
    //grabar una categoria del listado
})




module.exports = app;