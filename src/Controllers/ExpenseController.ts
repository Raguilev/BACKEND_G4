import express, { Request, Response } from "express"
import { where } from "sequelize"
const db = require("../DAO/models")

export interface Expense {
    id: number;
    user_id: number;
    date: string;
    amount: number;
    description: string;
    category: Categoria;
    recurring: boolean;
}

export interface Categoria {
    id: number
    name: string
}

const ExpenseController = () => {
    const path: string = "/expenses"
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
            const isoDate = expense.dataValues.date.toISOString(); 
            const [year, month, day] = isoDate.split('T')[0].split('-');
            
            return {
                ...expense.dataValues,
                Category: expense.Category,
                date: `${day}/${month}/${year}` 
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

    return [path, router]

}
export default ExpenseController