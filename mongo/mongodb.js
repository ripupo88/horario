"use strict";
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/horariodb', { useNewUrlParser: true });

const Usuario = require('./schemas/usuario');
const Registro = require('./schemas/registro');

let f_nuevo_usuario = (objeto_usuario) => {

    return new Promise((resolve, reject) => {

        let usuario = new Usuario(objeto_usuario);

        usuario.save((err, res) => {

            if (err) reject(err);

            resolve(res);

        });
    });
};

let confirma_entrada = (empleado) => {
    return new Promise((resolve, reject) => {
        Registro.find({ fin: false, empleado: empleado[0].id }, (err, res) => {
            if (err) reject('error al conectar con base de datos');
            resolve(res);
        });
    })
}

let f_nueva_entrada = (entrada, empleado) => {
    return new Promise((resolve, reject) => {
        let registro = new Registro({
            entrada,
            empleado
        });

        registro.save((err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    })
}

//f_nuevo_usuario();
// f_nueva_entrada();

Registro.find({}, (err, res) => {
    if (err) console.log(err);
    console.log(res);
});


let f_confirma_telegram_id = (telegram_id) => {
    return new Promise((resolve, reject) => {
        Usuario.find({ telegram_id }, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
}

module.exports = { f_confirma_telegram_id, f_nuevo_usuario, confirma_entrada, f_nueva_entrada };