import express, { Request, Response } from "express";
const db = require("../DAO/models");

const UserController = () => {
  const path: string = "/users";
  const router = express.Router();

  // 📌 Registrar usuario
  router.post("/register", async (req: Request, res: Response) => {
    console.log(req.body);
    const { name, email, password_hash } = req.body;

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      res.json({ msg: "Usuario ya registrado", data: null });
    } else {
      const verification_token = Math.random().toString(36).substr(2);

      const newUser = await db.User.create({
        name,
        email,
        password_hash,
        role_id: 2,
        verified: false,
        verification_token,
      });

      res.json({ msg: "Registro exitoso. Verifique su correo.", data: newUser });
    }
  });

  // 📌 Iniciar sesión
  router.post("/login", async (req: Request, res: Response) => {
    const { email, password_hash } = req.body;

    const user = await db.User.findOne({ where: { email } });
    if (!user || user.password_hash !== password_hash) {
      res.json({ msg: "Credenciales incorrectas", data: null });
    } else if (!user.verified) {
      res.json({ msg: "Debe verificar su cuenta antes de iniciar sesión", data: null });
    } else {
      res.json({ msg: "Inicio de sesión exitoso", data: user });
    }
  });

  // 📌 Verificar si un usuario existe
  router.get("/exists", async (req: Request, res: Response) => {
    const { email } = req.query;
    const user = await db.User.findOne({ where: { email } });

    res.json({ msg: "", data: { exists: !!user } });
  });

  // 📌 Obtener total de usuarios registrados
  router.get("/totalUsers", async (req: Request, res: Response) => {
    const totalUsers = await db.User.count({ where: { role_id: 2 } });

    res.json({ msg: "", data: { totalUsers } });
  });

  // 📌 Confirmar cuenta por correo
  router.post("/confirm", async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      res.json({ msg: "Usuario no encontrado", data: null });
    } else if (user.verified) {
      res.json({ msg: "Cuenta ya confirmada", data: null });
    } else {
      await db.User.update({ verified: true }, { where: { email, verified: false } });
      res.json({ msg: "Cuenta confirmada", data: null });
    }
  });

  // 📌 Enviar token de recuperación de contraseña
  router.post("/forgot-password", async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      res.json({ msg: "Usuario no encontrado", data: null });
    } else {
      const token = Math.random().toString(36).substr(2);
      await db.User.update({ verification_token: token }, { where: { email } });
      res.json({ msg: "Token generado", data: { token } });
    }
  });

  // 📌 Restablecer contraseña con token
  router.post("/reset-password", async (req: Request, res: Response) => {
    const { email, newPassword, token } = req.body;

    const user = await db.User.findOne({ where: { email, verification_token: token } });

    if (!user) {
      res.json({ msg: "Token inválido o usuario no encontrado", data: null });
    } else {
      await db.User.update(
        { password_hash: newPassword, verification_token: null },
        { where: { email, verification_token: token } }
      );
      res.json({ msg: "Contraseña actualizada", data: null });
    }
  });

  // 📌 Verificar cuenta con token
  router.get("/verify", async (req: Request, res: Response) => {
    const { token } = req.query;

    const user = await db.User.findOne({ where: { verification_token: token } });
    if (!user) {
      res.json({ msg: "Token inválido o expirado", data: null });
    } else {
      await db.User.update(
        { verified: true, verification_token: null },
        { where: { verification_token: token } }
      );
      res.json({ msg: "Cuenta verificada con éxito", data: null });
    }
  });

  return [path, router];
};

export default UserController;
