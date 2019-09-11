const express = require('express')
const app = express();
const fs = require('fs');
const path = require('path');

let { VerificaTokenImg } = require('../middlewares/autorizacion')

app.get('/imagen/:tipo/:img', VerificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img

    //redireccionamos a una imagenotfound

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImgPath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImgPath);
    }



});


module.exports = app;