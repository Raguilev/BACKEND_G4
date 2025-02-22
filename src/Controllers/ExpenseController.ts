import express, { Request, Response } from "express"
import { where } from "sequelize"
const db = require("../DAO/models")

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

    return [path, router]

}
export default ExpenseController