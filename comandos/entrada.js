const mongo = require('../mongo/mongodb');
const enviar = require('../telegram/enviar');
const confirmar = require('../telegram/confirmacion');
const moment = require('moment');

let f_procesa_entrada = async message => {
    try {
        if (message.from.id != message.chat.id)
            throw new Error('Solo se puede fichar desde el chat privado');
        let empleado = await mongo.f_confirma_telegram_id(message.from.id);
        if (empleado.role == 'ADMIN_ROLE')
            throw new Error('Los administradores no fichan');
        //paso 2- verificar que no tenga una entrada ya abierta ... devuelve la entrada abierta si existe
        let registro = await mongo.confirma_entrada(empleado);
        if (registro[0] != undefined)
            throw new Error('Ya tienes un turno abierto, ficha la salida.');
        //impide que se pueda fichar 2 veces un mismo dia
        let duplicado = await mongo.f_busca_duplicado(empleado);
        if (duplicado[0] != undefined)
            throw new Error(
                'Hoy ya has fichado, puedes volver a fichar mañana.'
            );

        //pedir confirmacion al empleado
        let res_confirma = await confirmar.f_confirmacion(
            message,
            `Hola ${
                empleado.alias
            }, ¿quieres fichar tu entrada a las ${moment
                .unix(message.date)
                .format('HH:mm')}?`
        );
        if (!res_confirma)
            throw new Error('Su ubicacion NO es correcta, no puede fichar');
        //registrar en la DB
        let entrada_fichada = await mongo.f_nueva_entrada(
            moment.unix(message.date).toISOString(),
            empleado.id
        );
        //notifica usuario y admin
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
    let hora = moment(entrada.entrada).format('HH:mm');
    let text = `${empleado} ha fichado su entrada\na las ${hora}\nel dia ${fecha}`;
    enviar.f_manda_mensaje(chat_id, text);
};

module.exports = { f_procesa_entrada };
