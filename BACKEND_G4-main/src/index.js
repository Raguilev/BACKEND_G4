"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv")); //para lo del puerto
const body_parser_1 = __importDefault(require("body-parser")); // para post
const cors_1 = __importDefault(require("cors"));
const ExpenseController_1 = __importDefault(require("./Controllers/ExpenseController"));
const UserController_1 = __importDefault(require("./Controllers/UserController"));
const AccessLogController_1 = __importDefault(require("./Controllers/AccessLogController"));
const CategoryController_1 = __importDefault(require("./Controllers/CategoryController"));
const AuthController_1 = __importDefault(require("./Controllers/AuthController"));
/*import BudgetController from './Controllers/BudgetController' */
dotenv_1.default.config(); //para que tome el puerto
const app = (0, express_1.default)();
app.use(body_parser_1.default.json()); //para post
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('assets')); // Carpeta archivos estaticos
app.use((0, cors_1.default)()); // TODO: Incrementar la seguridad
const port = process.env.PORT || 3000; //en caso de que no haya puerto, se pone el 3003
app.use((0, cors_1.default)());
const [expensesPath, expensesRouter] = (0, ExpenseController_1.default)();
const [userPath, userRouter] = (0, UserController_1.default)();
const [accessLogsPath, accessLogsRouter] = (0, AccessLogController_1.default)();
const [categoryPath, categoryRouter] = (0, CategoryController_1.default)();
const [AuthPath, AuthRouter] = (0, AuthController_1.default)();
//const [BudgetPath, BudgetRouter] = BudgetController();
//app.use(BudgetPath as string, BudgetRouter as Router)
app.use(expensesPath, expensesRouter);
app.use(userPath, userRouter);
app.use(accessLogsPath, accessLogsRouter);
app.use(categoryPath, categoryRouter);
app.use(AuthPath, AuthRouter);
app.listen(port, () => {
    console.log(`Server ejecutandose en puerto: ${port}`);
});
