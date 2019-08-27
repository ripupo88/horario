const crear = require('./crear');

let f_procesa_comando = (message) => {
    if (message.text == "/crear") {
        crear.f_procesa_crear(message)
    } else if (crear.creando) {
        crear.f_nombre(message.text);
    } else {
        console.log(crear.creando);
    }
}

module.exports = { f_procesa_comando }