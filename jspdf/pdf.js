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
const jsPDF = require("jspdf/dist/jspdf.node.debug");
const moment = require("moment");
const enviar = require("../telegram/enviar");
const mongo = require("../mongo/mongodb");

global.jsPDF = jsPDF;

moment.locale("es");

require("jspdf-autotable");

let f_crea_pdf = async (registro, empleado, destino) => {
   let empresa = await mongo.f_empresa(empleado.empresa);
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
      let duracion = "";
      let validado = "";

      registro.forEach(element => {
         let fecha_hoy = new moment(element.entrada).format("D");
         if (fecha_hoy == i + 1) {
            hora_entrada = new moment(element.entrada).format("HH:mm");
            if (element.salida != undefined) {
               hora_salida = new moment(element.salida).format("HH:mm");
               duracion = new moment(element.jornada).format("H:mm");
               if (element.validado) {
                  validado = "si";
               } else {
                  validado = "***NO***";
               }
            }

            return;
         }
      });

      body_principal[i] = [
         i + 1,
         hora_entrada,
         hora_salida,
         duracion,
         validado
      ];
   }

   //tabla principal con los datos del trabajador
   doc.autoTable({
      margin: { top: 20 },
      tableLineWidth: 0.1,
      tableLineColor: 0,
      styles: {
         fontSize: 8,
         cellWidth: "wrap"
      },
      head: [["Día", "Entrada", "Salida", "Jornada", "Validado"]],
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
            {
               content: "CIF:",
               styles: { minCellHeight: 10, valign: "bottom" }
            },
            "",
            ""
         ],
         [
            empresa.nombre,
            empresa.cif,
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
            {
               content: "NIF/NIE:",
               styles: { minCellHeight: 10, valign: "bottom" }
            },
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
   enviar.f_enviar_doc(documento_nombre, destino);
};

module.exports = { f_crea_pdf };

delete global.window;
delete global.navigator;
delete global.btoa;
delete global.html2pdf;
