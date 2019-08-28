const telegram = require('telegram-bot-api');
const telegram_config = require('../privado/telegram.config');

var api = new telegram({
    token: telegram_config.telegram_config.token
});

let KeyBoard = {
    keyboard: [
        [{
                text: 'Confirmar',
                callback_data: '1-1'
            },
            {
                text: 'Cancelar',
                callback_data: '1-2'
            }
        ]
    ],
    one_time_keyboard: true
};

let f_confirmacion = (chat_id, text) => {

    return new Promise((resolve, reject) => {

        api.sendMessage({
            chat_id,
            text,
            reply_markup: JSON.stringify(KeyBoard),
            one_time_keyboard: true
        });

        api.on('message', function(message) {
            console.log('mensaje deconfr', message);
            if (message.text == 'Confirmar') {
                resolve(message.text);
            } else {
                reject('Cancelar');
            }
        });
        setTimeout(() => {
            reject('tiempo')
        }, 20000);
    });
}

module.exports = { f_confirmacion };