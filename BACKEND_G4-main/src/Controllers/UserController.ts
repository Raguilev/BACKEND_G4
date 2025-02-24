import express, { Request, Response, } from "express";
const db = require("../DAO/models")

const UserController = () => {
  const path: string = "/users";
  const router = express.Router();

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
