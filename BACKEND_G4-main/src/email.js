"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const UsuarioGmail = "pweb5647@gmail.com";
const psswdGmail = "geth apsa cnwk fzvo";
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: UsuarioGmail,
        pass: psswdGmail,
    },
});
const sendVerificationEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationLink = `https://appgastos.azurewebsites.net/users/verify?email=${encodeURIComponent(email)}`;
    const mailOptions = {
        from: UsuarioGmail,
        to: email,
        subject: "Verifica tu cuenta",
        html: `
      <h1>Confirmación de Correo</h1>
      <p>Para verificar tu cuenta, haz clic en el siguiente enlace:</p>
      <a href="${verificationLink}">Verificar Cuenta</a>
    `,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendVerificationEmail = sendVerificationEmail;
