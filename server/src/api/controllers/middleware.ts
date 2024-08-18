import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
dotenv.config();

interface CustomJwtPayload extends JwtPayload {
	userId: string;
}

declare module "express-serve-static-core" {
	interface Request {
		userRole?: string;
		userId: string;
	}
}

export async function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const token = req.headers.authorization || "";

	try {
		const jwtToken = token.split(" ")[1];
		const response = jwt?.verify(
			jwtToken,
			process.env.JWT_SECRET as string
		) as CustomJwtPayload;
		req.userRole = response.userRole;
		if (response.studentId) req.userId = response.studentId;
		else if (response.teacherId) req.userId = response.teacherId;
		else if (response.adminId) req.userId = response.adminId;

		if (response.userRole && (response.studentId || response.teacherId)) {
			next();
		} else {
			console.log("LMAO HERE");

			return res.json({
				err: "not authorized",
			});
		}
	} catch (e: any) {
		return res.status(403).json({
			err: "not authorized",
		});
	}
}
