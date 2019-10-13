const telegram = require('telegram-bot-api');
const telegram_config = require('../privado/telegram.config');
const events = require('events');
const mongo = require('../mongo/mongodb');

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
            let KeyBoard = {
                inline_keyboard: [[]]
            };
            if (err) console.log('error', err);
            let re = /entrada/gi;
            let result = re.exec(message.message.text);
            if (result != null) {
                mongo.f_validador(message.data, 'entrada');
            } else if (message.data != 'no') {
                mongo.f_validador(message.data, 'salida');
            }

            api.editMessageReplyMarkup({
                chat_id: message.message.chat.id,
                message_id: message.message.message_id,
                reply_markup: JSON.stringify(KeyBoard)
            });
        }
    );
});

module.exports = { eventEmitter };
