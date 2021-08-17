//cron
const CronJob = require('cron').CronJob;
const moment = require('moment');
//////////////
const salida = require('../comandos/salida');
const mongo = require('../mongo/mongodb');
const informes = require('../comandos/informes');
const enviar = require('../telegram/enviar');

new CronJob(
    '0 30 8 1 * *',
    async () => {
        informes.f_informes_todos(1, null);
    },
    null,
    true,
    'Europe/London'
);

new CronJob(
    '0 */5 * * * *',
    async () => {
        try {
            // let jornadas_abiertas1 = await mongo.f_fin_jornada(12);
            // jornadas_abiertas1.forEach(async (registro) => {
            //     let empleado = await mongo.f_empleado_por_id(registro.empleado);
            //     let telegram_id = empleado.telegram_id;

            //     let newTime = Math.floor(new Date() / 1000);
            //     //let createTime = newTime - 14400;

            //     let horaEntrada = moment(registro.entrada);
            //     let createTime = horaEntrada.add(8, "h").unix();

            //     let message = {
            //         date: createTime,
            //         chat: {
            //             id: telegram_id,
            //         },
            //         from: {
            //             id: telegram_id,
            //         },
            //     };

            //     salida.doSalida(message, empleado, true, true);

            //     enviar.f_manda_mensaje(
            //         empleado.telegram_id,
            //         `${empleado.alias} jornada de más de 12 horas, al parecer olvidaste fichar, el sistema fichará una jornada de 8 horas.\nSi consideras que esto es un error contacte al administrador.`
            //     );
            // });

            let jornadas_abiertas = await mongo.f_fin_jornada(8);
            jornadas_abiertas.forEach(async (registro) => {
                let empleado = await mongo.f_empleado_por_id(registro.empleado);
                enviar.f_manda_mensaje(
                    empleado.telegram_id,
                    `${empleado.alias} no olvides fichar cuando termine tu jornada laboral.`
                );
            });
        } catch (e) {
            console.log(e);
        }
    },
    null,
    true,
    'Europe/London'
);
