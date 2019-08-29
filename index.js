require('./mongo/mongodb');
const telegram = require('./telegram/telegram');
const comando = require('./comandos/comandos');
const confirm = require('./telegram/confirmacion');

telegram.eventEmitter.on('message', message => {
    comando.f_procesa_comando(message);
});

telegram.eventEmitter.on('respuesta', message => {
    console.log('evento 2');
    confirm.escucha_eventos(message);
});