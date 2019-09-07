global.window = {
   document: {
      createElementNS: () => {
         return {};
      }
   }
};
global.navigator = {};
global.html2pdf = {};
global.btoa = () => {};

const fs = require("fs");
const jsPDF = require("jspdf");
const moment = require("moment");
const enviar = require("../telegram/enviar");

global.jsPDF = jsPDF;

moment.locale("es");

require("jspdf-autotable");

let f_crea_pdf = (registro, empleado) => {
   let mes = new moment(registro[0].entrada);

   let texto_mes = mes.format("MMMM YYYY");
   let documento_nombre = empleado.alias + mes.format("-MMMM-YYYY");

   const doc = new jsPDF();

   //Texto superior con el mes y el año
   doc.text(`${texto_mes.toUpperCase()}`, 15, 14);

   let dias = mes.daysInMonth();

   let body_principal = [];
   //creando el body
   for (let i = 0; i < dias; i++) {
      let hora_entrada = "";
      let hora_salida = "";
      let duracion_horas = "";
      let duracion_minutos = "";
      let duracion = "";

      registro.forEach(element => {
         let fecha_hoy = new moment(element.entrada).format("D");

         if (fecha_hoy == i + 1) {
            hora_entrada = new moment(element.entrada).format("HH:mm");
            hora_salida = new moment(element.salida).format("HH:mm");
            duracion_horas = new moment(element.jornada).hours();
            duracion_minutos = new moment(element.jornada).minutes();
            duracion = duracion_horas + ":" + duracion_minutos;

            return;
         }
      });

      body_principal[i] = [i + 1, hora_entrada, hora_salida, duracion];
   }

   //tabla principal con los datos del trabajador
   doc.autoTable({
      margin: { top: 20 },
      tableLineWidth: 0.1,
      tableLineColor: 0,
      head: [["Día", "Entrada", "Salida", "Jornada"]],
      body: body_principal
   });

   //pie de pagina con datos de la empresa y el empleado
   doc.autoTable({
      theme: "plain",
      head: [],
      body: [
         [
            {
               content: "EMPRESA:",
               styles: { minCellHeight: 10, valign: "bottom" }
            },
            "CIF",
            "",
            ""
         ],
         [
            "C.B. RUPERTO GONZALEZ E HIJOS",
            "E38388880",
            "Firma",
            {
               content: "_______________",
               styles: { halign: "center", valign: "bottom" }
            }
         ],
         [
            {
               content: "EMPLEADO:",
               styles: { minCellHeight: 10, valign: "bottom" }
            },
            "NIF/NIE:",
            "",
            ""
         ],
         [
            `${empleado.nombre}`,
            `${empleado.nif}`,
            "Firma",
            {
               content: "_______________",
               styles: { halign: "center", valign: "bottom" }
            }
         ]
      ]
   });

   const datas = doc.output();

   fs.writeFileSync(`./informes/${documento_nombre}.pdf`, datas, "binary");
   enviar.f_enviar_doc(documento_nombre);
};

module.exports = { f_crea_pdf };

delete global.window;
delete global.navigator;
delete global.btoa;
delete global.html2pdf;
