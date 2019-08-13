//=======================================
//              PUERTO
//=======================================



process.env.PORT = process.env.PORT || 3000;

//=======================================
//              ENTONRO
//=======================================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=======================================
//              BASE DE DATOS
//=======================================

let urlDB;


//=======================================
//              VENCIMIENTO DEL TOKEN
//=======================================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//=======================================
//              SEED AUTENTICACION 
//=======================================


process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/Cafe'
} else {

    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;