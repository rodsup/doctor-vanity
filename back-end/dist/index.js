"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const connection_1 = __importDefault(require("./database/connection"));
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const app = express_1.default();
app.use(cors_1.default({ origin: '*' }));
app.use(express_1.json());
const sender = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    service: 'SMTP',
    port: 587,
    secure: false,
    auth: {
        user: 'thedoctorvanity@gmail.com',
        pass: '15up68kl4t' // password
    }
});
app.post('/sendEmail', async (request, response) => {
    const { name, email, message, phone } = request.body;
    const time = Date();
    const messageFormated = `Um e-mail foi enviado através da seção Fale Conosco do site Doctor Vanity:\n\nNome: ${name}\nTelefone: ${phone}\nMensagem:\n\n${message}\n\n----\n\nHorário de envio: ${time}.`;
    const trx = await connection_1.default.transaction();
    const mail = {
        from: email,
        name,
        phone,
        message,
        time,
    };
    const insertedMail = await trx('mails').insert(mail);
    trx.commit();
    const emailToBeSend = {
        from: email,
        to: 'thedoctorvanity@gmail.com',
        subject: 'Mensagem - Site Doctor Vanity',
        text: messageFormated
    };
    // NodeMailer
    sender.sendMail(emailToBeSend, function (error) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email enviado com sucesso.');
        }
    });
    return response.json({ insertedMail, message: 'E-mail enviado com sucesso.' }).status(201);
});

http_1.default.createServer(app).listen(3333);