import express, { Request, Response,} from "express";
const AccessLogController = () => {
    const path: string = "/access-logs";
    const router = express.Router();
  
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
  
    return [path, router]
  };
  
  export default AccessLogController