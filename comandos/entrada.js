const mongo = require('../mongo/mongodb');
const enviar = require('../telegram/enviar');
const confirmar = require('../telegram/confirmacion');
const moment = require('moment');
let mensajes_abiertos = [];
let f_procesa_entrada = async message => {
    try {
        /*ELIMINANDO QUE SE PUEDA FICHAR ENTRADA DOS VECES
         *
         *
         * NO OLVIDAR
         *
         *
         * NO OLVIDAR
         *
         */
        if (mensajes_abiertos[0] != undefined) {
            for (let cada_id of mensajes_abiertos) {
                if (cada_id == message.from.id)
                    throw new Error('Solo una entrada a la vez');
                mensajes_abiertos.push(message.from.id);
            }
        }
        if (message.from.id != message.chat.id)
            throw new Error('Solo se puede fichar desde el chat privado');
        let empleado = await mongo.f_confirma_telegram_id(message.from.id);
        if (empleado.role == 'ADMIN_ROLE')
            throw new Error('Los administradores no fichan');
        let registro = await mongo.confirma_entrada(empleado);
        if (registro[0] != undefined)
            throw new Error('Ya tienes un turno abierto.');
        let duplicado = await mongo.f_busca_duplicado(empleado);
        if (duplicado[0] != undefined) throw new Error('Hoy ya has fichado.');

        let res_confirma = await confirmar.f_confirmacion(
            message,
            `Hola ${
                empleado.alias
            }, ¿quieres fichar tu entrada a las ${moment
                .unix(message.date)
                .format('H:mm')}?`
        );
        if (!res_confirma)
            throw new Error('Su ubicacion NO es correcta, no puede fichar');

        let entrada_fichada = await mongo.f_nueva_entrada(
            moment.unix(message.date).toISOString(),
            empleado.id
        );

        let admin_empresa = await mongo.f_obten_admin(empleado.id);

        await notifica_usuario(
            admin_empresa.empresa.admin.telegram_id,
            entrada_fichada,
            empleado.alias
        );
        await notifica_usuario(
            message.chat.id,
            entrada_fichada,
            empleado.alias
        );
    } catch (err) {
        console.log(err);
        enviar.f_manda_mensaje(message.chat.id, err.toString());
    }
};

let notifica_usuario = async (chat_id, entrada, empleado) => {
    let fecha = moment(entrada.entrada).format('DD-MM-YYYY');
    let hora = moment(entrada.entrada).format('H:mm');
    let text = `*${empleado}* ha fichado su entrada\na las *${hora}*\nel día _${fecha}_`;
    enviar.f_manda_mensaje(chat_id, text);
};

module.exports = { f_procesa_entrada };
