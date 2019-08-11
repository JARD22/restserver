//=======================================
//              PUERTO
//=======================================



process.env.PORT = process.env.PORT || 3000;

//=======================================
//              ENTONRO
//=======================================


process.env.NODE_ENV || 'dev';

//=======================================
//              BASE DE DATOS
//=======================================

let urlDB;

if (process.env.NODE_ENV = 'dev') {
    urlDB = 'mongodb://localhost:27017/Cafe'
} else {

    urlDB = 'mongodb+srv://JARD:BZ344SWXcX1SlNmo@basecafe-wavc3.mongodb.net/Cafe?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB;

//'mongodb+srv://JARD:BZ344SWXcX1SlNmo@basecafe-wavc3.mongodb.net/Cafe?retryWrites=true&w=majority'
//'mongodb+srv://JARD:BZ344SWXcX1SlNmo@basecafe-wavc3.mongodb.net/Cafe'