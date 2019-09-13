const telegram = require('telegram-bot-api');
const telegram_config = require('../privado/telegram.config');
const events = require('events');

// Create an eventEmitter object
let eventEmitter = new events.EventEmitter();

let api = new telegram({
    token: telegram_config.telegram_config.token,
    updates: { enabled: true }
});

api.on('message', function(message) {
    if (message.location != undefined || message.text == 'Cancelar') {
        eventEmitter.emit('respuesta', message);
    } else {
        eventEmitter.emit('message', message);
    }
});

module.exports = { eventEmitter };
