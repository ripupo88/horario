"use strict";
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/horariodb', { useNewUrlParser: true });

const Usuario = require('./schemas/usuario');
const Registro = require('./schemas/registro');

let f_nuevo_usuario = () => {
    let usuario = new Usuario({
        nombre: "Richar Pupo",
        nif: "Y4907588T",
        role: "ADMIN_ROLE",
        alias: "Richar",
        correo: "ripupo88@gmail.com",
        telegram_id: "6545456186465"
    });

    usuario.save((err, res) => {
        if (err) console.log(err);
        console.log(res);
    });
}

let f_nueva_entrada = () => {
    let registro = new Registro({
        entrada: Date.now(),
        empleado: "5d63f85511189525fcc7e37f"
    });

    registro.save((err, res) => {
        if (err) console.log(err);
        console.log(res);
    });
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

module.exports = { f_confirma_telegram_id };