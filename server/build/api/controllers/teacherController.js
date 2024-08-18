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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getClassScores = exports.uploadMarks = exports.makeClassTeacher = exports.updateTeacherDetails = exports.getSpecificTeacher = exports.getAllTeachers = exports.signup = exports.upload = void 0;
const db_1 = __importDefault(require("../../utils/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const multer_1 = __importDefault(require("multer"));
const xlsx = __importStar(require("xlsx"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploadMarks");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now() + file.originalname}`);
    },
});
exports.upload = (0, multer_1.default)({ storage });
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, joiningDate } = req.body;
    let yoj;
    try {
        if (joiningDate) {
            const l = joiningDate.split("-");
            if (l.length !== 3) {
                yoj = new Date(Date.now());
            }
            else {
                const year = parseInt(l[2], 10);
                const month = parseInt(l[1], 10) - 1;
                const date = parseInt(l[0], 10) + 1;
                yoj = new Date(year, month, date);
            }
        }
        else
            yoj = new Date(Date.now());
        try {
            if (!yoj)
                throw new Error("invalid admission date provided");
        }
        catch (e) {
            return res.status(500).json({
                err: "error: " + e.message,
            });
        }
    }
    catch (e) {
        return res.status(500).json({
            err: "internal server error: " + e.message,
        });
    }
    let allowed;
    try {
        allowed = yield db_1.default.adminAddedTeacherEmail.findUnique({
            where: { email },
        });
        if (!allowed)
            return res.status(403).json({ err: "email unauthorized!" });
    }
    catch (e) {
        return res.status(500).json({ err: "error: " + e.message });
    }
    try {
        const exists = yield db_1.default.teacher.findFirst({
            where: {
                OR: [{ email }, { employeeId: allowed.employeeId }],
            },
        });
        if (exists)
            return res.status(400).json({ error: "user already registered!" });
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const result = yield db_1.default.teacher.create({
            data: {
                name,
                employeeId: allowed.employeeId,
                email,
                password: hashedPassword,
                joiningDate: yoj,
            },
        });
        yield db_1.default.teacherDetails.create({
            data: { joiningDate: yoj, teacherId: result.teacherId },
        });
        yield db_1.default.adminAddedTeacherEmail.update({
            where: { email },
            data: { employeeId: result.employeeId },
        });
        return res.status(200).json({
            msg: "Success",
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            err: "internal server error" + err.message,
        });
    }
});
exports.signup = signup;
const getAllTeachers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userRole } = req;
    if (!userRole || userRole !== "admin")
        return res.status(400).json({
            err: "only admin access!",
        });
    try {
        const result = yield db_1.default.teacher.findMany({
            include: {
                teacherDetails: true,
            },
        });
        console.log(result);
        if (!result.length)
            return res.status(404).json({
                err: "No users found!",
            });
        res.status(200).json(result);
    }
    catch (e) {
        return res.status(400).json({
            err: "Error: " + e.message,
        });
    }
});
exports.getAllTeachers = getAllTeachers;
const getSpecificTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userRole } = req;
    const { teacherId } = req.params;
    console.log(userRole, teacherId, req.userId, userRole);
    if (userRole !== "admin" && (teacherId != req.userId))
        return res.status(403).json({
            err: "neither are you admin LMAO, nor requesting for your own info",
        });
    try {
        const result = yield db_1.default.teacher.findMany({
            include: {
                teacherDetails: true,
            },
        });
        if (!result.length)
            return res.status(404).json({
                err: "No user found!",
            });
        return res.status(200).json(result[0]);
    }
    catch (e) {
        res.status(400).json({
            err: "Error: " + e.message,
        });
    }
});
exports.getSpecificTeacher = getSpecificTeacher;
const updateTeacherDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { teacherId } = req.params;
    const { password, dateOfBirth, gender, address, joiningDate, phNo } = req.body;
    const { userRole } = req;
    if (userRole !== "admin" && teacherId !== req.userId)
        return res.status(403).json({
            err: "neither are you the admin, nor are you requesting for your own information!",
        });
    if (password) {
        try {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            yield db_1.default.teacher.update({
                data: {
                    password: hashedPassword,
                },
                where: { teacherId },
            });
        }
        catch (e) {
            console.log("error updatinng password!");
        }
        try {
            const l = dateOfBirth.split("-");
            const m = joiningDate.split("-");
            let dob;
            let yoj;
            if (l.length === 3) {
                const year = parseInt(l[2], 10);
                const month = parseInt(l[1], 10) - 1;
                const date = parseInt(l[0], 10) + 1;
                dob = new Date(year, month, date);
            }
            else
                dob = undefined;
            if (m.length === 3) {
                const year = parseInt(l[2], 10);
                const month = parseInt(l[1], 10) - 1;
                const date = parseInt(l[0], 10) + 1;
                yoj = new Date(year, month, date);
            }
            else
                yoj = undefined;
            yield db_1.default.teacherDetails.update({
                data: {
                    gender,
                    address,
                    phNo,
                    dateOfBirth: dob,
                    joiningDate: yoj,
                },
                where: { teacherId },
            });
        }
        catch (e) {
            return res.status(400).json({
                err: "error updating profile!",
            });
        }
    }
});
exports.updateTeacherDetails = updateTeacherDetails;
const makeClassTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userRole } = req;
    if (userRole !== "admin")
        return res.status(403).json({
            err: "not authorized for this action!",
        });
    const { classId } = req.body;
    const { teacherId } = req.params;
    try {
        yield db_1.default.classTeacher.create({
            data: {
                teacherId,
                classId,
            },
        });
        return res.status(200).json({
            msg: "success!",
        });
    }
    catch (e) {
        return res.status(500).json({
            err: "error: " + e.message,
        });
    }
});
exports.makeClassTeacher = makeClassTeacher;
const uploadMarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const directoryPath = path.join(__dirname, "../../../uploadMarks");
    const files = fs.readdirSync(directoryPath);
    const excelfile = files[0];
    const excelFilePath = path.join(directoryPath, excelfile);
    const workbook = xlsx.readFile(excelFilePath);
    const worksheet = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    try {
        for (let row of worksheet) {
            const response = yield db_1.default.student.findFirst({
                where: { usn: row.usn },
            });
            if (!response) {
                return res.json({
                    err: "no such student exists",
                });
            }
            const teacherId = req.userId;
            const studentId = response.studentId;
            console.log(teacherId);
            console.log(row.courseCode);
            const temp = yield db_1.default.courseUndertaken.findFirst({
                where: {
                    courseCode: row.courseCode,
                    teacherId
                }
            });
            console.log(temp);
            const scoreDetails = yield db_1.default.score.findFirst({
                where: {
                    studentId,
                    courseObjId: temp === null || temp === void 0 ? void 0 : temp.courseObjId
                }
            });
            if (scoreDetails === null || scoreDetails === void 0 ? void 0 : scoreDetails.scoreId) {
                const resp = yield db_1.default.score.update({
                    data: {
                        cie_1: row.cie1 ? row.cie1 : 0,
                        cie_2: row.cie2 ? row.cie2 : 0,
                        cie_3: row.cie3 ? row.cie3 : 0,
                        aat: row.aat ? row.aat : 0,
                        quiz_1: row.quiz1 ? row.quiz1 : 0,
                        quiz_2: row.quiz2 ? row.quiz2 : 0,
                        lab: row.lab ? row.lab : 0,
                        total: row.total ? row.total : 0,
                        semester: row.semester
                    },
                    where: {
                        scoreId: scoreDetails === null || scoreDetails === void 0 ? void 0 : scoreDetails.scoreId
                    }
                });
            }
            else {
                const courseObjId = temp === null || temp === void 0 ? void 0 : temp.courseObjId;
                const resp = yield db_1.default.score.create({
                    data: {
                        studentId,
                        courseObjId,
                        cie_1: row.cie1 ? row.cie1 : 0,
                        cie_2: row.cie2 ? row.cie2 : 0,
                        cie_3: row.cie3 ? row.cie3 : 0,
                        aat: row.aat ? row.aat : 0,
                        quiz_1: row.quiz1 ? row.quiz1 : 0,
                        quiz_2: row.quiz2 ? row.quiz2 : 0,
                        lab: row.lab ? row.lab : 0,
                        total: row.total ? row.total : 0,
                        semester: row.semester
                    }
                });
            }
            console.log(row.semester);
            // const newResponse = await prisma.score.upsert({
            // 	where: {
            // 		scoreId : scoreDetails?.
            // 	},
            // 	update: {
            // 		cie_1: row.cie1?row.cie1:0,
            // 		cie_2: row.cie2?row.cie2:0,
            // 		cie_3: row.cie3?row.cie3:0,
            // 		aat: row.aat ? row.aat : 0,
            // 		quiz_1: row.quiz1 ? row.quiz1 : 0,
            // 		quiz_2: row.quiz2 ? row.quiz2 : 0,
            // 		lab: row.lab ? row.lab : 0,
            // 		total: row.total ? row.total : 0,
            // 		semester: row.semester
            // 	},
            // 	create: {
            // 		studentId,
            // 		courseObjId: row.courseCode,
            // 		cie_1: row.cie1,
            // 		cie_2: row.cie2,
            // 		cie_3: row.cie3,
            // 		aat: row.aat ? row.aat : 0,
            // 		quiz_1: row.quiz1 ? row.quiz1 : 0,
            // 		quiz_2: row.quiz2 ? row.quiz2 : 0,
            // 		lab: row.lab ? row.lab : 0,
            // 		total: row.total ? row.total : 0,
            // 		semester: row.semester
            // 	},
            // });
        }
        for (const file of files) {
            fs.unlink(path.join(directoryPath, file), (err) => {
                if (err) {
                    console.log("error while deleting");
                }
                else {
                    console.log("deleted succesfully");
                }
            });
        }
        return res.json({
            response: "updated marks succesfully",
        });
    }
    catch (err) {
        return res.json({ err: err.message });
    }
});
exports.uploadMarks = uploadMarks;
const getClassScores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("HERE");
    const { userRole, userId } = req;
    const courseCode = req.query.courseCode;
    const classId = req.query.classId;
    let courseObj;
    try {
        const result = yield db_1.default.courseUndertaken.findFirst({
            where: {
                AND: {
                    courseCode,
                    classId
                }
            },
            select: {
                teacherId: true,
                courseObjId: true
            }
        });
        console.log("RESULT: ", result);
        if (!result)
            throw new Error("you are not allowed to access this class");
        if ((userRole !== "admin") && (result.teacherId !== userId))
            throw new Error("unauthorized access!");
        courseObj = result.courseObjId;
    }
    catch (e) {
        return res.status(403).json({
            err: "Error: " + e.message
        });
    }
    try {
        const response = yield db_1.default.score.findMany({
            where: {
                courseObjId: courseObj
            },
            include: {
                Student: true,
                CourseObj: {
                    include: {
                        course: true
                    }
                }
            }
        });
        return res.status(200).json(response);
    }
    catch (e) {
        return res.status(400).json({
            err: "Error: " + e.message
        });
    }
});
exports.getClassScores = getClassScores;
