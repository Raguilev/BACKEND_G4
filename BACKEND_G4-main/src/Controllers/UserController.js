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
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db = require("../DAO/models");
const UserController = () => {
    const path = "/users";
    const router = express_1.default.Router();
    const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_super_seguro";
    router.get("/list", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield db.User.findAll(); // Recupera todos los usuarios de la base de datos
            resp.json({
                msg: "Lista de usuarios",
                users: users,
            });
        }
        catch (error) { // Cambié el tipo a `unknown`
            if (error instanceof Error) {
                resp.status(500).json({
                    msg: "Error al obtener los usuarios",
                    error: error.message,
                });
            }
            else {
                resp.status(500).json({
                    msg: "Error desconocido al obtener los usuarios",
                    error: "Error desconocido",
                });
            }
        }
    }));
    /*router.post("/change-password", async (req : Request, res : Response) => {
      const { currentPassword, newPassword } = req.body;
      const userId = (req as any).user.id; // Asumimos que el ID del usuario se obtiene del token JWT
  
      try {
        // Buscar al usuario en la base de datos
        const user = await db.User.findByPk(userId);
  
        if (!user) {
          return res.status(404).json({ msg: "Usuario no encontrado" });
        }
  
        // Verificar que la contraseña actual sea correcta
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
  
        if (!isPasswordValid) {
          return res.status(400).json({ msg: "Contraseña actual incorrecta" });
        }
  
        // Hashear la nueva contraseña
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
  
        // Actualizar la contraseña en la base de datos
        await user.update({ password_hash: newPasswordHash });
  
        res.json({ msg: "Contraseña actualizada correctamente" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al cambiar la contraseña" });
      }
    })
   */
    router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body);
        const users = yield db.users.findAll();
        res.json(users);
        console.log(users);
    }));
    router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body);
        const name = req.body.name;
        const email = req.body.email;
        const password_hash = req.body.password_hash;
        const role_id = req.body.role_id;
        const users = yield db.users.create({
            name: name,
            email: email,
            password_hash: password_hash,
            role_id: role_id
        });
        res.status(200).json(users);
    }));
    router.post("/addMany", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body);
        const users = req.body;
        const usersCreated = yield db.users.bulkCreate(users);
        res.status(200).json(usersCreated);
    }));
    router.put("/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body);
        const id = req.params.id;
        const name = req.body.name;
        const email = req.body.email;
        const password_hash = req.body.password_hash;
        const role_id = req.body.role_id;
        const users = yield db.users.update({
            name: name,
            email: email,
            password_hash: password_hash,
            role_id: role_id
        }, {
            where: {
                id: Number(id)
            }
        });
        res.status(200).json(users);
    }));
    router.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body);
        const id = req.params.id;
        const users = yield db.users.destroy({
            where: {
                id: Number(id)
            }
        });
        res.status(200).json(users);
    }));
    //Agregar otros endpoints, post, get
    router.get("/totalUsers", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        const totalUsers = yield db.User.count({
            where: {
                role_id: 2
            }
        });
        resp.json({
            msg: "",
            totalUsers: totalUsers
        });
    }));
    router.post("/login", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("🔹 Datos recibidos:", req.body);
        const { usuario, password } = req.body;
        const user = yield db.User.findOne({
            where: { name: usuario }
        });
        console.log("🔹 Usuario encontrado en DB:", user);
        if (!user) {
            console.log("❌ Usuario no encontrado.");
            resp.status(401).json({ msg: "Error en login" });
        }
        else {
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password_hash);
            console.log("🔹 ¿Contraseña válida?:", isPasswordValid);
            if (!isPasswordValid) {
                console.log("❌ Contraseña incorrecta.");
                resp.status(401).json({ msg: "Error en login" });
            }
            else {
                console.log("✅ Usuario autenticado.");
                const token = jsonwebtoken_1.default.sign({ userid: user.id, role: user.role_id, nombre: user.name, email: user.email }, JWT_SECRET, { expiresIn: "2h" });
                resp.json({
                    msg: "",
                    token,
                    nombre: user.name,
                    role: user.role_id,
                    userid: user.id,
                    email: user.email
                });
            }
        }
    }));
    router.use((0, cors_1.default)()); // ✅ Habilita CORS para evitar bloqueos
    // 🔹 Registrar usuario con contraseña encriptada
    router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("🔹 Intentando registrar usuario:", req.body);
        const { name, email, password } = req.body;
        // 🔹 Verificar si el usuario ya existe
        const existingUser = yield db.User.findOne({ where: { email } });
        if (existingUser) {
            console.log("⚠️ Usuario ya registrado:", email);
            res.status(400).json({ msg: "Usuario ya registrado" });
            return;
        }
        // 🔹 Encriptar la contraseña
        const saltRounds = 10;
        const passwordEncrypted = yield bcrypt_1.default.hash(password, saltRounds);
        // 🔹 Crear nuevo usuario en la base de datos
        const newUser = yield db.User.create({
            name,
            email,
            password_hash: passwordEncrypted, // ✅ Guardamos la contraseña encriptada
            role_id: 2,
            verified: false,
        });
        console.log("✅ Usuario registrado correctamente:", newUser);
        res.status(201).json({ msg: "Registro exitoso. Verifique su correo.", data: newUser });
    }));
    return [path, router];
};
exports.default = UserController;
