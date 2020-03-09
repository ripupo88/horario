const mongo = require('../mongo/mongodb');
const entrada = require('../comandos/entrada');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8080;

app.use(bodyParser.json()); // for parsing application/json

app.post('/fichar', async (req, res) => {
   let telegram_id = req.body.telegram;
   let empleado = await mongo.f_confirma_telegram_id(telegram_id);
   let registro = await mongo.confirma_entrada(empleado);

   let message = {
      date: new Date(),
      chat: {
         id: telegram_id
      },
      from: {
         id: telegram_id
      }
   };

   if (registro[0] != undefined) {
      //fichar salida
   } else {
      entrada.doEntrada(message, empleado, true, 'fichado por QR');
   }
});

let time = () => {
   return new Promise((resolve, reject) => {
      setTimeout(() => {
         resolve({ user: 'sd' });
      }, 5000);
   });
};

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
