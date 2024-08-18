import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { BaseSyntheticEvent, useCallback, useState } from "react";
import { useGlobalContext } from "@/../utils/globalContext";
import { teacherRegistrationSchema } from "@/../utils/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";

const StudentRegisterForm = () => {
  const [eye1, setEye1] = useState(false);
  const [eye2, setEye2] = useState(false);
  const { toast } = useToast();
  const { loading, setLoading } = useGlobalContext();
  const [buttonLoading, setButtonLoading] = useState(false);
  const user = useAuthUser();
  const navigate = useNavigate();

  if (user) navigate("/u");

  const handleToggleEye1 = useCallback(() => {
    setEye1((prev) => !prev);
  }, []);

  const handleToggleEye2 = useCallback(() => {
    setEye2((prev) => !prev);
  }, []);

  const form = useForm<z.infer<typeof teacherRegistrationSchema>>({
    resolver: zodResolver(teacherRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, control } = form;

  const errorShower = async (
    title: string,
    msg: string,
    variant?: "default" | null
  ) => {
    toast({
      variant: variant ? variant : "destructive",
      title,
      description: msg,
    });

    setButtonLoading(false);
  };

  const handleSubmitData = async (
    body: z.infer<typeof teacherRegistrationSchema>,
    e: BaseSyntheticEvent | undefined
  ) => {
    setButtonLoading(true);
    e?.preventDefault();
    const d = JSON.stringify(body);

    try {
      const res = await axios.post(`http://localhost:3000/api/t/register`, d, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res || res === undefined || res.status == 403) {
        errorShower("Login error", "No response received from server!");
        return;
      }

      if (res?.status === 200) {
        errorShower("Success", "Account created successfully!", "default");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        errorShower(
          "Error!",
          res.data.err ? res.data.err : ("Error" as string)
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      errorShower("Error!", e.response.data.err as string);
    }

    setButtonLoading(false);
  };

  return !loading ? (
    <Card className="bg-muted-foreground">
      <CardHeader className="pb-1">
        <CardTitle>Faculty Register</CardTitle>
        <CardDescription className="text-background !mb-4">
          Enter your details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(handleSubmitData)}
            className="flex flex-col gap-1"
          >
            <FormField
              control={control}
              name={"name"}
              render={({ field }) => (
                <FormItem>
                  {/* Render allows for an error message to be shown everytime there's an error on this particular input field */}
                  <FormLabel className="text-white">Full Name</FormLabel>
                  {/* Form Control allows to share the context to display errors */}
                  <FormControl>
                    <Input placeholder="Full Name" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={"email"}
              render={({ field }) => (
                <FormItem>
                  {/* Render allows for an error message to be shown everytime there's an error on this particular input field */}
                  <FormLabel className="text-white">Email</FormLabel>
                  {/* Form Control allows to share the context to display errors */}
                  <FormControl>
                    <Input placeholder="Email" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={"joiningDate"}
              render={({ field }) => (
                <FormItem>
                  {/* Render allows for an error message to be shown everytime there's an error on this particular input field */}
                  <FormLabel className="text-white">Joining Date</FormLabel>
                  {/* Form Control allows to share the context to display errors */}
                  <FormControl>
                    <Input placeholder="Joining Date" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={"password"}
              render={({ field }) => (
                <FormItem>
                  {/* Render allows for an error message to be shown everytime there's an error on this particular input field */}
                  <FormLabel className="text-white">Password</FormLabel>
                  {/* Form Control allows to share the context to display errors */}
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Password"
                        type={eye1 ? "text" : "password"}
                        {...field}
                      />
                      {eye1 ? (
                        <EyeOff
                          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer hover:scale-90 transition-all duration-150 active:scale-75"
                          onClick={handleToggleEye1}
                        />
                      ) : (
                        <Eye
                          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer hover:scale-90 transition-all duration-150 active:scale-75"
                          onClick={handleToggleEye1}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={"confirmPassword"}
              render={({ field }) => (
                <FormItem>
                  {/* Render allows for an error message to be shown everytime there's an error on this particular input field */}
                  <FormLabel className="text-white">Confirm Password</FormLabel>
                  {/* Form Control allows to share the context to display errors */}
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Confirm Password"
                        type={eye2 ? "text" : "password"}
                        {...field}
                      />
                      {eye2 ? (
                        <EyeOff
                          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer hover:scale-90 transition-all duration-150 active:scale-75"
                          onClick={handleToggleEye2}
                        />
                      ) : (
                        <Eye
                          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer hover:scale-90 transition-all duration-150 active:scale-75"
                          onClick={handleToggleEye2}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Link
              to={"/login"}
              className="text-white text-xs text-right hover:text-black mt-5"
              onClick={() => setLoading(true)}
            >
              Already have an acount? Login now
            </Link>
            <Button
              type="submit"
              className="bg-primary-foreground text-secondary-foreground hover:text-black"
            >
              {buttonLoading ? (
                <div className="h-full w-full flex justify-center items-center py-2">
                  <span className="loading loading-spinner loading-md bg-white"></span>
                </div>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  ) : (
    <div className="h-screen w-full flex justify-center items-center">
      <span className="loading loading-spinner loading-lg bg-white"></span>
    </div>
  );
};

export default StudentRegisterForm;
