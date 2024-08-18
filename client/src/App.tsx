import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgotPassword";
import PageNotFound from "./pages/404-page";
import NavBar from "./_components/navbar/navbar";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import Dashboard from "./pages/u/dashboard";
import TeacherCourseCode from "./pages/u/teacherDashboard/teacherCourseCode";
import ScoreUpdater from "./pages/u/teacherDashboard/scoreUpdater";

function App() {
  return (
    <>
      <NavBar />
      <div className="p-10 pt-28 flex flex-col min-h-screen w-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login/password-reset" element={<ForgotPassword />} />

          <Route element={<AuthOutlet fallbackPath="/login" />}>
            <Route path="/u" element={<Dashboard />} />
            <Route path="/u/:courseCode" element={<TeacherCourseCode />} />
            <Route path="/u/:courseCode/score-update/:classId" element={<ScoreUpdater />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
