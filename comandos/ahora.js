const mongo = require('../mongo/mongodb');
const enviar = require('../telegram/enviar');
const moment = require('moment');

let f_procesa_ahora = async message => {
    console.log(message.from);
    try {
        if (message.from.id != message.chat.id)
            throw new Error('Comando solo disponible en privado');
        let empleado = await mongo.f_confirma_telegram_id(message.from.id);
        if (empleado.role != 'ADMIN_ROLE')
            throw new Error('Comando solo para administradores');
        let empresas = await mongo.f_obten_empresa_admin(empleado.id);
        let mi_hora = new moment();
        enviar.f_manda_mensaje(
            message.from.id,
            `Hora actual:\n${mi_hora.format(
                'H:mm'
            )}\nFecha actual:\n${mi_hora.format('dddd')}\n${mi_hora.format(
                'DD/MM/YYYY'
            )}`
        );
        if (empresas[0] == undefined)
            throw new Error('No has creado empresas aún');
        for (let empresa of empresas) {
            let empleados = await mongo.f_obten_empleados(empresa.id);
            if (empleados[0] == undefined)
                throw new Error('Tu empresa aún no tiene empleados');
            let turno_activo = '';
            for (let cada_empleado of empleados) {
                let turno = await mongo.confirma_entrada(cada_empleado);
                if (turno[0] != undefined) {
                    let dato_empleado = await mongo.f_empleado_por_id(
                        turno[0].empleado
                    );
                    turno_activo += dato_empleado.alias + '\n';
                }
            }
            if (turno_activo == '') turno_activo = 'No hay empleados activos';
            enviar.f_manda_mensaje(
                message.from.id,
                `Empresa:\n${empresa.nombre}\nEmpleados activos:\n${turno_activo}`
            );
            console.log(turno_activo);
        }
    } catch (err) {
        console.log(err);
        enviar.f_manda_mensaje(message.chat.id, err.toString());
    }
};

module.exports = { f_procesa_ahora };
