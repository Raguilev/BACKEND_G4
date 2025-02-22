import express, { Request, Response, } from "express";
const db = require("../DAO/models")

const UserController = () => {
  const path: string = "/users";
  const router = express.Router();

  //Agregar otros endpoints, post, get

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
