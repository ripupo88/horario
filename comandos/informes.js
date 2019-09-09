const moment = require('moment');
const mongo = require('../mongo/mongodb');
const jspdf = require('../jspdf/pdf');

let f_procesa_informes = async message => {
  try {
    let creador_mensaje = await mongo.f_confirma_telegram_id(message.from.id);
    if (creador_mensaje.role == 'ADMIN_ROLE') {
      let mes = f_obten_mes(message);
      if (mes >= 0 && mes < 49) {
        f_informes_todos(mes, message.from.id);
      } else {
        throw new Error('fecha incorrecta');
      }
    } else {
      console.log('user SOLO');
    }
  } catch (e) {
    console.log(e);
  }
};

let f_obten_mes = message => {
  let fecha_recibida = message.text.replace(/\/informe /g, '').trim();
  let la_fecha = fecha_recibida.split('-');
  let mes = parseInt(la_fecha[0]);
  let anno = parseInt(la_fecha[1]);
  let fecha_solicitud = new moment(
    '20' + anno + '-' + mes + '-01',
    'YYYY-MM-DD'
  );
  let hoy = new moment();
  let numero_meses = hoy.diff(fecha_solicitud, 'months');
  return numero_meses;
};

let f_informes_todos = async (mes, destino) => {
  let empleados = await mongo.f_obten_empleados();
  empleados.forEach(async empleado => {
    f_informe(empleado, mes, destino);
  });
};

let f_informe = async (empleado, mes, destino) => {
  let informe = await mongo.f_obten_informe(empleado, mes);
  if (informe[0] != undefined) {
    jspdf.f_crea_pdf(informe, empleado, destino);
  }
};

module.exports = { f_informes_todos, f_procesa_informes };
