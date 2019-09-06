//cron
const CronJob = require("cron").CronJob;
const jspdf = require("../jspdf/pdf");

const mongo = require("../mongo/mongodb");

new CronJob(
   "0 30 8 1 * *",
   async () => {
      let empleados = [];
      let informe = [];

      empleados = await mongo.f_obten_empleados();

      empleados.forEach(async empleado => {
         informe = await mongo.f_obten_informe(empleado);
         if (informe[0] != undefined) {
            jspdf.f_crea_pdf(informe, empleado);
         }
      });
   },
   null,
   true,
   "Europe/London"
);
