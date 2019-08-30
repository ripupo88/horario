const mongo = require('../mongo/mongodb');
const enviar = require('../telegram/enviar');
const confirmar = require('../telegram/confirmacion');
const moment = require('moment');

let f_procesa_entrada = (message) => {
    return new Promise((resolve, reject) => {
        f_procesando_entrada(message).then(data => {
            console.log('entrada fichada');
            resolve();
        }).catch(err => {
            console.log(err);
            console.log(message.chat.id);
            enviar.f_manda_mensaje(message.chat.id, err.toString());
            resolve();
        });
    })
}

//procesamos el comando /entrada
let f_procesando_entrada = async(message) => {

    //paso 1- el que lo ejecutó esté en la DB ... devuelve el user de la DB
    let empleado = await mongo.f_confirma_telegram_id(message.from.id);

    //paso 2- verificar que no tenga una entrada ya abierta ... devuelve la entrada abierta si existe
    let registro = await mongo.confirma_entrada(empleado);

    //si hay turno abierto lanza error
    await si_hay(registro);

    //pedir confirmacion al empleado
    await confirmar.f_confirmacion(message, `Hola ${empleado[0].alias} quieres fichar tu entrada a las ${moment.unix(message.date).format('HH:mm:ss')}?`);

    //registrar en la DB
    let entrada_fichada = await mongo.f_nueva_entrada(moment.unix(message.date).toISOString(), empleado[0].id);

    //notifica usuario
    await notifica_usuario(message.chat.id, entrada_fichada, empleado[0].alias);
    //notifica jefes

}

let notifica_usuario = async(chat_id, entrada, empleado) => {
    let fecha = moment(entrada.entrada).format('DD-MM-YYYY');;
    let hora = moment(entrada.entrada).format('HH:mm:ss');
    let text = `${empleado} ha fichado su entrada\na las ${hora}\n el dia ${fecha}`;
    enviar.f_manda_mensaje(chat_id, text);
}

let si_hay = async(registro) => {
    if (registro[0] != undefined) {
        throw new Error('Ya tienes un turno abierto, ficha la salida.')
    } else {
        return;
    }
}

module.exports = { f_procesa_entrada };