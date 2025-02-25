import express, { Request, Response, } from "express";
import bcrypt from "bcrypt";
const db = require("../DAO/models")

const UserController = () => {
  const path: string = "/users";
  const router = express.Router();

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



  router.post("/", async (req: Request, resp: Response) => {
    console.log(req.body)
    const usuario = req.body.usuario
    const password = req.body.password

    const usuarios = await db.User.findAll({
      where: {
        name: usuario,
        password_hash: password,

      }
    })
    //console.log(usuarios)

    if (usuarios.length > 0) {
      
      // Login correcto
      resp.json({
        msg: ``,
        nombre: usuarios[0].name,
        role: usuarios[0].role_id,
        userid: usuarios[0].id,
        email:usuarios[0].email
        
      })
    } else {
      // Login es incorrecto
      resp.json({
        msg: "Error en login"
      })
    }
  })

  return [path, router];
}





export default UserController
