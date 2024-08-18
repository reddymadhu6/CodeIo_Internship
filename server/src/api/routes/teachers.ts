import express from "express";
import { getAllTeachers, getSpecificTeacher, makeClassTeacher, signup, updateTeacherDetails, uploadMarks,upload, getClassScores } from "../controllers/teacherController";
import { authMiddleware } from "../controllers/middleware";

// Endpoint here hits the /api/t/ endpoint

export const api = express();

api.post("/register", signup);
api.use(authMiddleware);
api.get("/", getAllTeachers);
api.get("/scores", getClassScores)
api.get("/:teacherId", getSpecificTeacher);
api.put("/:teacherId", updateTeacherDetails);
api.post("/:teacherId/makeClassTeacher", makeClassTeacher);
api.post("/uploadMarks", upload.single('file'),uploadMarks);