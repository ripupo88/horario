const telegram = require('telegram-bot-api');
const telegram_config = require('../privado/telegram.config');

var api = new telegram({
    token: telegram_config.telegram_config.token
});

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

let f_confirmacion = (chat_id, text) => {

    return new Promise((resolve, reject) => {

        api.sendMessage({
            chat_id,
            text,
            reply_markup: JSON.stringify(KeyBoard)
        });

        api.on('inline.callback.query', function(message) {
            api.answerCallbackQuery({
                callback_query_id: message.id,
                text: 'confirmado'
            })
        });
        setTimeout(() => {
            reject('tiempo')
        }, 20000);
    });
}

module.exports = { f_confirmacion };