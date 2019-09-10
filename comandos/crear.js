const mongo = require('../mongo/mongodb');
const enviar = require('../telegram/enviar');
const confirmar = require('../telegram/confirmacion');

let f_procesa_crear = async message => {
  try {
    let creador_mensaje = await mongo.f_confirma_telegram_id(message.from.id);

    if (creador_mensaje.role == 'ADMIN_ROLE') {
      let mensaje_separado = message.text.split(',');

      let nuevo_usuario = {
        nombre: mensaje_separado[0].replace(/\/crear /g, '').trim(),
        nif: mensaje_separado[1].trim(),
        alias: mensaje_separado[2].trim(),
        telegram_id: message.reply_to_message.from.id
      };

      let usuario = await mongo.f_nuevo_usuario(nuevo_usuario);

      enviar.f_manda_mensaje(message.chat.id, `${usuario.alias} añadido`);
    } else {
      throw new Error('No tiene privilegios para realizar esta operación');
    }
  } catch (e) {
    enviar.f_manda_mensaje(message.chat.id, e.toString());
  }
};

module.exports = { f_procesa_crear };
