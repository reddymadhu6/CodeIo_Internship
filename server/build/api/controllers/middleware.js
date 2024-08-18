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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers.authorization || "";
        console.log("TOKE: ", token);
        try {
            const jwtToken = token.split(" ")[1];
            const response = jsonwebtoken_1.default === null || jsonwebtoken_1.default === void 0 ? void 0 : jsonwebtoken_1.default.verify(jwtToken, process.env.JWT_SECRET);
            req.userRole = response.userRole;
            if (response.studentId)
                req.userId = response.studentId;
            if (response.teacherId)
                req.userId = response.teacherId;
            if (response.adminId)
                req.userId = response.adminId;
            console.log("RESPOSE: ", response);
            // response.userRole && (response.studentId || response.teacherId)
            if (response.userId || (response.userRole && (response.studentId || response.teacherId))) {
                next();
            }
            else {
                console.log("LMAO HERE");
                return res.json({
                    err: "not authorized",
                });
            }
        }
        catch (e) {
            console.log("HERERE");
            return res.status(403).json({
                err: "not authorized",
            });
        }
    });
}
exports.authMiddleware = authMiddleware;
