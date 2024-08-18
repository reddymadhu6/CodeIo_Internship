import { Request, Response } from "express";
import prisma from "../../utils/db";
import bcrypt from "bcrypt";
import multer from "multer";
import * as xlsx from "xlsx";
import * as path from "path";
import * as fs from "fs";
import { semesterenum } from '@prisma/client'
import jwt from "jsonwebtoken";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploadMarks");
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now() + file.originalname}`);
	},
});

export const upload = multer({ storage });

export const signup = async (req: Request, res: Response) => {
	const { name, email, password, joiningDate } = req.body;
	let yoj: Date;
	try {
		if (joiningDate) {
			const l = joiningDate.split("-");
			if (l.length !== 3) {
				yoj = new Date(Date.now());
			} else {
				const year = parseInt(l[2], 10);
				const month = parseInt(l[1], 10) - 1;
				const date = parseInt(l[0], 10) + 1;

				yoj = new Date(year, month, date);
			}
		} else yoj = new Date(Date.now());

		try {
			if (!yoj) throw new Error("invalid admission date provided");
		} catch (e: any) {
			return res.status(500).json({
				err: "error: " + e.message,
			});
		}
	} catch (e: any) {
		return res.status(500).json({
			err: "internal server error: " + e.message,
		});
	}

	let allowed;
	try {
		allowed = await prisma.adminAddedTeacherEmail.findUnique({
			where: { email },
		});
		if (!allowed) return res.status(403).json({ err: "email unauthorized!" });
	} catch (e: any) {
		return res.status(500).json({ err: "error: " + e.message });
	}

	try {
		const exists = await prisma.teacher.findFirst({
			where: {
				OR: [{ email }, { employeeId: allowed.employeeId }],
			},
		});

		if (exists)
			return res.status(400).json({ error: "user already registered!" });

		const hashedPassword = await bcrypt.hash(password, 10);
		const result = await prisma.teacher.create({
			data: {
				name,
				employeeId: allowed.employeeId,
				email,
				password: hashedPassword,
				joiningDate: yoj,
			},
		});

		await prisma.teacherDetails.create({
			data: { joiningDate: yoj, teacherId: result.teacherId },
		});

		await prisma.adminAddedTeacherEmail.update({
			where: { email },
			data: { employeeId: result.employeeId },
		});

		return res.status(200).json({
			msg: "Success",
		});
	} catch (err: any) {
		console.log(err);

		return res.status(500).json({
			err: "internal server error" + err.message,
		});
	}
};

export const getAllTeachers = async (req: Request, res: Response) => {
	const { userRole } = req;
	if (!userRole || userRole !== "admin")
		return res.status(400).json({
			err: "only admin access!",
		});

	try {
		const result: Array<object> = await prisma.teacher.findMany({
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
	} catch (e: any) {
		return res.status(400).json({
			err: "Error: " + e.message,
		});
	}
};

export const getSpecificTeacher = async (req: Request, res: Response) => {
	const { userRole } = req;
	const { teacherId } = req.params;

  console.log(userRole, teacherId, req.userId, userRole);
  
	if (userRole !== "admin" && (teacherId != req.userId))
		return res.status(403).json({
			err: "neither are you admin LMAO, nor requesting for your own info",
		});

	try {
		const result: Array<object> = await prisma.teacher.findMany({
			include: {
				teacherDetails: true,
			},
		});

		if (!result.length)
			return res.status(404).json({
				err: "No user found!",
			});

		return res.status(200).json(result[0]);
	} catch (e: any) {
		res.status(400).json({
			err: "Error: " + e.message,
		});
	}
};

export const updateTeacherDetails = async (req: Request, res: Response) => {
	const { teacherId } = req.params;
	const { password, dateOfBirth, gender, address, joiningDate, phNo } =
		req.body;

	const { userRole } = req;
	if (userRole !== "admin" && teacherId !== req.userId)
		return res.status(403).json({
			err: "neither are you the admin, nor are you requesting for your own information!",
		});

	if (password) {
		try {
			const hashedPassword = await bcrypt.hash(password, 10);
			await prisma.teacher.update({
				data: {
					password: hashedPassword,
				},
				where: { teacherId },
			});
		} catch (e: any) {
			console.log("error updatinng password!");
		}

		try {
			const l = dateOfBirth.split("-");
			const m = joiningDate.split("-");
			let dob: Date | undefined;
			let yoj: Date | undefined;
			if (l.length === 3) {
				const year = parseInt(l[2], 10);
				const month = parseInt(l[1], 10) - 1;
				const date = parseInt(l[0], 10) + 1;

				dob = new Date(year, month, date);
			} else dob = undefined;

			if (m.length === 3) {
				const year = parseInt(l[2], 10);
				const month = parseInt(l[1], 10) - 1;
				const date = parseInt(l[0], 10) + 1;

				yoj = new Date(year, month, date);
			} else yoj = undefined;

			await prisma.teacherDetails.update({
				data: {
					gender,
					address,
					phNo,
					dateOfBirth: dob,
					joiningDate: yoj,
				},
				where: { teacherId },
			});
		} catch (e: any) {
			return res.status(400).json({
				err: "error updating profile!",
			});
		}
	}
};

export const makeClassTeacher = async (req: Request, res: Response) => {
	const { userRole } = req;
	if (userRole !== "admin")
		return res.status(403).json({
			err: "not authorized for this action!",
		});

	const { classId } = req.body;
	const { teacherId } = req.params;

	try {
		await prisma.classTeacher.create({
			data: {
				teacherId,
				classId,
			},
		});

		return res.status(200).json({
			msg: "success!",
		});
	} catch (e: any) {
		return res.status(500).json({
			err: "error: " + e.message,
		});
	}
};

export const uploadMarks = async (req: Request, res: Response) => {
 
	interface marksInput {
		usn: string;
		courseCode: string;
		cie1: number;
		cie2: number;
		cie3: number;
		quiz1?: number;
		quiz2?: number;
		aat?: number;
		lab?: number;
		total: number;
    semester: semesterenum;
	}

	const directoryPath = path.join(__dirname, "../../../uploadMarks");
	const files = fs.readdirSync(directoryPath);
	const excelfile = files[0];
	const excelFilePath = path.join(directoryPath, excelfile);
	const workbook = xlsx.readFile(excelFilePath);
	const worksheet = xlsx.utils.sheet_to_json(
		workbook.Sheets[workbook.SheetNames[0]]
	) as marksInput[];

	try {
		for (let row of worksheet) {
			const response = await prisma.student.findFirst({
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
			const temp = await prisma.courseUndertaken.findFirst({
				where:{
					courseCode:row.courseCode,
					teacherId
				}
			});

			console.log(temp);

			const scoreDetails = await prisma.score.findFirst({
				where:{
					studentId,
					courseObjId:temp?.courseObjId
				}
			});


			if(scoreDetails?.scoreId){
				const resp = await prisma.score.update({
					data:{
						cie_1: row.cie1?row.cie1:0,
						cie_2: row.cie2?row.cie2:0,
						cie_3: row.cie3?row.cie3:0,
						aat: row.aat ? row.aat : 0,
						quiz_1: row.quiz1 ? row.quiz1 : 0,
						quiz_2: row.quiz2 ? row.quiz2 : 0,
						lab: row.lab ? row.lab : 0,
						total: row.total ? row.total : 0,
						semester: row.semester
					},
					where:{
						scoreId:scoreDetails?.scoreId
					}
				})
			}else{
				const courseObjId = temp?.courseObjId as string;
				const resp = await prisma.score.create({
					data:{
						studentId,
						courseObjId,
						cie_1: row.cie1?row.cie1:0,
						cie_2: row.cie2?row.cie2:0,
						cie_3: row.cie3?row.cie3:0,
						aat: row.aat ? row.aat : 0,
						quiz_1: row.quiz1 ? row.quiz1 : 0,
						quiz_2: row.quiz2 ? row.quiz2 : 0,
						lab: row.lab ? row.lab : 0,
						total: row.total ? row.total : 0,
						semester: row.semester
					}
				})
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
				} else {
					console.log("deleted succesfully");
				}
			});
		}

		return res.json({
			response: "updated marks succesfully",
		});
	} catch (err: any) {
		return res.json({ err: err.message });
	}
};


export const getClassScores = async (req: Request, res: Response) => {
	console.log("HERE");
	
	const { userRole, userId } = req;
	const courseCode: string = req.query.courseCode as string;
	const classId: string = req.query.classId as string;

	let courseObj: string;
	try {
		const result = await prisma.courseUndertaken.findFirst({
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
		
		
		if(!result) throw new Error("you are not allowed to access this class");

		if((userRole !== "admin") && (result.teacherId !== userId)) throw new Error("unauthorized access!");

		courseObj = result.courseObjId;
	}
	catch (e: any) {
		return res.status(403).json({
			err: "Error: " + e.message
		})
	}

	try {
		const response = await prisma.score.findMany({
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
	catch (e: any) {
		return res.status(400).json({
			err: "Error: " + e.message
		})
	}
}