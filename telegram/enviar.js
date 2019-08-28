const telegram = require('telegram-bot-api');
const telegram_config = require('../privado/telegram.config');

var api = new telegram({
    token: telegram_config.telegram_config.token
});


let f_manda_mensaje = (chat_id, text) => {
    api.sendMessage({
        chat_id,
        text
    });
}

module.exports = { f_manda_mensaje };