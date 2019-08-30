const mongo = require('../mongo/mongodb');
const enviar = require('../telegram/enviar');
const confirmar = require('../telegram/confirmacion');

let f_procesa_entrada = (message) => {
        f_procesando_entrada(message).then(data => {
            console.log('entrada fichada');
        }).catch(err => {
            console.log(err);
        });
    }
    //procesamos el comando /entrada
let f_procesando_entrada = async(message) => {

    //paso 1- el que lo ejecutó esté en la DB ... devuelve el user de la DB
    let empleado = await mongo.f_confirma_telegram_id(message.from.id);

    //paso 2- verificar que no tenga una entrada ya abierta ... devuelve la entrada abierta si existe
    let registro = await mongo.confirma_entrada(empleado);

    //si hay turno abierto lanza error
    let confirma_registro = await si_hay(registro);


    return 'bien';
    var f = new Date(message.date);
    cad = f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();

    confirmar.f_confirmacion(message, `Hola ${empleado[0].alias} quieres fichar tu entrada a las ${cad}?`)
        .then(data => {


            //llamar a mongo
            console.log('hasta aqui perfecto');

        }).catch(err => {
            enviar.f_manda_mensaje(message.chat.id, err)
        })
}

let si_hay = async(registro) => {
    if (registro[0] != undefined) {
        throw new Error('Ya tienes un turno abierto, ficha la salida.')
    } else {
        return;
    }
}

module.exports = { f_procesa_entrada };