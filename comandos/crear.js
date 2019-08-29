const mongo = require('../mongo/mongodb');
const enviar = require('../telegram/enviar');
const confirmar = require('../telegram/confirmacion');


let f_procesa_crear = (message) => {
    mongo.f_confirma_telegram_id(message.from.id)
        .then(creador_mensaje => {

            if (creador_mensaje[0] != undefined) {
                if (creador_mensaje[0].role == "ADMIN_ROLE") {

                    let mensaje_separado = message.text.split(",");

                    let nombre = mensaje_separado[0].replace(/\/crear /g, "").trim();
                    let nif = mensaje_separado[1].trim();
                    let alias = mensaje_separado[2].trim();
                    let telegram_id = message.reply_to_message.from.id;

                    let nuevo_usuario = {
                        nombre,
                        nif,
                        alias,
                        telegram_id
                    }
                    let texto_confirmacion = `¿confirmas la creacion de ${alias}\nnombre${nombre}\nNIF${nif}\n`;
                    confirmar.f_confirmacion(message, texto_confirmacion)
                        .then(data => {

                            console.log(data);
                            mongo.f_nuevo_usuario(nuevo_usuario)
                                .then(usuario => {
                                    console.log(usuario);
                                    enviar.f_manda_mensaje(message.chat.id, `El usuario ${usuario.alias} ha sido creado`);
                                })
                                .catch(err => {
                                    console.log(err);
                                    enviar.f_manda_mensaje(message.chat.id, err);
                                });

                        })
                        .catch(err => {
                            console.log(err);
                            enviar.f_manda_mensaje(message.chat.id, 'El usuario no se ha creado, ha ocurrido un error');
                        })


                } else {
                    enviar.f_manda_mensaje(message.chat.id, 'No tiene privilegios para realizar esta operación');
                }
            } else {
                enviar.f_manda_mensaje(message.chat.id, 'Su ID no aparece en nuestra base de datos');
            }
        })
        .catch(err => {
            console.log(err);
            enviar.f_manda_mensaje(message.chat.id, 'Ha ocurrido un error');
        });
}

let f_nombre = (nombre) => {
    console.log('En creando nombre');
    console.log("creando", nombre);
}

module.exports = { f_procesa_crear, f_nombre };