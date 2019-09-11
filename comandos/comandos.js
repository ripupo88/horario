const crear = require('./crear');
const entrada = require('./entrada');
const salida = require('./salida');
const informes = require('./informes');
const empresa = require('./empresa');

var entrada_bool = true;
var salida_bool = true;

let f_procesa_comando = message => {
  let re = /^\/[a-z]*/gi;
  let result = re.exec(message.text);

  switch (result[0]) {
    case '/crear':
      crear.f_procesa_crear(message);
      break;

    case '/entrada':
      if (entrada_bool) {
        console.log('aceptado');
        //entrada_bool = false;
        entrada.f_procesa_entrada(message).then(() => {
          entrada_bool = true;
        });
      } else {
        console.log('rechasado');
      }
      break;

    case '/salida':
      if (salida_bool) {
        salida_bool = false;
        salida.f_procesa_salida(message).then(() => {
          salida_bool = true;
        });
      }
      break;

    case '/informe':
      informes.f_procesa_informes(message);
      break;

    case '/empresa':
      empresa.f_procesa_empresa(message);
      break;

    default:
      break;
  }
};
module.exports = { f_procesa_comando };
