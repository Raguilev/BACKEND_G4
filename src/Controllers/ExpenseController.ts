import express, { Request, Response } from "express"
import path from "path";
const db = require("../DAO/models")
import fs from "fs";

import * as csv from 'fast-csv';
import {Writable} from "stream"
//import fastcsv from "fast-csv";
import * as fastcsv from "fast-csv";
import { Readable } from "stream";
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
    
         // AQUI BORRAR✅ Obtener el presupuesto del usuario para la categoría específica
        const presupuesto = await db.Budget.findOne({
            where: { user_id: user_id, category_id }
        });
        if (!presupuesto) {
            resp.status(404).json({ msg: "No se encontró un presupuesto para esta categoría." });
        }
        const budgetAmount = parseFloat(presupuesto.monthly_budget.toString());
        // ✅ Obtener el total de gastos acumulados en la categoría
        const totalSpent = await db.Expense.sum("amount", {
            where: { user_id: user_id, category_id }
        });
        const newTotal = (totalSpent || 0) + parseFloat(amount);

        let alerta = "";
        if (newTotal >= budgetAmount) {
            alerta = `🚨 Alerta: Has excedido tu presupuesto de S/. ${budgetAmount.toFixed(2)} en la categoría.`;
        } else if (newTotal >= budgetAmount * 0.8) {
            alerta = `⚠ Advertencia: Has gastado el ${((newTotal / budgetAmount) * 100).toFixed(1)}% de tu presupuesto en esta categoría.`;
        }
        
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
    router.get("/:user_id/export/csv", async (req: Request, res: Response) => {
        try {
            const { user_id } = req.params;
    
            // Convertir user_id a número
            const expenses = await db.Expense.findAll({
                where: { user_id: Number(user_id) },
                include: {
                    model: db.Category,
                    attributes: ["name"]
                }
            });
    

        // Definir el tipo de datos de cada fila
        interface CsvRow {
            Fecha: string;
            Categoría: string;
            Descripción: string;
            Recurrente: string;
            Monto: string;
        }

        // Mapear los datos al formato correcto
        const csvData: CsvRow[] = expenses.map((e: any) => ({
            Fecha: e.date ? e.date.toString() : "",
            Categoría: e.Category?.name || "Sin categoría",
            Descripción: e.description || "",
            Recurrente: e.recurring === true ? "Sí" : e.recurring === false ? "No" : "Desconocido",
            Monto: `S/. ${(e.amount ? parseFloat(e.amount.toString()) : 0).toFixed(2)}`
        }));

        console.log("📌 Datos CSV a exportar:", csvData);

        // ✅ Configurar encabezados HTTP para forzar la descarga
        res.setHeader("Content-Disposition", `attachment; filename=gastos_usuario_${user_id}.csv`);
        res.setHeader("Content-Type", "text/csv; charset=utf-8");

        // ✅ Crear un stream y escribir el CSV correctamente
        const csvStream = fastcsv.format<CsvRow, CsvRow>({ headers: true });
        const readableStream = new Readable({
            read() {} // Se necesita definir read() aunque esté vacío
        });

        // ✅ Escribir cada fila en el stream
        csvData.forEach(row => csvStream.write(row));
        csvStream.end();

        // ✅ Enviar el CSV al cliente
        csvStream.pipe(res);
        } catch (error) {
            console.error("❌ Error al exportar CSV:", error);
            res.status(500).json({ error: "Error al exportar el archivo CSV" });
        }
    });
    
    router.get("/:user_id/export/pdf", async (req: Request, res: Response) => {
        try {
            const { user_id } = req.params;
    
            const expenses = await db.Expense.findAll({
                where: { user_id },
                include: {
                    model: db.Category,
                    as: "Category",
                    attributes: ["name"]
                }
            });
    
            const pdf = new PDFDocument();
            res.setHeader("Content-Disposition", `attachment; filename=gastos_usuario_${user_id}.pdf`);
            res.setHeader("Content-Type", "application/pdf");
    
            pdf.pipe(res);
    
            pdf.fontSize(16).text(`Reporte de Gastos del Usuario ${user_id}`, { align: "center" });
            pdf.moveDown();
    
            expenses.forEach((e: any) => {
                pdf.fontSize(12).text(`Fecha: ${e.date}`);
                pdf.text(`Categoría: ${e.Category?.name || "Sin categoría"}`);
                pdf.text(`Descripción: ${e.description}`);
                pdf.text(`Recurrente: ${e.recurring ? "Sí" : "No"}`);
                pdf.text(`Monto: S/. ${parseFloat(e.amount.toString()).toFixed(2)}`);
                pdf.moveDown();
            });
    
            pdf.end();
        } catch (error) {
            console.error("❌ Error al exportar PDF:", error);
            res.status(500).send("Error al exportar el archivo PDF");
        }
    });
    
    
    
    
    
    
    
    return [basePath, router]


}
export default ExpenseController