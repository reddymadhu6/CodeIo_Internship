import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useNavigate } from "react-router-dom";
import { AuthOptions } from "types";
import StudentDashboard from "./studentDashboard/studentDashboard";
import TeacherDashboard from "./teacherDashboard/teacherDashboard";
import AdminDashboard from "./adminDashboard";

const Dashboard = () => {
  const user: AuthOptions | null = useAuthUser();
  const navigate = useNavigate();
  if (!user) navigate("/login");
  const { userRole } = user as AuthOptions;

  if (userRole === "student") return <main className="flex justify-center items-center"><StudentDashboard /></main>;
  else if (userRole === "teacher") return <main className="flex justify-center items-center"><TeacherDashboard /></main>;
  else return <AdminDashboard />;
};

export default Dashboard;
