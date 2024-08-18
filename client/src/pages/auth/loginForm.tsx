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
import { userLoginSchema } from "@/../utils/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { z } from "zod";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { UserProps } from "types";
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
import { Separator } from "@/components/ui/separator";

const LoginForm = () => {
	const [eye1, setEye1] = useState(false);
	const { toast } = useToast();
	const { loading, setLoading } = useGlobalContext();
	const [buttonLoading, setButtonLoading] = useState(false);
	const user = useAuthUser();
	const signIn = useSignIn();
	const navigate = useNavigate();

	if (user) navigate("/u");

	const handleToggleEye1 = useCallback(() => {
		setEye1((prev) => !prev);
	}, []);

	const form = useForm<z.infer<typeof userLoginSchema>>({
		resolver: zodResolver(userLoginSchema),
		defaultValues: {
			email: "",
			password: "",
			usn: "",
		},
	});

	const { handleSubmit, control } = form;

	const errorShower = async (title: string, msg: string) => {
		toast({
			variant: "destructive",
			title,
			description: msg,
		});

		setButtonLoading(false);
	};

	const handleSubmitData = async (
		body: z.infer<typeof userLoginSchema>,
		e: BaseSyntheticEvent | undefined
	) => {
		setButtonLoading(true);
		e?.preventDefault();
		const d = JSON.stringify(body);

		console.log("LMAO d: ", d);

		try {
			const res = await axios.post(`/api/login`, d, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			console.log("LOGIN RESPONSE IS: ", res);

			if (!res || res === undefined || res.status == 403) {
				errorShower("Login error", "No response received from server!");
				return;
			}

			if (res?.status === 200) {
				let user: UserProps;
				try {
					user = await axios.get(
						`/api/${res.data.userRole === "student" ? "s" : "t"}/${
							res.data.userId
						}`,
						{
							headers: {
								"Content-Type": "application/json",
								Authorization: res.data.accessToken,
							},
						}
					);

					const { data } = user;
					if (
						signIn({
							auth: {
								token: res.data.accessToken,
								type: "Bearer",
							},
							userState: {
								name: data.name,
								userId:
									res.data.userRole === "student"
										? data.studentId
										: data.teacherId,
								userRole: res.data.userRole,
							},
						})
					) {
						console.log("Setting!");

						localStorage.setItem(
							"accessToken",
							`Bearer ${res.data.accessToken}`
						);
						navigate("/u");
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
				<CardTitle>Login</CardTitle>
				<CardDescription className="text-background !mb-4">
					Enter your details
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<Form {...form}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmit(handleSubmitData, (e) => {
								// e.preventDefault();
								console.log("HI: ", e);
							})();
						}}
						className="flex flex-col gap-1"
					>
						<FormField
							control={control}
							name={"usn"}
							render={({ field }) => (
								<FormItem>
									{/* Render allows for an error message to be shown everytime there's an error on this particular input field */}
									<FormLabel className="text-white">USN</FormLabel>
									{/* Form Control allows to share the context to display errors */}
									<FormControl>
										<Input placeholder="USN" type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex w-full justify-center items-center mt-3 mb-1 h-3">
							<Separator className="my-4 flex-1" />
							<span className="text-white mx-3">OR</span>
							<Separator className="my-2 flex-1" />
						</div>

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

						<Link
							to={"/register"}
							className="text-secondary-content text-xs text-right hover:text-muted/40 mt-5"
							onClick={() => setLoading(true)}
						>
							Haven't registered yet? Register now!
						</Link>
						<Button
							type="submit"
							className="bg-primary-foreground text-secondary-foreground hover:text-black"
						>
							{buttonLoading ? (
								<div className="h-full w-full flex justify-center items-center py-2">
									<span className="loading loading-spinner loading-md bg-white hover:bg-black"></span>
								</div>
							) : (
								"Login"
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

export default LoginForm;
