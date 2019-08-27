const crear = require('./crear');

let f_procesa_comando = (message) => {

    let re = /^\/[a-z]*/ig;
    let result = re.exec(message.text);

    switch (result[0]) {

        case "/crear":
            crear.f_procesa_crear(message);
            break;

        case "/recarga":
            ///////////////////
            break;

        default:

            break;



    }

}
module.exports = { f_procesa_comando }