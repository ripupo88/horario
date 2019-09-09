//cron
const CronJob = require('cron').CronJob;
const mongo = require('../mongo/mongodb');
const informes = require('../comandos/informes');

new CronJob(
  '0 30 8 1 * *',
  async () => {
    informes.f_informes_todos();
  },
  null,
  true,
  'Europe/London'
);

new CronJob(
  '0 */5 * * * *',
  async () => {
    try {
      let jornadas_abiertas = await mongo.f_fin_jornada();

      jornadas_abiertas.forEach(registro => {
        mongo.f_avisa_empleado(registro.empleado);
      });
    } catch (e) {
      console.log(e);
    }
  },
  null,
  true,
  'Europe/London'
);
