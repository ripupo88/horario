'use strict';

const mongoose = require('mongoose');

const usuario_schema = new mongoose.Schema({
    nombre: String,
    nif: String,
    alias: String,
    correo: String,
    telegram_id: Number,
    activo: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('usuario', usuario_schema);