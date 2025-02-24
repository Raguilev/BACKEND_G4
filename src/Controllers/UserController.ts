import express, { Request, Response, } from "express";
const db = require("../DAO/models")

const UserController = () => {
  const path: string = "/users";
  const router = express.Router();

  //Agregar otros endpoints, post, get

  // Ruta para obtener todos los usuarios
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
  

  router.get("/totalUsers", async (req: Request, resp: Response) => {
    const totalUsers = await db.User.count({
      where:{
        role_id : 2
      }
    }
    )
    resp.json({
      msg: "",
      totalUsers: totalUsers
    })
  })

  return [path, router];
}

export default UserController
