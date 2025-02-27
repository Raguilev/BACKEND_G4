"use strict";
/*
const db = require("../DAO/models")
import express, { Request, Response } from "express";

class BudgetController {
    const path = "/budget"
    const router = express.Router()
    
    router.get("/list", async (req: Request, res: Response) => {
        try {
            const budgets = await db.Budget.findAll(); // Recupera todos los presupuestos de la base de datos
            res.json({
                msg: "Lista de presupuestos",
                budgets: budgets,
            });
        } catch (error: unknown) {  // Cambié el tipo a `unknown`
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
    });
    return [ path, router ]
    
}

export default new BudgetController();
*/ 
