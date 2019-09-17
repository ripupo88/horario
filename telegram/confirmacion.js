const telegram = require('telegram-bot-api');
const telegram_config = require('../privado/telegram.config');
const events = require('events');

// Create an eventEmitter object
let eventEmitter = new events.EventEmitter();

var api = new telegram({
    token: telegram_config.telegram_config.token
});

let escucha_eventos = message => {
    api.deleteMessage({
        chat_id: message.chat.id,
        message_id: message.message_id
    });
    console.log('evento 3', message);
    var confirmacion;
    if (message.location != undefined) {
        confirmacion = f_comprueba_ubicacion(
            message.location.latitude,
            message.location.longitude
        );
    } else {
        confirmacion = 'no';
    }

    eventEmitter.emit('respu', { confirmacion, message });
};

let f_comprueba_ubicacion = (longitud, latitud) => {
    if (
        longitud <= 28.488742 &&
        longitud >= 28.486121 &&
        latitud >= -16.386131 &&
        latitud <= -16.380079
    ) {
        return 'si';
    } else {
        return 'location';
    }
};

let KeyBoard = {
    keyboard: [
        [
            {
                text: 'Confirmar',
                request_location: true
            },
            {
                text: 'Cancelar'
            }
        ]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
};

let f_confirmacion = (message, text) => {
    return new Promise((resolve, reject) => {
        var mensaje_id;
        let borrado = false;
        console.log('inicio promesa');
        api.sendMessage(
            {
                chat_id: message.chat.id,
                text,
                reply_to_message_id: message.message_id,
                reply_markup: JSON.stringify(KeyBoard)
            },
            (err, res) => {
                console.log('enviando mensaje');
                if (err) console.log(err);

                mensaje_id = res.message_id;
            }
        );

        var terminado = false;

        eventEmitter.on('respu', confirm => {
            if (confirm.message.from.id === message.chat.id) {
                console.log('salta evento');
                clearTimeout(time_fuera);
                terminado = true;
                if (confirm.confirmacion == 'si') {
                    console.log('confirmacion y borrando ', mensaje_id);
                    borra_mensaje(message.chat.id, mensaje_id);
                    return resolve(true);
                } else if (confirm.confirmacion == 'location') {
                    console.log('Error de ubicacion', mensaje_id);
                    borra_mensaje(message.chat.id, mensaje_id);
                    return resolve(false);
                } else {
                    console.log('cancelacion y borrando ', mensaje_id);
                    borra_mensaje(message.chat.id, mensaje_id);
                    return reject('Has cancelado la operación');
                }
            }
        });

        let time_fuera = setTimeout(() => {
            console.log('se ejecuta el timeout');
            if (!terminado) {
                console.log('tiempo y borrando ', mensaje_id);
                borra_mensaje(message.chat.id, mensaje_id);
                return reject('tiempo limite excedido');
            }
            console.log(mensaje_id);
            mensaje_id = null;
        }, 13000);

        let borra_mensaje = (chat, messg) => {
            if (!borrado) {
                borrado = true;
                api.deleteMessage({
                    chat_id: chat,
                    message_id: messg
                });
            }
        };
    });
};

module.exports = { f_confirmacion, escucha_eventos };
