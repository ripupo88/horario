'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Usuario = mongoose.model('usuario');

const registro_schema = new mongoose.Schema({
    entrada: Date,
    fin: {
        type: Boolean,
        default: false
    },
    salida: Date,
    jornada: Number,
    empleado: {
        type: Schema.ObjectId,
        ref: "'usuario"
    }
});

module.exports = mongoose.model('registro', registro_schema);