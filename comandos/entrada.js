const mongo = require('../mongo/mongodb');
const enviar = require('../telegram/enviar');
const confirmar = require('../telegram/confirmacion');

let f_procesa_entrada = (message) => {

    console.log(message.from.id);
    console.log(message.from.id);

    mongo.f_confirma_telegram_id(message.from.id)
        .then(empleado => {

            console.log(empleado[0].alias);
            var f = new Date(message.date);
            cad = f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();

            confirmar.f_confirmacion(message, `Hola ${empleado[0].alias} quieres fichar tu entrada a las ${cad}?`)
                .then(data => {


                    //llamar a mongo
                    console.log('hasta aqui perfecto');

                }).catch(err => {
                    enviar.f_manda_mensaje(message.chat.id, err)
                })

        }).catch(err => {
            console.log('usuario no autorizado', err);
        });
}

module.exports = { f_procesa_entrada };