const telegram = require('telegram-bot-api');
const comandos = require('../comandos/comandos');
const telegram_config = require('../privado/telegram.config');
const crear = require('../comandos/crear');

var api = new telegram({
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