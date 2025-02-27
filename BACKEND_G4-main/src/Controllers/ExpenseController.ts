import express, { Request, Response } from "express"
import path from "path";
const db = require("../DAO/models")
import fs from "fs";
import {Writable} from "stream"
import { Readable } from "stream";
import { Op } from "sequelize";
import * as fastcsv from "fast-csv";



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
    router.put("/:expenseId", async (req: Request, res: Response) => {
        const { expenseId } = req.params;
        const { date, category, description, recurring, amount } = req.body;
    
        try {
            const expense = await db.Expense.findByPk(expenseId);
            if (!expense) {
                res.status(404).json({ msg: "Gasto no encontrado" });
            }
    
            // Actualizar los campos proporcionados
            if (date) expense.date = date;
            if (category) expense.category = category;
            if (description) expense.description = description;
            if (recurring !== undefined) expense.recurring = recurring;
            if (amount) expense.amount = amount;
    
            await expense.save();
            res.json({ msg: "Gasto actualizado exitosamente", expense });
        } catch (error) {
            console.error("Error al actualizar gasto:", error);
            res.status(500).json({ msg: "Error al actualizar el gasto" });
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
    
    
    
    router.get(`/summary/monthly/:userId`, async (req: Request, resp: Response) => {
        try {
            const { userId } = req.params;
            const userIdNumber = parseInt(userId, 10);
    
               
            const expenses = await db.Expense.findAll({
                where: {
                    user_id: userIdNumber
                }
            });
    
            const gastosMensuales: Record<string, number> = {};
    
            expenses.forEach((expense: any) => {
                const date = new Date(expense.dataValues.date);
                const mes = date.toLocaleDateString("es-ES", { month: "short" }); // Ej: "ene", "feb"
    
                if (!gastosMensuales[mes]) {
                    gastosMensuales[mes] = 0;
                }
                gastosMensuales[mes] += parseFloat(expense.dataValues.amount);
            });
    
            console.log(gastosMensuales);
    
            resp.json({
                msg: "",
                gastosMensuales
            });
        } catch (error) {
            console.error("Error al obtener gastos mensuales:", error);
            resp.status(500).json({ msg: "Error interno" });
        }
    });




// Ruta para obtener el resumen de gastos por categoría
router.get(`/summary/category/:userId`, async (req: Request, resp: Response) => {
    try {
        const { userId } = req.params;
        const expenses = await db.Expense.findAll({
            where: {
                user_id: userId
            },
            include: {
                model: db.Category,
                as: "Category",
                required: true
            }
         })

        const gastosPorCategoria: Record<string, number> = {};

        expenses.forEach((expense: any) => {
            const categoria = expense.Category?.name || "Sin categoría";
            
            if (!gastosPorCategoria[categoria]) {
                gastosPorCategoria[categoria] = 0;
            }
            gastosPorCategoria[categoria] += parseFloat(expense.dataValues.amount);
        });

        console.log(gastosPorCategoria)

        resp.json({
            msg: "",
            gastosPorCategoria
        });
    } catch (error) {
        console.error("Error al obtener gastos por categoría:", error);
        resp.status(500).json({ msg: "Error interno" });
    }
});
    //  Endpoint para filtrar gastos
    router.get("/filter/:userId", async (req: Request, resp: Response) => {
        try {
            const { userId } = req.params;
            const { category, date, minAmount, maxAmount } = req.query;
    
            const filters: any = { user_id: userId };
    
            // 🔹 Filtro por categoría
            if (category) {
                filters["$Category.name$"] = { [Op.eq]: category };  
            }
    
            // 🔹 Filtro por fecha
            if (date) {
                filters["date"] = { [Op.eq]: date };
            }
    
            // 🔹 Filtro por monto mínimo y máximo
            if (minAmount || maxAmount) {
                filters["amount"] = {};  
                if (minAmount) {
                    filters["amount"][Op.gte] = parseFloat(minAmount as string);
                }
                if (maxAmount) {
                    filters["amount"][Op.lte] = parseFloat(maxAmount as string);
                }
            }
    
            console.log("📌 Filtros aplicados:", filters);  // 🔥 Log para depuración
    
            const expenses = await db.Expense.findAll({
                where: filters,
                include: {
                    model: db.Category,
                    as: "Category",
                    attributes: ["name"],
                    required: true
                }
            });
    
            resp.json({
                msg: "",
                expenses
            });
        } catch (error) {
            console.error("❌ Error al filtrar gastos:", error);
            resp.status(500).json({ msg: "Error interno al obtener los gastos" });
        }
    });
    router.post("/processRecurring", async (req: Request, resp: Response) => {


        try {


            const today = new Date();


            const lastMonth = new Date(today);


            lastMonth.setMonth(lastMonth.getMonth() - 1);





            // 1. Buscar egresos recurrentes del mes pasado


            const recurringExpenses = await db.Expense.findAll({


                where: {


                    recurring: true,


                    date: { [Op.lt]: today }


                }


            });





            // 2. Duplicar los egresos para el siguiente mes


            for (const expense of recurringExpenses) {


                const newDate = new Date(expense.date);


                newDate.setMonth(newDate.getMonth() + 1);





                await db.Expense.create({


                    user_id: expense.user_id,


                    amount: expense.amount,


                    description: expense.description,


                    recurring: true,


                    category_id: expense.category_id,


                    date: newDate


                });


            }





            // 3. Eliminar egresos no recurrentes del mes pasado


            await db.Expense.destroy({


                where: {


                    recurring: false,


                    date: { [Op.lt]: lastMonth }


                }


            });





            resp.json({ msg: "Egresos recurrentes procesados correctamente" });


        } catch (error) {


            resp.status(500).json({ msg: "Error procesando egresos recurrentes", error });

        }});
    
    
    return [basePath, router]


}
export default ExpenseController