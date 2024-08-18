import { Request, Response } from "express";
import prisma from "../../utils/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { email, usn, password } = req.body;
  console.log(usn + " " + email);
  
  if (usn !== "" && email !== "")
    return res.status(400).json({ error: "use only email or usn, not both" });

  if (usn) {
    try {
      const result = await prisma.student.findUnique({
        where: {
          usn,
        },
      });

      if (!result) {
        return res.status(400).json({
          err: "no such user exists!",
        });
      }

      const match = await bcrypt.compare(password, result.password);
      console.log("Match is: ", match);
      

      if (match) {
        const token = jwt.sign(
          {
            studentId: result.studentId,
            usn: result.usn,
            userRole: "student",
            name: result.name,
          },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );
        return res.status(200).json({
          accessToken: `${token}`,
          userId: result.studentId,
          userRole: "student"
        });
      } else
        res.status(400).json({
          err: "invalid credentials!",
        });
    } catch (e: any) {
      return res.status(500).json({
        err: "error: " + e.message,
      });
    }
  } else {
    try {
      console.log("HERE");
      
      const result = await prisma.teacher.findUnique({
        where: {
          email,
        },
      });

      console.log("RESULT: ", result);
      

      if (!result) {
        console.log("RESULT LMAO: ", result);
        const resultStud = await prisma.student.findUnique({
          where: { email },
        });

        console.log("resultStud: ", resultStud);
        

        if (!resultStud)
          return res.status(400).json({
            err: "invalid credentials!",
          });

        const match = await bcrypt.compare(password, resultStud.password);
        console.log("MATCH: ", match);
        
        if (match) {
          const token = jwt.sign(
            {
              studentId: resultStud.studentId,
              usn: resultStud.usn,
              userRole: "student",
              name: resultStud.name,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
          );
          return res.status(200).json({
            accessToken: `${token}`,
            userId: resultStud.studentId,
            userRole: "student"
          });
        } else
          return res.status(400).json({
            err: "invalid credentials!",
          });
      }

      const match = await bcrypt.compare(password, result.password);
      console.log("test");
      if (match) {
        console.log("test2");
        const token = jwt.sign(
          {
            teacherId: result.teacherId,
            employeeId: result.employeeId,
            userRole: "teacher",
            name: result.name,
          },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );

        return res.status(200).json({
          accessToken: `${token}`,
          userId: result.teacherId,
          userRole: "teacher"
        });
      } else
        res.status(400).json({
          err: "invalid credentials!",
        });
    } catch (e: any) {
      console.log(e);
      
      return res.status(500).json({
        err: "error: " + e.message,
      });
    }
  }
};
