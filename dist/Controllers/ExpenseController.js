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
const db = require("../DAO/models");
const ExpenseController = () => {
    const path = "/expenses";
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
    return [path, router];
};
exports.default = ExpenseController;
