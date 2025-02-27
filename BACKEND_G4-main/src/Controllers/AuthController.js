"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db = require("../DAO/models");
const AuthController = () => {
    const path = "/auth";
    const router = express_1.default.Router();
    /*
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
    */
    return [path, router];
};
exports.default = AuthController;
