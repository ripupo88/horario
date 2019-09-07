//cron
const CronJob = require("cron").CronJob;
const jspdf = require("../jspdf/pdf");

const mongo = require("../mongo/mongodb");

new CronJob(
    "0 30 8 1 * *",
    async() => {
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

new CronJob(
    "0 */5 * * * *",
    async() => {
        try {
            console.log('sincro');
            let jornadas_abiertas = await mongo.f_fin_jornada()
            console.log(jornadas_abiertas);
            jornadas_abiertas.forEach(regsitro => {
                mongo.f_avisa_empleado(regsitro.empleado);
            });
        } catch (e) {
            console.log(e);
        }


    },
    null,
    true,
    "Europe/London"
);