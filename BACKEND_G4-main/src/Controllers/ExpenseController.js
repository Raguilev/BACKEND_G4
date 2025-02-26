"use strict";
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
const path_1 = __importDefault(require("path"));
const db = require("../DAO/models");
const fs_1 = __importDefault(require("fs"));
const fast_csv_1 = __importDefault(require("fast-csv"));
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
    router.get("/csv", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // 1. Obtener los registros de la tabla Egreso
            const egresos = yield db.Egreso.findAll({
                include: {
                    model: db.Category,
                    as: "Categoria",
                    attributes: ["nombre"] // Solo obtenemos el nombre de la categoría
                }
            });
            // 2. Mapear los datos al formato deseado
            const csvData = egresos.map((e) => {
                var _a;
                return ({
                    Fecha: e.fecha,
                    Categoría: ((_a = e.Categoria) === null || _a === void 0 ? void 0 : _a.nombre) || "Sin categoría",
                    Descripción: e.descripcion,
                    Recurrente: e.recurrente ? "Sí" : "No",
                    Monto: `S/. ${parseFloat(e.monto.toString()).toFixed(2)}`,
                });
            });
            // 3. Definir la ruta donde se guardará el archivo temporalmente
            const filePath = path_1.default.join(__dirname, "../../exports/egresos.csv");
            const ws = fs_1.default.createWriteStream(filePath);
            // 4. Generar el archivo CSV y enviarlo como descarga
            fast_csv_1.default.write(csvData, { headers: true })
                .on("finish", () => resp.download(filePath)) // Cuando termine de escribir, envía el archivo al cliente
                .pipe(ws); // Escribe el CSV en el archivo temporal
        }
        catch (error) {
            console.error("Error al exportar CSV:", error);
            resp.status(500).json({ error: "Error al exportar el archivo CSV" });
        }
    }));
    router.get("/pdf", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const egresos = yield db.Egreso.findAll();
            const pdf = new PDFDocument();
            res.setHeader("Content-Disposition", "attachment; filename=egresos.pdf");
            //Archivo adjunto con nombre egresos.pdf
            res.setHeader("Content-Type", "application/pdf");
            //es un tipo archivo PDF
            pdf.pipe(res); //Conecta el flujo de escritura PDF al objeto Response
            pdf.fontSize(16).text("Reporte de Egresos", { align: "center" });
            pdf.moveDown();
            egresos.forEach((e) => {
                var _a;
                pdf.fontSize(12).text(`Fecha: ${e.fecha}`);
                pdf.text(`Categoría: ${((_a = e.categoria) === null || _a === void 0 ? void 0 : _a.nombre) || "Sin categoría"}`);
                pdf.text(`Descripción: ${e.descripcion}`);
                pdf.text(`Recurrente: ${e.recurrente ? "Sí" : "No"}`);
                pdf.text(`Monto: S/. ${parseFloat(e.monto.toString()).toFixed(2)}`);
                pdf.moveDown();
            });
            pdf.end();
        }
        catch (error) {
            console.error("Error al exportar PDF:", error);
            res.status(500).send("Error al exportar el archivo PDF");
        }
    }));
    return [basePath, router];
};
exports.default = ExpenseController;
