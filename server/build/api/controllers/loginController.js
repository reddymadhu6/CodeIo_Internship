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
exports.login = void 0;
const db_1 = __importDefault(require("../../utils/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, usn, password } = req.body;
    console.log(usn + " " + email);
    if (usn !== "" && email !== "")
        return res.status(400).json({ error: "use only email or usn, not both" });
    if (usn) {
        try {
            const result = yield db_1.default.student.findUnique({
                where: {
                    usn,
                },
            });
            if (!result) {
                return res.status(400).json({
                    err: "no such user exists!",
                });
            }
            const match = yield bcrypt_1.default.compare(password, result.password);
            console.log("Match is: ", match);
            if (match) {
                const token = jsonwebtoken_1.default.sign({
                    studentId: result.studentId,
                    usn: result.usn,
                    userRole: "student",
                    name: result.name,
                }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return res.status(200).json({
                    accessToken: `${token}`,
                    userId: result.studentId,
                    userRole: "student"
                });
            }
            else
                res.status(400).json({
                    err: "invalid credentials!",
                });
        }
        catch (e) {
            return res.status(500).json({
                err: "error: " + e.message,
            });
        }
    }
    else {
        try {
            console.log("HERE");
            const result = yield db_1.default.teacher.findUnique({
                where: {
                    email,
                },
            });
            console.log("RESULT: ", result);
            if (!result) {
                console.log("RESULT LMAO: ", result);
                const resultStud = yield db_1.default.student.findUnique({
                    where: { email },
                });
                console.log("resultStud: ", resultStud);
                if (!resultStud)
                    return res.status(400).json({
                        err: "invalid credentials!",
                    });
                const match = yield bcrypt_1.default.compare(password, resultStud.password);
                console.log("MATCH: ", match);
                if (match) {
                    const token = jsonwebtoken_1.default.sign({
                        studentId: resultStud.studentId,
                        usn: resultStud.usn,
                        userRole: "student",
                        name: resultStud.name,
                    }, process.env.JWT_SECRET, { expiresIn: "1h" });
                    return res.status(200).json({
                        accessToken: `${token}`,
                        userId: resultStud.studentId,
                        userRole: "student"
                    });
                }
                else
                    return res.status(400).json({
                        err: "invalid credentials!",
                    });
            }
            const match = yield bcrypt_1.default.compare(password, result.password);
            console.log("test");
            if (match) {
                console.log("test2");
                const token = jsonwebtoken_1.default.sign({
                    teacherId: result.teacherId,
                    employeeId: result.employeeId,
                    userRole: "teacher",
                    name: result.name,
                }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return res.status(200).json({
                    accessToken: `${token}`,
                    userId: result.teacherId,
                    userRole: "teacher"
                });
            }
            else
                res.status(400).json({
                    err: "invalid credentials!",
                });
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({
                err: "error: " + e.message,
            });
        }
    }
});
exports.login = login;
