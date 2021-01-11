import express, { json } from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import knex from './database/connection';
import http from 'http';
import https from 'https';


const app = express();

app.use(cors({ origin: '*' }));
app.use(json());

const sender = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Host link SMTP
  service: 'SMTP', // SMTP
  port: 587, // SMTP default port 587
  secure: false,
  auth: {
    user: '', // access e-mail
    pass: '' // password
  }
});

app.post('/sendEmail', async (request, response) => {
  const { name, email, message, phone } = request.body;
  const time = Date();

  const messageFormated = `Um e-mail foi enviado através da seção Fale Conosco do site Doctor Vanity:\n\nNome: ${name}\nTelefone: ${phone}\nMensagem:\n\n${message}\n\n----\n\nHorário de envio: ${time}.`;

  const trx = await knex.transaction();

  const mail = {
    from: email,
    name,
    phone,
    message,
    time,
  }

  const insertedMail = await trx('mails').insert(mail);

  trx.commit();

  const emailToBeSend = {
    from: email,
    to: '',
    subject: 'Mensagem - Site Doctor Vanity',
    text: messageFormated
  };
  
  // NodeMailer
  sender.sendMail(emailToBeSend, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email enviado com sucesso.');
    }
  }); 

  return response.json({ insertedMail, message: 'E-mail enviado com sucesso.' }).status(201);
});
/*
// HTTPS
const options = {
  key: fs.readFileSync('key.key', 'utf-8'),
  cert: fs.readFileSync('cert.cert', 'utf-8')
};
*/
http.createServer(app).listen(3333);
/*https.createServer(options, app).listen(4433);*/