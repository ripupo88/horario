const mongo = require('../mongo/mongodb');
const enviar = require('../telegram/enviar');
const confirmar = require('../telegram/confirmacion');
const moment = require('moment');

let f_procesa_salida = async message => {
    try {
        if (message.from.id != message.chat.id)
            throw new Error('Solo se puede fichar desde el chat privado');
        let empleado = await mongo.f_confirma_telegram_id(message.from.id);
        if (empleado.role == 'ADMIN_ROLE')
            throw new Error('Los administradores no fichan');
        let registro = await mongo.confirma_entrada(empleado);
        if (registro[0] == undefined)
            throw new Error('No tienes fichada una entrada, ficha la entrada.');
        let res_confirma = await confirmar.f_confirmacion(
            message,
            `Hola ${
                empleado.alias
            }, ¿quieres fichar tu salida a las ${moment
                .unix(message.date)
                .format('HH:mm')}?`
        );
        if (res_confirma) {
            //registrar en la DB
            let salida_fichada = await mongo.f_nueva_salida(
                moment.unix(message.date).toISOString(),
                empleado.id,
                res_confirma
            );
            let admin_empresa = await mongo.f_obten_admin(empleado.id);

            await notifica_usuario(
                admin_empresa.empresa.admin.telegram_id,
                salida_fichada,
                empleado.alias,
                '\nubicación confirmada'
            );
            //notifica usuario
            await notifica_usuario(
                message.chat.id,
                salida_fichada,
                empleado.alias,
                '\nubicación confirmada'
            );
            //notifica jefes
        } else {
            //registrar en la DB
            let salida_fichada = await mongo.f_nueva_salida(
                moment.unix(message.date).toISOString(),
                empleado.id,
                res_confirma
            );
            //notifica usuario
            let admin_empresa = await mongo.f_obten_admin(empleado.id);

            await notifica_usuario(
                admin_empresa.empresa.admin.telegram_id,
                salida_fichada,
                empleado.alias,
                '\nfuera de ubicación, esto marcará un incidente en su registro'
            );

            await notifica_usuario(
                message.chat.id,
                salida_fichada,
                empleado.alias,
                '\nfuera de ubicación, esto marcará un incidente en su registro'
            );
        }
    } catch (err) {
        console.log(err);
        console.log(message.chat.id);
        enviar.f_manda_mensaje(message.chat.id, err.toString());
        resolve();
    }
};

let notifica_usuario = async (chat_id, entrada, empleado, location) => {
    let fecha = moment(entrada.res.salida).format('DD-MM-YYYY');
    let hora = moment(entrada.res.salida).format('HH:mm:ss');
    let duracion = entrada.jornada;
    let horas = duracion.hours();
    let minutos = duracion.minutes();
    let text = `${empleado} ha fichado su salida\na las ${hora}\nel dia ${fecha}\nsu jornada ha durado\n${horas} horas ${minutos} minutos${location}`;
    enviar.f_manda_mensaje(chat_id, text);
};

module.exports = { f_procesa_salida };
