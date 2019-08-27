const mongo = require('../mongo/mongodb');
const enviar = require('../telegram/enviar');

let f_procesa_crear = (message) => {
    mongo.f_confirma_telegram_id(message.from.id)
        .then(creador_mensaje => {

            if (creador_mensaje[0] != undefined) {

                if (creador_mensaje[0].role == "ADMIN_ROLE") {

                    enviar.f_manda_mensaje(message.chat.id, 'Itroduzca nombre y apellidos');

                } else {

                    enviar.f_manda_mensaje(message.chat.id, 'No tiene privilegios para realizar esta operación');
                }
            } else {
                enviar.f_manda_mensaje(message.chat.id, 'Su ID no aparece en nuestra base de datos');
            }
        })
        .catch(err => {
            console.log(err);
        });
}

let f_nombre = (nombre) => {
    console.log('En creando nombre');
    console.log("creando", nombre);
}

module.exports = { f_procesa_crear, f_nombre, creando };