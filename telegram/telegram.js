const telegram = require('telegram-bot-api');
const comandos = require('../comandos/comandos');
const telegram_config = require('../privado/telegram.config');
const events = require('events');

// Create an eventEmitter object
let eventEmitter = new events.EventEmitter();

let api = new telegram({
    token: telegram_config.telegram_config.token,
    updates: {
        enabled: true,
        get_interval: 3000,
        pooling_timeout: 2000
    }
});

api.on('message', function(message) {
    // Received text message
    //console.log(message);
    comandos.f_procesa_comando(message);
});

api.on('inline.callback.query', function(message) {
    api.answerCallbackQuery({
        callback_query_id: message.id,
        text: message.data
    }, (err, res) => {
        if (err) console.log('error', err);
        console.log('res', res, message);
        eventEmitter.emit('respuesta', message);
    })
});