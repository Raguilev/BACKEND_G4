import nodemailer from "nodemailer";

const UsuarioGmail = "pweb5647@gmail.com";
const psswdGmail = "geth apsa cnwk fzvo";
 
 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: UsuarioGmail,
    pass: psswdGmail,
  },
});

export const sendVerificationEmail = async (email: string) => {
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

  await transporter.sendMail(mailOptions);
};
