import express, { Request, Response } from "express"
import path from "path";
const db = require("../DAO/models")
import fs from "fs";

import fastcsv from "fast-csv";
interface Egreso {
    fecha: string;
    descripcion: string;
    recurrente: boolean;
    monto: number;
    categoria?: {
        nombre: string;
    };
}

const PDFDocument = require('pdfkit');
const ExpenseController = () => {
    const basePath: string = "/expenses"
    const router = express.Router()

    router.get("/", async (req: Request, resp: Response) => {
        const expenses = await db.Expense.findAll({
            include: {
                model: db.Category,
                as: "Category",
                attributes: ["name"],
                required: true
            }
        })
        const formattedExpenses = expenses.map((expense: any) => {
            const date = new Date(expense.dataValues.date);
            
            // Formateo seguro con UTC
            const day = date.getUTCDate().toString().padStart(2, '0');
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const year = date.getUTCFullYear();
      
            return {
              ...expense.dataValues,
              date: `${day}/${month}/${year}`, // Formato DD/MM/YYYY
              Category: expense.Category
            };
          });

        resp.json({
            msg: "",
            expenses: formattedExpenses
        });
    })

    router.get("/:user_id", async (req: Request, resp: Response) => {
        const { user_id } = req.params;
        const expenses = await db.Expense.findAll({
            where: {
                user_id: user_id
            },
            include: {
                model: db.Category,
                as: "Category",
                attributes: ["name"],
                required: true
            }
        })
        if (expenses.length > 0) {
            resp.json({
                msg: "",
                expenses: expenses
            })
        } else {
            resp.json({
                msg: "No hay expenses"
            })
        }
    })
    //http://localhost:5000/expenses/2
    router.post("/:user_id", async (req: Request, resp: Response) => {
        const { user_id } = req.params;
        const {  category_id, amount, description, date, recurring } = req.body;
    
        const nuevoGasto = await db.Expense.create({
            
            user_id,
            category_id,
            amount,
            description,
            date,
            recurring: recurring ?? false // 🔥 Asegura que `recurring` sea `true` o `false`
        });
    
        resp.json({
            msg: "",
            expense: nuevoGasto
        });
    });
    
    router.delete("/:expense_id", async (req: Request, resp: Response): Promise<void> => {
        try {
            const expense_id = Number(req.params.expense_id); // ✅ Convertimos a número correctamente

            if (isNaN(expense_id)) {
                resp.status(400).json({ msg: "ID de gasto inválido" });
                return;
            }

            console.log(`🔹 Eliminando gasto con ID: ${expense_id}`);

            const expense = await db.Expense.findByPk(expense_id);

            if (!expense) {
                resp.status(404).json({ msg: "Gasto no encontrado" });
                return;
            }

            await expense.destroy(); // ✅ Eliminamos el gasto

            resp.json({ msg: "Gasto eliminado correctamente" });
        } catch (error: any) {
            console.error("❌ Error eliminando gasto:", error.message || error);
            resp.status(500).json({ msg: "Error interno al eliminar gasto" });
        }
    });
    router.get("/csv", async (req: Request, resp: Response) => {
        try {
            // 1. Obtener los registros de la tabla Egreso
            const egresos = await db.Egreso.findAll({
                include: {
                    model: db.Category,
                    as: "Categoria",
                    attributes: ["nombre"] // Solo obtenemos el nombre de la categoría
                }
            });
    
            // 2. Mapear los datos al formato deseado
            const csvData = egresos.map((e: any) => ({
                Fecha: e.fecha,
                Categoría: e.Categoria?.nombre || "Sin categoría",
                Descripción: e.descripcion,
                Recurrente: e.recurrente ? "Sí" : "No",
                Monto: `S/. ${parseFloat(e.monto.toString()).toFixed(2)}`,
            }));
    
            // 3. Definir la ruta donde se guardará el archivo temporalmente
            const filePath = path.join(__dirname, "../../exports/egresos.csv");
            const ws = fs.createWriteStream(filePath);
    
            // 4. Generar el archivo CSV y enviarlo como descarga
            fastcsv.write(csvData, { headers: true })
                .on("finish", () => resp.download(filePath)) // Cuando termine de escribir, envía el archivo al cliente
                .pipe(ws); // Escribe el CSV en el archivo temporal
    
        } catch (error) {
            console.error("Error al exportar CSV:", error);
            resp.status(500).json({ error: "Error al exportar el archivo CSV" });
        }
    });
    router.get("/pdf", async (req: Request, res: Response) => {
        try {
            const egresos = await db.Egreso.findAll();
    
            const pdf = new PDFDocument();
            res.setHeader("Content-Disposition", "attachment; filename=egresos.pdf"); 
            //Archivo adjunto con nombre egresos.pdf
            res.setHeader("Content-Type", "application/pdf");
            //es un tipo archivo PDF
    
            pdf.pipe(res); //Conecta el flujo de escritura PDF al objeto Response
    
            pdf.fontSize(16).text("Reporte de Egresos", { align: "center" });
            pdf.moveDown();

            egresos.forEach((e: Egreso) => {
                pdf.fontSize(12).text(`Fecha: ${e.fecha}`);
                pdf.text(`Categoría: ${e.categoria?.nombre || "Sin categoría"}`);
                pdf.text(`Descripción: ${e.descripcion}`);
                pdf.text(`Recurrente: ${e.recurrente ? "Sí" : "No"}`);
                pdf.text(`Monto: S/. ${parseFloat(e.monto.toString()).toFixed(2)}`);
                pdf.moveDown();
            });
    
            pdf.end();
        } catch (error) {
            console.error("Error al exportar PDF:", error);
            res.status(500).send("Error al exportar el archivo PDF");
        }
    });
    
    
    
    
    
    
    return [basePath, router]


}
export default ExpenseController