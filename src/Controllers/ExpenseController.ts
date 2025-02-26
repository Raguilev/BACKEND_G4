import express, { Request, Response } from "express";
import { Op } from "sequelize";
const db = require("../DAO/models");

const ExpenseController = () => {
    const path: string = "/expenses";
    const router = express.Router();

    router.get("/", async (req: Request, resp: Response) => {
        const expenses = await db.Expense.findAll({
            include: {
                model: db.Category,
                as: "Category",
                attributes: ["name"],
                required: true
            }
        });

        const formattedExpenses = expenses.map((expense: any) => {
            const date = new Date(expense.dataValues.date);
            const day = date.getUTCDate().toString().padStart(2, '0');
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const year = date.getUTCFullYear();
            return {
                ...expense.dataValues,
                date: `${day}/${month}/${year}`,
                Category: expense.Category
            };
        });

        resp.json({ msg: "", expenses: formattedExpenses });
    });

    router.get("/:user_id", async (req: Request, resp: Response) => {
        const { user_id } = req.params;
        const expenses = await db.Expense.findAll({
            where: { user_id: user_id },
            include: {
                model: db.Category,
                as: "Category",
                attributes: ["name"],
                required: true
            }
        });
        if (expenses.length > 0) {
            resp.json({ msg: "", expenses: expenses });
        } else {
            resp.json({ msg: "No hay expenses" });
        }
    });

    // Procesar egresos recurrentes
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
        }
    });

    return [path, router];
};

export default ExpenseController;
