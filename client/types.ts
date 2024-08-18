export interface UserProps {
  data: {
    studentId?: string;
    teacherId?:  string;
    adminId?: string;
    name: string;
    email: string;
    userRole: "student" | "teacher" | "admin";
  };
}

export interface AuthOptions {
  name: string;
  userId: string;
  userRole: "student" | "teacher" | "admin";
}

export interface Attendance {
  classesAttended: number;
  classesConducted: number;
}

export interface Course {
  courseCode: string;
  courseName: string;
}

export interface CourseUndertaken {
  courseObjId: string;
  teacherId: string;
  classId: string;
  attendance: Attendance;
  course: Course;
}

export interface StudentProps {
  studentId: string;
  name: string;
  email: string;
  usn: string;
}

export interface ScoreProps {
  CourseObj: CourseUndertaken
  studentId: string;
  score: number;
  cie_1: number;
  cie_2: number;
  cie_3: number;
  quiz_1: number;
  quiz_2: number;
  aat: number;
  lab: number;
  total: number;
  semester: string;
  Student: StudentProps;
}

export interface ScoreTableProps {
  CourseObj: CourseUndertaken;
  examType: string;
  score: number;
}