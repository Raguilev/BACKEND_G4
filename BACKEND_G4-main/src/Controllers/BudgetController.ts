import express, { Request, Response } from "express";
const db = require("../DAO/models");

const BudgetController = () => {
    const basePath: string = "/budgets";
    const router = express.Router();

    // ✅ Obtener todos los presupuestos
    router.get("/", async (req: Request, res: Response) => {
        try {
            const budgets = await db.Budget.findAll({
                include: [
                    {
                        model: db.Category,
                        as: "Category",
                        attributes: ["name"]
                    },
                    {
                        model: db.User,
                        as: "User",
                        attributes: ["id", "name"] 
                    }
                ]
            });
            res.json({ budgets });
        } catch (error) {
            console.error("❌ Error obteniendo presupuestos:", error);
            res.status(500).json({ msg: "Error interno al obtener presupuestos" });
        }
    });

    // ✅ Obtener presupuestos de un usuario específico
    router.get("/:user_id", async (req: Request, res: Response) => {
        try {
            const user_id = Number(req.params.user_id);
            console.log(`🔹 Buscando presupuestos para user_id: ${user_id}`); // Debug
    
            const budgets = await db.Budget.findAll({
                where: { user_id },
                include: [{ model: db.Category, as: "Category", attributes: ["name"] }]
            });

            console.log("📌 Presupuestos encontrados:", budgets);
    
            if (!budgets.length) {
                res.status(404).json({ msg: "No hay presupuestos para este usuario" });
                return; // ✅ Se asegura que la función termina aquí
            }
    
            res.json({ budgets });
        } catch (error) {
            console.error("❌ Error obteniendo presupuestos:", error);
            res.status(500).json({ msg: "Error interno al obtener presupuestos" });
        }
    });
    

    // ✅ Crear un nuevo presupuesto
    router.post("/:user_id", async (req: Request, res: Response) => {
        try {
            const { user_id } = req.params;
            const { category_id, monthly_budget } = req.body; // Cambie amount por monthly_budget

            const newBudget = await db.Budget.create({
                user_id,
                category_id,
                monthly_budget
            });

            res.status(201).json({ msg: "Presupuesto creado", budget: newBudget });
        } catch (error) {
            console.error("❌ Error creando presupuesto:", error);
            res.status(500).json({ msg: "Error interno al crear presupuesto" });
        }
    });
/* Lo comento porque sino se crashea la pagina, pero ese seria el codigo para editar y borrar :(
    // ✅ Actualizar un presupuesto
    router.put("/:budget_id", async (req: Request, res: Response) => {
        try {
            const budget_id = Number(req.params.budget_id);
            const { category_id, monthly_budget } = req.body; 

            if (isNaN(budget_id)) {
                return res.status(400).json({ msg: "ID de presupuesto inválido" });
            }

            const budget = await db.Budget.findByPk(budget_id);
            if (!budget) {
                return res.status(404).json({ msg: "Presupuesto no encontrado" });
            }

            await budget.update({ category_id, monthly_budget });

            res.json({ msg: "Presupuesto actualizado", budget });
        } catch (error) {
            console.error("❌ Error actualizando presupuesto:", error);
            res.status(500).json({ msg: "Error interno al actualizar presupuesto" });
        }
    });

    // ✅ Eliminar un presupuesto
    router.delete("/:budget_id", async (req: Request, res: Response) => {
        try {
            const budget_id = Number(req.params.budget_id);

            if (isNaN(budget_id)) {
                return res.status(400).json({ msg: "ID de presupuesto inválido" });
            }

            const budget = await db.Budget.findByPk(budget_id);
            if (!budget) {
                return res.status(404).json({ msg: "Presupuesto no encontrado" });
            }

            await budget.destroy();

            res.json({ msg: "Presupuesto eliminado correctamente" });
        } catch (error) {
            console.error("❌ Error eliminando presupuesto:", error);
            res.status(500).json({ msg: "Error interno al eliminar presupuesto" });
        }
    });
*/
    return [basePath, router];
};

export default BudgetController;