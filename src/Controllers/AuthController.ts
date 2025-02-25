import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const db = require("../DAO/models");

const AuthController = () => {
  const path: string = "/auth";
  const router = express.Router();

  // Endpoint para iniciar sesión
  router.post("/login", async (req: Request, resp: Response) => {
    const { email, password } = req.body;

    try {
      // Buscar al usuario por su email
      const user = await db.User.findOne({ where: { email } });

      if (!user) {
        return resp.status(404).json({ msg: "Usuario no encontrado" });
      }

      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return resp.status(400).json({ msg: "Contraseña incorrecta" });
      }

      // Generar un token JWT
      const token = jwt.sign({ id: user.id, email: user.email }, "secreto", { expiresIn: "1h" });

      resp.json({ msg: "Inicio de sesión exitoso", token });
    } catch (error) {
      console.error(error);
      resp.status(500).json({ msg: "Error al iniciar sesión" });
    }
  });

  return [path, router];
};

export default AuthController;