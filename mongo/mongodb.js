"use strict";
const mongoose = require("mongoose");
const moment = require("moment");
const enviar = require("../telegram/enviar");

mongoose.connect(
   "mongodb://127.0.0.1/horariodb",
   { useNewUrlParser: true },
   err => {
      if (err) console.log(err);
   }
);
mongoose.set("useFindAndModify", false);

const Usuario = require("./schemas/usuario");
const Registro = require("./schemas/registro");
const Empresa = require("./schemas/empresa");

let f_nuevo_usuario = objeto_usuario => {
   return new Promise((resolve, reject) => {
      let usuario = new Usuario(objeto_usuario);

      usuario.save((err, res) => {
         if (err) {
            console.log(err);
            reject("Error con la base de datos, posibles datos duplicados");
         }
         resolve(res);
      });
   });
};

// f_nuevo_usuario({
//    nombre: "Richar Pupo",
//    nif: "Y4907588T",
//    role: "ADMIN_ROLE",
//    alias: "Richar",
//    correo: "ripupo88@gmail.com",
//    telegram_id: 823806648
// });

let confirma_entrada = empleado => {
   return new Promise((resolve, reject) => {
      Registro.find({ fin: false, empleado: empleado.id }, (err, res) => {
         if (err) reject("error al conectar con base de datos");
         resolve(res);
      });
   });
};

let f_nueva_entrada = (entrada, empleado) => {
   return new Promise((resolve, reject) => {
      let registro = new Registro({
         entrada,
         empleado
      });

      registro.save((err, res) => {
         if (err) reject(err);
         resolve(res);
      });
   });
};

let f_nueva_salida = (salida, empleado, validado) => {
   return new Promise((resolve, reject) => {
      f_encuentra_entrada(empleado, salida)
         .then(duration => {
            Registro.findOneAndUpdate(
               { empleado: empleado, fin: false },
               { salida, fin: true, jornada: duration, validado },
               (err, res) => {
                  if (err) console.log(err);
                  resolve({
                     res,
                     jornada: duration
                  });
               }
            );
         })
         .catch(err => {
            console.log(err);
         });
   });
};

let f_encuentra_entrada = (empleado, salida) => {
   return new Promise((resolve, reject) => {
      Registro.find({ empleado: empleado, fin: false }, (err, res) => {
         if (err) reject(err);
         var duration = moment.duration(
            new moment(salida).diff(new moment(res[0].entrada))
         );
         resolve(duration);
      });
   });
};

let f_busca_duplicado = (empleado, salida) => {
   return new Promise((resolve, reject) => {
      let hoy = new moment(new Date());
      let buscar_hoy = new moment("2010-10-01T00:00:00.000Z")
         .year(hoy.year())
         .month(hoy.month())
         .date(hoy.date());

      Registro.find(
         { empleado: empleado, entrada: { $gte: buscar_hoy } },
         (err, res) => {
            if (err) reject(err);
            console.log(res);
            resolve(res);
         }
      );
   });
};

let f_confirma_telegram_id = telegram_id => {
   return new Promise((resolve, reject) => {
      Usuario.find({ telegram_id }, (err, res) => {
         if (err) {
            console.log(err);
            reject("Ha ocurrido un error");
         } else if (typeof res !== "undefined" && res.length > 0) {
            resolve(res[0]);
         } else {
            reject("Su ID no aparece en nuestra base de datos");
         }
      });
   });
};

let f_obten_empleados = () => {
   return new Promise((resolve, reject) => {
      Usuario.find({ role: "USER_ROLE", activo: true }, (err, res) => {
         if (err) {
            reject(err);
         }
         resolve(res);
      });
   });
};

let f_obten_informe = (empleado, mes) => {
   return new Promise((resolve, reject) => {
      let ahora = new moment(new Date());
      let inicio = new moment("2010-10-01T00:00:00.000Z")
         .year(ahora.year())
         .month(ahora.month() - mes);
      let fin = new moment("2010-10-01T00:00:00.000Z")
         .year(ahora.year())
         .month(ahora.month() - mes + 1);

      Registro.find(
         {
            empleado: empleado.id,
            entrada: {
               $gte: inicio,
               $lt: fin
            }
         },
         (err, res) => {
            if (err) {
               reject(err);
            }

            resolve(res);
         }
      );
   });
};

let f_fin_jornada = () => {
   return new Promise((resolve, reject) => {
      let jornada = new moment();
      jornada = jornada.hour(jornada.hour() - 8);
      console.log(jornada);
      Registro.find(
         {
            entrada: {
               $lt: jornada
            },
            fin: false
         },
         (err, res) => {
            if (err) {
               reject(err);
            }
            console.log(res);
            resolve(res);
         }
      );
   });
};

let f_avisa_empleado = empleado_id => {
   Usuario.findById(empleado_id, (err, res) => {
      if (err) console.log(err);
      console.log("la respu", res);
      enviar.f_manda_mensaje(
         res.telegram_id,
         `${res.alias} tienes un turno abierto, no olvides fichar la salida`
      );
   });
};

let f_crea_empresa = objeto_empresa => {
   return new Promise((resolve, reject) => {
      let empresa = new Empresa(objeto_empresa);

      empresa.save((err, res) => {
         if (err) {
            console.log(err);
            reject("Error con la base de datos, posible empresa ya existente");
         }
         resolve(res);
      });
   });
};

let f_empresa = id => {
   return new Promise((resolve, reject) => {
      Empresa.findById(id, (err, res) => {
         if (err) console.log(err);

         resolve(res);
      });
   });
};

let f_obten_empresa = chat => {
   return new Promise((resolve, reject) => {
      Empresa.find(
         {
            chat
         },
         (err, res) => {
            if (err) {
               reject(err);
            }
            resolve(res[0]);
         }
      );
   });
};

let f_obten_admin = id_admin => {
   return new Promise((resolve, reject) => {
      console.log("id_admin", id_admin);
      Usuario.findById(id_admin)
         .populate({
            path: "empresa",
            model: Empresa,
            populate: { path: "admin", model: Usuario }
         })
         .exec((err, res) => {
            if (err) reject(err);
            resolve(res);
         });
   });
};

module.exports = {
   f_confirma_telegram_id,
   f_nuevo_usuario,
   confirma_entrada,
   f_nueva_entrada,
   f_nueva_salida,
   f_obten_empleados,
   f_obten_informe,
   f_busca_duplicado,
   f_fin_jornada,
   f_avisa_empleado,
   f_crea_empresa,
   f_obten_empresa,
   f_empresa,
   f_obten_admin
};
