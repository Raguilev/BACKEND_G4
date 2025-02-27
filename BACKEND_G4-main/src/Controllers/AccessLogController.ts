import express, { Request, Response, Router, } from "express";
import { Sequelize, Op } from "sequelize"
const db = require("../DAO/models")

const AccessLogController = () => {
  const path: string = "/access-logs";
  const router = express.Router();

  // Endpoint para obtener el historial de accesos     
  router.get("/", async (req: Request, resp: Response) => {
    const historial = await db.AccessLog.findAll({
      include: {
        model: db.User,
        as: "User",
        attributes: ["name", "email"],
        required: true
      }
    })

    const formattedAccessLog = historial.map((accesslog: any) => {
      const fecha = new Date(accesslog.dataValues.access_time);
    
      // Usar métodos locales en lugar de UTC
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const año = fecha.getFullYear().toString().slice(-2);
    
      const horas = fecha.getHours().toString().padStart(2, '0');
      const minutos = fecha.getMinutes().toString().padStart(2, '0');
    
    

      return {
        ...accesslog.dataValues,
        User: accesslog.User,
        access_time: `${dia}/${mes}/${año}`, // Ej: 25/02/25
        access_time_hour: `${horas}:${minutos}` // Ej: 08:30
      };
    });

    resp.json({
      msg: "",
      accessLog: formattedAccessLog
    })
  })

  //Endpoint para agregar logs
  //Endpoint para agregar logs
  router.post("/:user_id", async (req: Request, resp: Response) => {
    const { user_id } = req.params;
    const { action, firstaccess } = req.body;
    const user = await db.User.findByPk(user_id);

    if (!user) {
      resp.json({
        msg: "No hay usuario"
      });
      return
    }



    const newAccessLog = await db.AccessLog.create({
      user_id: user_id,
      action: action,
      firstaccess: firstaccess,
      access_time: new Date()
    })
    resp.json({
      msg: "Accion añadida"
    })
  });
  //Endpoint para obtener usuarios nuevos por mes
  router.get("/summary", async (req: Request, resp: Response) => {
    const currentYear = new Date().getFullYear();

    const logs = await db.AccessLog.findAll({
      where: {
        firstaccess: true,
        access_time: {
          [Op.between]: [
            new Date(`${currentYear}-01-01`),
            new Date(`${currentYear}-12-31`)
          ]
        }
      },
      raw: true
    });

    const mesesUsuario: { [key: string]: number } = {
      'Ene': 0, 'Feb': 0, 'Mar': 0, 'Abr': 0,
      'May': 0, 'Jun': 0, 'Jul': 0, 'Ago': 0,
      'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dic': 0
    };


    for (const log of logs) {
      const fecha = new Date(log.access_time);
      const mesNumero = fecha.getMonth();

      const mesesKeys = Object.keys(mesesUsuario);
      const mesKey = mesesKeys[mesNumero];

      if (mesKey) {
        mesesUsuario[mesKey] += 1;
      }
    }

    resp.json({
      msg: "",
      nuevosUsuarios: mesesUsuario
    });

  });
  //Endpoint para agregar logs
  router.post("/:user_id", async (req: Request, resp: Response) => {
    const { user_id } = req.params;
    const { action, firstaccess } = req.body;
    const user = await db.User.findByPk(user_id);

    if (!user) {
      resp.json({
        msg: "No hay usuario"
      })
      return
    }

    const newAccessLog = await db.AccessLog.create({
      user_id: user_id,
      action: action,
      firstaccess: firstaccess,
      access_time: new Date()
    })
    resp.json({
      msg: "Accion añadida"
    })
  });
  return [path, router]
}


export default AccessLogController

