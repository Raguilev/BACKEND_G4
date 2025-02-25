import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tuemail@gmail.com",
    pass: "tupassword",
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `http://localhost:5000/verify?token=${token}`;

  const mailOptions = {
    from: "tuemail@gmail.com",
    to: email,
    subject: "Verifica tu cuenta",
    html: `<p>Haga clic en el siguiente enlace para verificar su cuenta:</p>
           <a href="${verificationLink}">${verificationLink}</a>`,
  };

  await transporter.sendMail(mailOptions);
};
