"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const express_1 = __importDefault(require("express"));
const teacherController_1 = require("../controllers/teacherController");
const middleware_1 = require("../controllers/middleware");
// Endpoint here hits the /api/t/ endpoint
exports.api = (0, express_1.default)();
exports.api.post("/register", teacherController_1.signup);
exports.api.use(middleware_1.authMiddleware);
exports.api.get("/", teacherController_1.getAllTeachers);
exports.api.get("/scores", teacherController_1.getClassScores);
exports.api.get("/:teacherId", teacherController_1.getSpecificTeacher);
exports.api.put("/:teacherId", teacherController_1.updateTeacherDetails);
exports.api.post("/:teacherId/makeClassTeacher", teacherController_1.makeClassTeacher);
exports.api.post("/uploadMarks", teacherController_1.upload.single('file'), teacherController_1.uploadMarks);
