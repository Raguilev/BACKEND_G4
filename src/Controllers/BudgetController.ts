import express, { Request, Response } from "express";
const db = require ("../DAO/models")

class BudgetController {
    public path = "/budget";
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/list", this.getBudgetList);
    }

    private getBudgetList = async (req: Request, res: Response) => {
        try {
            const budgets = await db.Budget.findAll(); // Recupera todos los presupuestos de la base de datos
            res.json({
                msg: "Lista de presupuestos",
                budgets: budgets,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({
                    msg: "Error al obtener los presupuestos",
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    msg: "Error desconocido al obtener los presupuestos",
                    error: "Error desconocido",
                });
            }
        }
    };
}

export default BudgetController;