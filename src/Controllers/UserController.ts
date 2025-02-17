import express, { Request, Response,} from "express";

const UserController = () => {
  const path: string = "/users";
  const router = express.Router();

//Agregar otros endpoints, post, get

router.get("/dashboardAdmin", (req: Request, resp: Response) => {
    const summary = {
        totalUsers: 1500,
        monthlyData: [150, 200, 180, 220, 300, 250, 210, 230, 270, 290, 310, 350]
      }
      resp.json({
        msg : "",
        summary : summary
    })
    })

  return [path, router];
}

export default UserController
