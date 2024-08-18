import { Request, Response } from "express";
import prisma from "../../utils/db";
import {CourseUndertaken} from "@prisma/client"

export const getAllCourses = async (req: Request, res: Response) => {
  const { userRole } = req;
  console.log("ROLE ISS: ", userRole);
  
  if (userRole === "student")
    return res.status(403).json({
      err: "not authorized!",
    });

    const teacherId = req.userId;

  try {
    const response: Array<CourseUndertaken> = await prisma.courseUndertaken.findMany({
      where:{
        teacherId
      },
      include: {
        course: true
      }
    });
    if(response) return res.status(200).json(response);
    else throw new Error("no courses found!");
  } catch (e: any) {
    return res.status(404).json({
      err: "error: " + e.message,
    });
  }
};

export const addNewCourse = async (req: Request, res: Response) => {
  const { userRole } = req;
  if (userRole !== "admin")
    return res.status(403).json({
      err: "only admin is allowed to add course!",
    });

  const { courseName, courseCode, integratedLab, courseUndertaken } = req.body;
  try {
    const exists = await prisma.course.findFirst({
      where: {
        courseCode,
      },
    });
    if (exists)
      return res.status(400).json({
        err: "course already exists!",
      });

    await prisma.course.create({
      data: {
        courseName,
        courseCode,
        integratedLab,
        courseUndertaken
      },
    });

    return res.status(200).json({
      msg: "success!",
    });
  } catch (e: any) {
    return res.status(400).json({
      err: "error: " + e.message,
    });
  }
};

export const createUndertaking = async (req: Request, res: Response) => {
  const { courseCode, teacherId, classId } = req.body;
  if (!courseCode || !teacherId || !classId)
    res.status(400).json({
      err: "invalid input! missing values!",
    });

  try {
    const exists = await prisma.courseUndertaken.findFirst({
      where: {
        AND: [{ courseCode }, { classId }],
      },
    });
    if (exists) {
      await prisma.courseUndertaken.update({
        data: { teacherId },
        where: {
          courseObjId: exists.courseObjId,
        },
      });

      return res.status(200).json({
        msg: "teacher updated successfully!",
      });
    }

    await prisma.courseUndertaken.create({
      data: {
        courseCode,
        teacherId,
        classId,
      },
    });

    return res.status(200).json({
      msg: "successfully created new course undertaking!",
    });
  } catch (e: any) {
    return res.status(400).json({
      err: "error: " + e.message,
    });
  }
};
