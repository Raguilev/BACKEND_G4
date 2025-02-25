import express, { Request, Response } from "express";
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

        resp.json({
            msg: "",
            expenses: expenses
        });
    });

    return [path, router];
};

export default ExpenseController;
