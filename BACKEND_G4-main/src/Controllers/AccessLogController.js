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
const sequelize_1 = require("sequelize");
const db = require("../DAO/models");
const AccessLogController = () => {
    const path = "/access-logs";
    const router = express_1.default.Router();
    // Endpoint para obtener el historial de accesos     
    router.get("/", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        const historial = yield db.AccessLog.findAll({
            include: {
                model: db.User,
                as: "User",
                attributes: ["name", "email"],
                required: true
            }
        });
        const formattedAccessLog = historial.map((accesslog) => {
            const fecha = new Date(accesslog.dataValues.access_time);
            const dia = fecha.getUTCDate().toString().padStart(2, '0');
            const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0');
            const año = fecha.getUTCFullYear().toString().slice(-2);
            const horas = fecha.getUTCHours().toString().padStart(2, '0');
            const minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
            return Object.assign(Object.assign({}, accesslog.dataValues), { User: accesslog.User, access_time: `${dia}/${mes}/${año}`, access_time_hour: `${horas}:${minutos}` // Ej: 08:30
             });
        });
        resp.json({
            msg: "",
            accessLog: formattedAccessLog
        });
    }));
    //Endpoint para obtener usuarios nuevos por mes
    router.get("/summary", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        const currentYear = new Date().getFullYear();
        const logs = yield db.AccessLog.findAll({
            where: {
                firstaccess: true,
                access_time: {
                    [sequelize_1.Op.between]: [
                        new Date(`${currentYear}-01-01`),
                        new Date(`${currentYear}-12-31`)
                    ]
                }
            },
            raw: true
        });
        const mesesUsuario = {
            'Ene': 0, 'Feb': 0, 'Mar': 0, 'Abr': 0,
            'May': 0, 'Jun': 0, 'Jul': 0, 'Ago': 0,
            'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dic': 0
        };
        for (const log of logs) {
            const fecha = new Date(log.access_time);
            const mesNumero = fecha.getMonth();
            const mesesKeys = Object.keys(mesesUsuario);
            const mesKey = mesesKeys[mesNumero];
            if (mesKey) {
                mesesUsuario[mesKey] += 1;
            }
        }
        resp.json({
            msg: "",
            nuevosUsuarios: mesesUsuario
        });
    }));
    return [path, router];
};
exports.default = AccessLogController;
