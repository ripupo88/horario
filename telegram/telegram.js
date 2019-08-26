const telegram = require('telegram-bot-api');
const comandos = require('../comandos/comandos');

var api = new telegram({
    token: '915983007:AAF9M2Xja48XvzAjjqORHd7MRLhxak5NLUA',
    updates: {
        enabled: true
    }
});

api.on('message', function(message) {
    // Received text message
    comandos.f_procesa_comando(message);
});