import express, { Request, Response, Router, } from "express";
import { Sequelize, Op } from "sequelize"
const db = require("../DAO/models")

const AccessLogController = () => {
  const path: string = "/access-logs";
  const router = express.Router();

  // Endpoint para obtener el historial de accesos     
  router.get("/", async (req: Request, resp: Response) => {
    const historial = await db.AccessLog.findAll()
    resp.json({
      msg: "",
      accessLog: historial
    })
  })

  //Endpoint para obtener usuarios nuevos por mes
  router.get("/summary", async (req: Request, resp: Response) => {
    const currentYear = new Date().getUTCFullYear();

    const monthlyCounts = await db.AccessLog.findAll({
        attributes: [
            [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "access_time" AT TIME ZONE \'UTC\'')), 'month'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: {
          firstaccess: true,
          // Usar Op.and directamente
          [Op.and]: [
              Sequelize.where(
                  Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "access_time" AT TIME ZONE \'UTC\'')),
                  currentYear
              )
          ]
      },
        group: ['month'],
        order: [['month', 'ASC']],
        raw: true
    });

    const monthMap: { [key: number]: string } = {
        1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr',
        5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago',
        9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
    };

    // Inicializar todos los meses del año actual con 0
    const result: { [key: string]: number } = {};
    Object.values(monthMap).forEach(month => {
        result[month] = 0;
    });

    // Llenar con datos reales del año actual
    monthlyCounts.forEach((entry: any) => {
        const monthKey = monthMap[entry.month];
        if (monthKey) {
            result[monthKey] = entry.count;
        }
    });

    resp.json({
        msg: "",
        monthlyNewUsers: result
    });


});
    /*const currentYear = new Date().getFullYear();
    const filteredLogs = accessLogs.filter(
      (userAction) => userAction.date.getFullYear() === currentYear
    );
  
    const userActionMap = filteredLogs.map((userAction) => {
      return {
        key: (userAction.date.getMonth() + 1).toString(), // "1" para enero, etc.
        value: userAction.firstAccess ? 1 : 0
      };
    });
  
    // Inicializamos un objeto con claves de "1" a "12" con valor 0
    const initialSummary: Record<string, number> = {};
    for (let i = 1; i <= 12; i++) {
      initialSummary[i.toString()] = 0;
    }
  
    const usersFirstAccess = userActionMap.reduce((obj, actual) => {
      obj[actual.key] += actual.value;
      return obj;
    }, initialSummary);
  
    res.json({
      msg: "",
      summary: usersFirstAccess
    });*/
  


  return [path, router]
}


export default AccessLogController

