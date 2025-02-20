import express, { Request, Response, } from "express";

const UserController = () => {
  const path: string = "/users";
  const router = express.Router();

  //Agregar otros endpoints, post, get

  router.get("/totalUsers", (req: Request, resp: Response) => {
    const totalUsers = 1500
    resp.json({
      msg: "",
      totalUsers: totalUsers
    })
  })

  return [path, router];
}

export default UserController
