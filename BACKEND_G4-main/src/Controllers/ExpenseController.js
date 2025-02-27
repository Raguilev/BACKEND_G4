"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db = require("../DAO/models");
const stream_1 = require("stream");
const sequelize_1 = require("sequelize");
const fastcsv = __importStar(require("fast-csv"));
const PDFDocument = require('pdfkit');
const ExpenseController = () => {
    const basePath = "/expenses";
    const router = express_1.default.Router();
    router.get("/", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        const expenses = yield db.Expense.findAll({
            include: {
                model: db.Category,
                as: "Category",
                attributes: ["name"],
                required: true
            }
        });
        const formattedExpenses = expenses.map((expense) => {
            const date = new Date(expense.dataValues.date);
            // Formateo seguro con UTC
            const day = date.getUTCDate().toString().padStart(2, '0');
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const year = date.getUTCFullYear();
            return Object.assign(Object.assign({}, expense.dataValues), { date: `${day}/${month}/${year}`, Category: expense.Category });
        });
        resp.json({
            msg: "",
            expenses: formattedExpenses
        });
    }));
    router.get("/:user_id", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        const { user_id } = req.params;
        const expenses = yield db.Expense.findAll({
            where: {
                user_id: user_id
            },
            include: {
                model: db.Category,
                as: "Category",
                attributes: ["name"],
                required: true
            }
        });
        if (expenses.length > 0) {
            resp.json({
                msg: "",
                expenses: expenses
            });
        }
        else {
            resp.json({
                msg: "No hay expenses"
            });
        }
    }));
    //http://localhost:5000/expenses/2
    router.post("/:user_id", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        const { user_id } = req.params;
        const { category_id, amount, description, date, recurring } = req.body;
        const nuevoGasto = yield db.Expense.create({
            user_id,
            category_id,
            amount,
            description,
            date,
            recurring: recurring !== null && recurring !== void 0 ? recurring : false // 🔥 Asegura que `recurring` sea `true` o `false`
        });
        resp.json({
            msg: "",
            expense: nuevoGasto
        });
    }));
    router.delete("/:expense_id", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const expense_id = Number(req.params.expense_id); // ✅ Convertimos a número correctamente
            if (isNaN(expense_id)) {
                resp.status(400).json({ msg: "ID de gasto inválido" });
                return;
            }
            console.log(`🔹 Eliminando gasto con ID: ${expense_id}`);
            const expense = yield db.Expense.findByPk(expense_id);
            if (!expense) {
                resp.status(404).json({ msg: "Gasto no encontrado" });
                return;
            }
            yield expense.destroy(); // ✅ Eliminamos el gasto
            resp.json({ msg: "Gasto eliminado correctamente" });
        }
        catch (error) {
            console.error("❌ Error eliminando gasto:", error.message || error);
            resp.status(500).json({ msg: "Error interno al eliminar gasto" });
        }
    }));
    router.put("/:expenseId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { expenseId } = req.params;
        const { date, category, description, recurring, amount } = req.body;
        try {
            const expense = yield db.Expense.findByPk(expenseId);
            if (!expense) {
                res.status(404).json({ msg: "Gasto no encontrado" });
            }
            // Actualizar los campos proporcionados
            if (date)
                expense.date = date;
            if (category)
                expense.category = category;
            if (description)
                expense.description = description;
            if (recurring !== undefined)
                expense.recurring = recurring;
            if (amount)
                expense.amount = amount;
            yield expense.save();
            res.json({ msg: "Gasto actualizado exitosamente", expense });
        }
        catch (error) {
            console.error("Error al actualizar gasto:", error);
            res.status(500).json({ msg: "Error al actualizar el gasto" });
        }
    }));
    router.get("/:user_id/export/csv", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user_id } = req.params;
            // Convertir user_id a número
            const expenses = yield db.Expense.findAll({
                where: { user_id: Number(user_id) },
                include: {
                    model: db.Category,
                    attributes: ["name"]
                }
            });
            // Mapear los datos al formato correcto
            const csvData = expenses.map((e) => {
                var _a;
                return ({
                    Fecha: e.date ? e.date.toString() : "",
                    Categoría: ((_a = e.Category) === null || _a === void 0 ? void 0 : _a.name) || "Sin categoría",
                    Descripción: e.description || "",
                    Recurrente: e.recurring === true ? "Sí" : e.recurring === false ? "No" : "Desconocido",
                    Monto: `S/. ${(e.amount ? parseFloat(e.amount.toString()) : 0).toFixed(2)}`
                });
            });
            console.log("📌 Datos CSV a exportar:", csvData);
            // ✅ Configurar encabezados HTTP para forzar la descarga
            res.setHeader("Content-Disposition", `attachment; filename=gastos_usuario_${user_id}.csv`);
            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            // ✅ Crear un stream y escribir el CSV correctamente
            const csvStream = fastcsv.format({ headers: true });
            const readableStream = new stream_1.Readable({
                read() { } // Se necesita definir read() aunque esté vacío
            });
            // ✅ Escribir cada fila en el stream
            csvData.forEach(row => csvStream.write(row));
            csvStream.end();
            // ✅ Enviar el CSV al cliente
            csvStream.pipe(res);
        }
        catch (error) {
            console.error("❌ Error al exportar CSV:", error);
            res.status(500).json({ error: "Error al exportar el archivo CSV" });
        }
    }));
    router.get("/:user_id/export/pdf", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user_id } = req.params;
            const expenses = yield db.Expense.findAll({
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
            expenses.forEach((e) => {
                var _a;
                pdf.fontSize(12).text(`Fecha: ${e.date}`);
                pdf.text(`Categoría: ${((_a = e.Category) === null || _a === void 0 ? void 0 : _a.name) || "Sin categoría"}`);
                pdf.text(`Descripción: ${e.description}`);
                pdf.text(`Recurrente: ${e.recurring ? "Sí" : "No"}`);
                pdf.text(`Monto: S/. ${parseFloat(e.amount.toString()).toFixed(2)}`);
                pdf.moveDown();
            });
            pdf.end();
        }
        catch (error) {
            console.error("❌ Error al exportar PDF:", error);
            res.status(500).send("Error al exportar el archivo PDF");
        }
    }));
    router.get(`/summary/monthly/:userId`, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const userIdNumber = parseInt(userId, 10);
            const expenses = yield db.Expense.findAll({
                where: {
                    user_id: userIdNumber
                }
            });
            const gastosMensuales = {};
            expenses.forEach((expense) => {
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
        }
        catch (error) {
            console.error("Error al obtener gastos mensuales:", error);
            resp.status(500).json({ msg: "Error interno" });
        }
    }));
    // Ruta para obtener el resumen de gastos por categoría
    router.get(`/summary/category/:userId`, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const expenses = yield db.Expense.findAll({
                where: {
                    user_id: userId
                },
                include: {
                    model: db.Category,
                    as: "Category",
                    required: true
                }
            });
            const gastosPorCategoria = {};
            expenses.forEach((expense) => {
                var _a;
                const categoria = ((_a = expense.Category) === null || _a === void 0 ? void 0 : _a.name) || "Sin categoría";
                if (!gastosPorCategoria[categoria]) {
                    gastosPorCategoria[categoria] = 0;
                }
                gastosPorCategoria[categoria] += parseFloat(expense.dataValues.amount);
            });
            console.log(gastosPorCategoria);
            resp.json({
                msg: "",
                gastosPorCategoria
            });
        }
        catch (error) {
            console.error("Error al obtener gastos por categoría:", error);
            resp.status(500).json({ msg: "Error interno" });
        }
    }));
    //  Endpoint para filtrar gastos
    router.get("/filter/:userId", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const { category, date, minAmount, maxAmount } = req.query;
            const filters = { user_id: userId };
            // 🔹 Filtro por categoría
            if (category) {
                filters["$Category.name$"] = { [sequelize_1.Op.eq]: category };
            }
            // 🔹 Filtro por fecha
            if (date) {
                filters["date"] = { [sequelize_1.Op.eq]: date };
            }
            // 🔹 Filtro por monto mínimo y máximo
            if (minAmount || maxAmount) {
                filters["amount"] = {};
                if (minAmount) {
                    filters["amount"][sequelize_1.Op.gte] = parseFloat(minAmount);
                }
                if (maxAmount) {
                    filters["amount"][sequelize_1.Op.lte] = parseFloat(maxAmount);
                }
            }
            console.log("📌 Filtros aplicados:", filters); // 🔥 Log para depuración
            const expenses = yield db.Expense.findAll({
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
        }
        catch (error) {
            console.error("❌ Error al filtrar gastos:", error);
            resp.status(500).json({ msg: "Error interno al obtener los gastos" });
        }
    }));
    router.post("/processRecurring", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const today = new Date();
            const lastMonth = new Date(today);
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            // 1. Buscar egresos recurrentes del mes pasado
            const recurringExpenses = yield db.Expense.findAll({
                where: {
                    recurring: true,
                    date: { [sequelize_1.Op.lt]: today }
                }
            });
            // 2. Duplicar los egresos para el siguiente mes
            for (const expense of recurringExpenses) {
                const newDate = new Date(expense.date);
                newDate.setMonth(newDate.getMonth() + 1);
                yield db.Expense.create({
                    user_id: expense.user_id,
                    amount: expense.amount,
                    description: expense.description,
                    recurring: true,
                    category_id: expense.category_id,
                    date: newDate
                });
            }
            // 3. Eliminar egresos no recurrentes del mes pasado
            yield db.Expense.destroy({
                where: {
                    recurring: false,
                    date: { [sequelize_1.Op.lt]: lastMonth }
                }
            });
            resp.json({ msg: "Egresos recurrentes procesados correctamente" });
        }
        catch (error) {
            resp.status(500).json({ msg: "Error procesando egresos recurrentes", error });
        }
    }));
    return [basePath, router];
};
exports.default = ExpenseController;
