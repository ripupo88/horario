const telegram = require('telegram-bot-api');
const telegram_config = require('../privado/telegram.config');
const events = require('events');

// Create an eventEmitter object
let eventEmitter = new events.EventEmitter();

var api = new telegram({
    token: telegram_config.telegram_config.token
});

let escucha_eventos = (message) => {


    console.log(message.from.id);
    console.log(message.message.reply_to_message.from.id);
}

let KeyBoard = {
    inline_keyboard: [
        [{
                text: 'Confirmar',
                callback_data: 'si'
            },
            {
                text: 'Cancelar',
                callback_data: 'no'
            }
        ]
    ],
    one_time_keyboard: true
};

let f_confirmacion = (message, text) => {

    return new Promise((resolve, reject) => {

        api.sendMessage({
            chat_id: message.chat.id,
            text,
            reply_to_message_id: message.message_id,
            reply_markup: JSON.stringify(KeyBoard)
        });



        setTimeout(() => {
            reject('tiempo')
        }, 20000);
    });
}

module.exports = { f_confirmacion, escucha_eventos };