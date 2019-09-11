const telegram = require('telegram-bot-api');
const telegram_config = require('../privado/telegram.config');
const events = require('events');

// Create an eventEmitter object
let eventEmitter = new events.EventEmitter();

let api = new telegram({
  token: telegram_config.telegram_config.token,
  updates: {
    enabled: true,
    get_interval: 3000,
    pooling_timeout: 2000
  }
});

api.on('message', function(message) {
  if (message.location != undefined || message.text == 'Cancelar') {
    eventEmitter.emit('respuesta', message);
  } else {
    eventEmitter.emit('message', message);
  }
});

// api.on("inline.callback.query", function(message) {
//   api.answerCallbackQuery({
//     callback_query_id: message.id,
//     text: message.data
//   });
//   eventEmitter.emit("respuesta", message);
// });

module.exports = { eventEmitter };
