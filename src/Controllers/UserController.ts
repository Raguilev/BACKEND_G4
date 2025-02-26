import express, { Request, Response, Router } from "express";
const db = require("../DAO/models");

const UserController = (): [string, Router] => {
  const path: string = "/users";
  const router: Router = express.Router(); // Aseguramos el tipo `Router`

  

  // Ruta para obtener todos los usuarios
  router.get("/list", async (req: Request, resp: Response): Promise<void> => {
    try {
      const users = await db.User.findAll();
      resp.json({
        msg: "Lista de usuarios",
        users: users,
      });
    } catch (error: unknown) {
      resp.status(500).json({
        msg: "Error al obtener los usuarios",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  });

  // Ruta para obtener el total de usuarios con role_id = 2
  router.get("/totalUsers", async (req: Request, resp: Response): Promise<void> => {
    try {
      const totalUsers = await db.User.count({
        where: {
          role_id: 2,
        },
      });

      resp.json({
        msg: "",
        totalUsers: totalUsers,
      });
    } catch (error) {
      resp.status(500).json({
        msg: "Error al obtener el total de usuarios",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  });

  return [path, router]; // Aseguramos que el retorno es [string, Router]
};

export default UserController;
