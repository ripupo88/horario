const mongo = require("../mongo/mongodb");
const enviar = require("../telegram/enviar");
const confirmar = require("../telegram/confirmacion");
const moment = require("moment");

let f_procesa_salida = message => {
   return new Promise((resolve, reject) => {
      f_procesando_salida(message)
         .then(data => {
            console.log("salida fichada");
            resolve();
         })
         .catch(err => {
            console.log(err);
            console.log(message.chat.id);
            enviar.f_manda_mensaje(message.chat.id, err.toString());
            resolve();
         });
   });
};

//procesamos el comando /salida
let f_procesando_salida = async message => {
   if (message.from.id != message.chat.id)
      throw new Error("Solo se puede fichar desde el chat privado");
   //paso 1- el que lo ejecutó esté en la DB ... devuelve el user de la DB
   let empleado = await mongo.f_confirma_telegram_id(message.from.id);

   //paso 2- verificar que tenga una entrada ya abierta ... devuelve la entrada abierta si existe
   let registro = await mongo.confirma_entrada(empleado);

   //si hay turno abierto lanza error
   await si_hay(registro);

   //pedir confirmacion al empleado
   let res_confirma = await confirmar.f_confirmacion(
      message,
      `Hola ${empleado.alias}, ¿quieres fichar tu salida a las ${moment
         .unix(message.date)
         .format("HH:mm")}?`
   );
   if (res_confirma) {
      //registrar en la DB
      let salida_fichada = await mongo.f_nueva_salida(
         moment.unix(message.date).toISOString(),
         empleado.id,
         res_confirma
      );
      //notifica usuario
      await notifica_usuario(
         message.chat.id,
         salida_fichada,
         empleado.alias,
         "\nubicación confirmada"
      );
      //notifica jefes
   } else {
      //registrar en la DB
      let salida_fichada = await mongo.f_nueva_salida(
         moment.unix(message.date).toISOString(),
         empleado.id,
         res_confirma
      );
      //notifica usuario
      await notifica_usuario(
         message.chat.id,
         salida_fichada,
         empleado.alias,
         "\nfuera de ubicación, esto marcará un incidente en su registro"
      );
      //notifica jefes
   }
};

let notifica_admin = async (chat_id, entrada, empleado) => {
   let fecha = moment(entrada.entrada).format("DD-MM-YYYY");
   let hora = moment(entrada.entrada).format("HH:mm");
   let text = `${empleado} ha fichado su salida\na las ${hora}\nel dia ${fecha}`;
   enviar.f_manda_mensaje(chat_id, text);
};

let notifica_usuario = async (chat_id, entrada, empleado, location) => {
   let fecha = moment(entrada.res.salida).format("DD-MM-YYYY");
   let hora = moment(entrada.res.salida).format("HH:mm:ss");
   let duracion = entrada.jornada;
   let horas = duracion.hours();
   let minutos = duracion.minutes();
   let text = `${empleado} ha fichado su salida\na las ${hora}\nel dia ${fecha}\nsu jornada ha durado\n${horas} horas ${minutos} minutos${location}`;
   enviar.f_manda_mensaje(chat_id, text);
};

let si_hay = async registro => {
   if (registro[0] != undefined) {
      return;
   } else {
      throw new Error("No tienes fichada una entrada, ficha la entrada.");
   }
};

module.exports = { f_procesa_salida };
