const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

//para navegar por el file system
const fs = require('fs');
// para crear un path desde esta ruta al filesystem
const path = require('path');


//MODELOS
const Usuario = require('../models/usuario');
const Productos = require('../models/producto');


//default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;

    let id = req.params.id;

    //      Validamos que se mande un archivo para subir
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    };
    //      obtenemos el archivo y serparamos su nombre y  extension
    let archivo = req.files.archivo

    let separador = archivo.name.split('.')
    let extension = separador[separador.length - 1]

    //antes de subir archivos debemos verificar donde se va a subir y quien lo va a subir
    let tiposValidos = ['productos', 'usuarios']

    //                 recorremos el arreglo en busca de roles permitidos
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
                type: tipo
            }
        })
    }





    //Extensiones Permitidas
    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: { //                                       Arreglo de las extensiones separadas por comas
                message: 'las extensiones permitidas son' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    };

    //cambiamos nombre al archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    //          
    archivo.mv(`uploads/${tipo}/${nombreArchivo }`, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };


        //Llamamos la funcion guardar imagen de perfil de un usuario o producto 
        if (tipo === 'usuarios') {

            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);

        }


    });

});





//====================================================================================================
//Mandamos el id, res, y el nombre del archivo por referencia
function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        //Controlamos los errores
        if (err) {
            //borramos el archivo si se produce algun error para no llenar el servidor de basura
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!usuarioDB) {
            //borramos el archivo si se produce algun error para no llenar el servidor de basura
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        };

        //llamamos la funcion para borrar la imagen si existe
        borraArchivo(usuarioDB.img, 'usuarios');
        // sino continua con el resto del codigo   

        // Asignamos el archivo al campo de la base  de datos
        usuarioDB.img = nombreArchivo;
        //Guardamos la imagen.
        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });
    });

};

//====================================================================================================


function imagenProducto(id, res, nombreArchivo) {

    Productos.findById(id, (err, productoDB) => {
        //Controlamos los errores
        if (err) {
            //borramos el archivo si se produce algun error para no llenar el servidor de basura
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            //borramos el archivo si se produce algun error para no llenar el servidor de basura
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        };

        //llamamos la funcion para borrar la imagen si existe
        borraArchivo(productoDB.img, 'productos');
        // sino continua con el resto del codigo   

        // Asignamos el archivo al campo de la base  de datos
        productoDB.img = nombreArchivo;
        //Guardamos la imagen.
        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });

        });
    });

};

//====================================================================================================
//funcion para reutilizar


function borraArchivo(nombreImagen, tipo) {
    //Verificar que una ruta exista antes de borrarla

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    //si existe la imagen nos retorna un true 
    if (fs.existsSync(pathImagen)) {
        //se borra la imagen anterior
        fs.unlinkSync(pathImagen);
    }
};
//====================================================================================================
module.exports = app;