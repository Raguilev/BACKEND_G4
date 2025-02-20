import express, { Request, Response, Router,} from "express";
const AccessLogController = () => {
    const path: string = "/access-logs";
    const router = express.Router();
    const accessLogs = [
      {
        id: 1,
        user_id: 1,
        date: new Date(2025, 0, 1, 8, 30),  // Enero 2024
        action: "Login",
        firstAccess: true
      },
      {
        id: 2,
        user_id: 2,
        date: new Date(2025, 1, 2, 9, 15),  // Febrero 2025
        action: "Login",
        firstAccess: false
      },
      {
        id: 3,
        user_id: 3,
        date: new Date(2025, 1, 3, 14, 20), // Febrero 2025
        action: "Login",
        firstAccess: true
      },
      {
        id: 4,
        user_id: 4,
        date: new Date(2025, 2, 10, 10, 0), // Marzo 2025
        action: "Login",
        firstAccess: true
      },
      {
        id: 5,
        user_id: 5,
        date: new Date(2025, 3, 15, 11, 30), // Abril 2025
        action: "Login",
        firstAccess: false
      },
      {
        id: 6,
        user_id: 6,
        date: new Date(2025, 4, 20, 8, 45),  // Mayo 2025
        action: "Login",
        firstAccess: true
      },
      {
        id: 7,
        user_id: 7,
        date: new Date(2025, 5, 5, 9, 0),    // Junio 2025
        action: "Login",
        firstAccess: true
      },
      {
        id: 8,
        user_id: 8,
        date: new Date(2025, 6, 12, 15, 30), // Julio 2025
        action: "Login",
        firstAccess: false
      },
      {
        id: 9,
        user_id: 9,
        date: new Date(2025, 7, 25, 16, 15), // Agosto 2025
        action: "Login",
        firstAccess: true
      },
      {
        id: 10,
        user_id: 10,
        date: new Date(2025, 8, 1, 7, 30),   // Septiembre 2025
        action: "Login",
        firstAccess: true
      },
      {
        id: 11,
        user_id: 11,
        date: new Date(2025, 9, 10, 12, 0),  // Octubre 2025
        action: "Login",
        firstAccess: false
      },
      {
        id: 12,
        user_id: 12,
        date: new Date(2025, 10, 18, 13, 45), // Noviembre 2025
        action: "Login",
        firstAccess: true
      },
      {
        id: 13,
        user_id: 13,
        date: new Date(2025, 11, 24, 17, 0),  // Diciembre 2025
        action: "Login",
        firstAccess: true
      }
    ];
    

    // Endpoint para obtener el historial de accesos     
    router.get("/", (req: Request, res: Response) => {      
      const historial = [
        { id: "001", nombre: "Jessica", correo: "jess@taxes.com", fecha: "12/12/2024", hora: "17:50", accion: "Borrar" },
        { id: "002", nombre: "Jhon", correo: "jon@taxes.com", fecha: "17/12/2024", hora: "19:50", accion: "Agregar" },
        { id: "003", nombre: "Diego", correo: "dieg@taxes.com", fecha: "22/12/2024", hora: "14:20", accion: "Editar" },
        { id: "004", nombre: "Juan", correo: "juan@taxes.com", fecha: "02/12/2024", hora: "13:50", accion: "Borrar" },
        { id: "005", nombre: "Luis", correo: "luis@taxes.com", fecha: "07/12/2024", hora: "12:50", accion: "Borrar" }
      ];
  
      res.json({
        msg: "",
        historial: historial
      })
    })

    //Endpoint para obtener usuarios nuevos por mes
    router.get("/summary", (req: Request, res: Response) => {
      const currentYear = new Date().getFullYear();
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
      });
    });
    
  
    return [path, router]
  }

  
  export default AccessLogController

  