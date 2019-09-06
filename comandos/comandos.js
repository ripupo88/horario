const crear = require("./crear");
const entrada = require("./entrada");
const salida = require("./salida");

var entrada_bool = true;
var salida_bool = true;

let f_procesa_comando = message => {
   let re = /^\/[a-z]*/gi;
   let result = re.exec(message.text);

   switch (result[0]) {
      case "/crear":
         crear.f_procesa_crear(message);
         break;

      case "/entrada":
         if (entrada_bool) {
            entrada_bool = false;
            entrada.f_procesa_entrada(message).then(() => {
               entrada_bool = true;
            });
         }
         break;

      case "/salida":
         if (entrada_bool) {
            entrada_bool = false;
            salida.f_procesa_salida(message).then(() => {
               entrada_bool = true;
            });
         }
         break;

      default:
         break;
   }
};
module.exports = { f_procesa_comando };
