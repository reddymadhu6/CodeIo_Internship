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
exports.fetchFromExcel = exports.updateAttendance = void 0;
const db_1 = __importDefault(require("../../utils/db"));
const updateAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userRole } = req;
    if (userRole === "student")
        return res.status(403).json({
            err: "no student access!",
        });
    const { courseObjId, studentId, classesConducted, classesAttended } = req.body;
    if (!(courseObjId && studentId && classesConducted))
        return res.status(400).json({
            err: "provide course object ID, studentID & present status for whom attendance is to be updated!"
        });
    try {
        const exists = yield db_1.default.attendance.findFirst({
            where: {
                courseObjId, studentId
            }
        });
        if (!exists)
            return res.status(404).json({
                err: "no such student registered!"
            });
        yield db_1.default.attendance.update({
            where: { attendanceId: exists.attendanceId },
            data: {
                classesConducted, classesAttended
            }
        });
        return res.status(200).json({
            msg: "success!"
        });
    }
    catch (e) {
        return res.status(400).json({
            err: "error: " + e.message
        });
    }
});
exports.updateAttendance = updateAttendance;
const fetchFromExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // fetch from uploaded excel sheet and call updateAttendance on all
});
exports.fetchFromExcel = fetchFromExcel;
