import express, { Request, Response, } from "express";
import bcrypt from "bcrypt";
import cors from 'cors'
import jwt from "jsonwebtoken";
const db = require("../DAO/models")
import { sendVerificationEmail } from "../email"; 

const UserController = () => {
  const path: string = "/users";
  const router = express.Router();
  const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_super_seguro";

  router.get("/list", async (req: Request, resp: Response) => {
    try {
      const users = await db.User.findAll(); // Recupera todos los usuarios de la base de datos
      resp.json({
        msg: "Lista de usuarios",
        users: users,
      });
    } catch (error: unknown) {  // Cambié el tipo a `unknown`
      if (error instanceof Error) {
        resp.status(500).json({
          msg: "Error al obtener los usuarios",
          error: error.message,
        });
      } else {
        resp.status(500).json({
          msg: "Error desconocido al obtener los usuarios",
          error: "Error desconocido",
        });
      }
    }
  });

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
router.get("/all", async (req: Request, res: Response) => {
  console.log(req.body)
  const users = await db.users.findAll()
  res.json(users)
  console.log(users)
})

router.post("/add", async (req: Request, res: Response) => {
  console.log(req.body)
  const name = req.body.name
  const email = req.body.email
  const password_hash = req.body.password_hash
  const role_id = req.body.role_id

  const users = await db.users.create({
      name : name,
      email : email,
      password_hash : password_hash,
      role_id : role_id
  })
  res.status(200).json(users)
})

router.post("/addMany", async (req: Request, res: Response) => {
  console.log(req.body)
  const users = req.body
  const usersCreated = await db.users.bulkCreate(users)
  res.status(200).json(usersCreated)
})

router.put("/update/:id", async (req: Request, res: Response) => {
  console.log(req.body)
  const id = req.params.id
  const name = req.body.name
  const email = req.body.email
  const password_hash = req.body.password_hash
  const role_id = req.body.role_id

  const users = await db.users.update({
      name : name,
      email : email,
      password_hash : password_hash,
      role_id : role_id
  }, {
      where: {
          id: Number(id)
      }
  })
  res.status(200).json(users)
})

router.delete("/delete/:id", async (req: Request, res: Response) => {
  console.log(req.body)
  const id = req.params.id
  const users = await db.users.destroy({
      where: {
          id: Number(id)
      }
  })
  res.status(200).json(users)
})

  //Agregar otros endpoints, post, get

  router.get("/totalUsers", async (req: Request, resp: Response) => {
    const totalUsers = await db.User.count({
      where: {
        role_id: 2
      }
    }
    )
    resp.json({
      msg: "",
      totalUsers: totalUsers
    })
  })



  router.post("/login", async (req: Request, resp: Response) => {
    console.log("🔹 Datos recibidos:", req.body);
    const { usuario, password } = req.body;

    const user = await db.User.findOne({
        where: { name: usuario }
    });

    console.log("🔹 Usuario encontrado en DB:", user);

    if (!user) {
        console.log("❌ Usuario no encontrado.");
        resp.status(401).json({ msg: "Error en login" });
    } else {
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        console.log("🔹 ¿Contraseña válida?:", isPasswordValid);

        if (!isPasswordValid) {
            console.log("❌ Contraseña incorrecta.");
            resp.status(401).json({ msg: "Error en login" });
        } else {
            console.log("✅ Usuario autenticado.");

            const token = jwt.sign(
                { userid: user.id, role: user.role_id, nombre: user.name, email: user.email },
                JWT_SECRET,
                { expiresIn: "2h" }
            );

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
});

router.use(cors()); // ✅ Habilita CORS para evitar bloqueos

// 🔹 Registrar usuario con contraseña encriptada
router.post("/register", async (req: Request, res: Response) => {
  console.log("🔹 Intentando registrar usuario:", req.body);

  const { name, email, password } = req.body;

  // 🔹 Verificar si el usuario ya existe
  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) {
      console.log("⚠️ Usuario ya registrado:", email);
      res.status(400).json({ msg: "Usuario ya registrado" });
      return;
  }

  // 🔹 Encriptar la contraseña
  const saltRounds = 10;
  const passwordEncrypted = await bcrypt.hash(password, saltRounds);

  // 🔹 Crear nuevo usuario en la base de datos
  const newUser = await db.User.create({
      name,
      email,
      password_hash: passwordEncrypted, // ✅ Guardamos la contraseña encriptada
      role_id: 2,
      verified: false,
  });

  await sendVerificationEmail(email);

  console.log("✅ Usuario registrado correctamente:", newUser);
  res.status(201).json({ msg: "Registro exitoso", data: newUser });
});

router.get("/verify", async (req: Request, res: Response) => {
  const { email } = req.query;

  // Buscar el usuario por el email
  const user = await db.User.findOne({ where: { email } });

  if (!user) {
   res.status(400).json({ msg: "Usuario no encontrado o ya verificado" });
  }

  if (user.verified) {
    res.status(400).json({ msg: "La cuenta ya está verificada" });
  }

  // Actualizar usuario como verificado
  await db.User.update(
    { verified: true },
    { where: { email } }
  );

  res.json({ msg: "Cuenta verificada con éxito" });
});

  return [path, router];
};

export default UserController
