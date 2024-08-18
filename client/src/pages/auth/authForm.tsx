import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentRegisterForm from "./studentRegisterForm";
import TeacherRegisterForm from "./teacherRegisterForm";
import LoginForm from "./loginForm";

const AuthForm = ({ login }: { login: boolean }) => {
  return login ? (
    <Tabs defaultValue="login" className="w-[500px] mt-10">
      <TabsList className="w-full px-4">
        <TabsTrigger value="login" className="bg-muted w-full">
          Login
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
    </Tabs>
  ) : (
    <Tabs defaultValue="student" className="w-[500px] mt-10">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="student" className="bg-muted">
          Student Register
        </TabsTrigger>
        <TabsTrigger value="faculty" className="bg-muted">
          Faculty Register
        </TabsTrigger>
      </TabsList>
      <TabsContent value="student">
        <StudentRegisterForm />
      </TabsContent>
      <TabsContent value="faculty">
        <TeacherRegisterForm />
      </TabsContent>
    </Tabs>
  );
};

export default AuthForm;
