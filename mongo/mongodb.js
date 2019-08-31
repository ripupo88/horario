"use strict";
const mongoose = require('mongoose');
const moment = require('moment');

mongoose.connect('mongodb://localhost/horariodb', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

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

let f_nueva_salida = (salida, empleado) => {
    return new Promise((resolve, reject) => {

        encuentra_entrada(empleado, salida).then(duration => {

            Registro.findOneAndUpdate({ empleado: empleado, fin: false }, { salida, fin: true, jornada: duration }, (err, res) => {
                if (err) console.log(err);
                resolve({
                    res,
                    jornada: duration
                })
            });

        }).catch(err => { console.log(err) });
    });
}

let encuentra_entrada = (empleado, salida) => {
    return new Promise((resolve, reject) => {
        Registro.find({ empleado: empleado, fin: false }, (err, res) => {
            if (err) reject(err);
            var duration = moment.duration(new moment(salida).diff(new moment(res[0].entrada)));
            resolve(duration);
        })
    })
}


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

module.exports = { f_confirma_telegram_id, f_nuevo_usuario, confirma_entrada, f_nueva_entrada, f_nueva_salida };