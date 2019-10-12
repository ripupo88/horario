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
    console.log('XXXXXXXXXXXXXXXXXX', message);
    if (message.location != undefined || message.text == 'Cancelar') {
        eventEmitter.emit('respuesta', message);
    } else {
        eventEmitter.emit('message', message);
    }
});

api.on('inline.callback.query', function(message) {
    api.answerCallbackQuery(
        {
            callback_query_id: message.id,
            text: 'prosesando'
        },
        (err, res) => {
            if (err) console.log('error', err);

            console.log('res', res, message);
        }
    );
});

module.exports = { eventEmitter };
