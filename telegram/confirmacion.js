const telegram = require('telegram-bot-api');
const telegram_config = require('../privado/telegram.config');
const events = require('events');

// Create an eventEmitter object
let eventEmitter = new events.EventEmitter();

var api = new telegram({
    token: telegram_config.telegram_config.token
});

let escucha_eventos = (message) => {
    console.log('evento 3');
    var confirmacion;
    if (message.from.id === message.message.reply_to_message.from.id) {
        if (message.data === 'si') {
            console.log('selected SI');
            confirmacion = true;
        } else {
            console.log('selected NOOOO');
            confirmacion = false;
        }

        eventEmitter.emit('respu', confirmacion);
    }
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

var mensaje_id;
let f_confirmacion = (message, text) => {

    return new Promise((resolve, reject) => {
        console.log('inicio promesa');
        api.sendMessage({
            chat_id: message.chat.id,
            text,
            reply_to_message_id: message.message_id,
            reply_markup: JSON.stringify(KeyBoard)
        }, (err, res) => {
            console.log('enviando mensaje');
            if (err) console.log(err);

            mensaje_id = res.message_id;
        });

        var terminado = false;

        eventEmitter.once('respu', confirmacion => {
            console.log('salta evento');
            clearTimeout(time_fuera);
            terminado = true;
            if (confirmacion == true) {
                console.log('confirmacion y borrando ', mensaje_id);
                api.deleteMessage({
                    chat_id: message.chat.id,
                    message_id: mensaje_id
                })
                return resolve('ha aceptado');
            } else {
                console.log('cancelacion y borrando ', mensaje_id);
                api.deleteMessage({
                    chat_id: message.chat.id,
                    message_id: mensaje_id
                })
                return reject('Has cancelado la operación');
            }
            clearTimeout(this);
        });

        let time_fuera = setTimeout(() => {
            if (!terminado) {
                console.log('tiempo y borrando ', mensaje_id);
                api.deleteMessage({
                    chat_id: message.chat.id,
                    message_id: mensaje_id
                })
                return reject('tiempo limite excedido');
            }
            console.log(mensaje_id);
            mensaje_id = null;
        }, 10000);

    });
}

module.exports = { f_confirmacion, escucha_eventos };