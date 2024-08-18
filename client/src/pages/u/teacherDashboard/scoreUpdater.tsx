import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	Table,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuCheckboxItem,
} from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { ListFilter, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useNavigate, useParams } from "react-router-dom";
import { AuthOptions, ScoreProps } from "types";

const ScoreUpdater = () => {
	const { courseCode, classId } = useParams();
	const [mainScores, setMainScores] = useState<Array<ScoreProps> | null>(null);
	const [scores, setScores] = useState<Array<ScoreProps> | null>(null);
	const [filter, setFilter] = useState<number>(0);
	const [loading, setLoading] = useState(false);

	const user: AuthOptions | null = useAuthUser();
	const { toast } = useToast();

	const navigate = useNavigate();
	if (!user) navigate("/");

	useEffect(() => {
		setLoading(true);
		const res = async () => {
			if (!user) return;

			try {
				const response = await axios.get(
					`/api/t/scores?courseCode=${courseCode}&classId=${classId}`,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: localStorage.getItem("accessToken"),
						},
					}
				);

				if (response.status === 200) {
					setMainScores(() => response.data);
					setScores(() => response.data);
				} else {
					toast({
						title: "Error",
						description: "You are not authorized to view this class!",
					});
					setTimeout(() => navigate("/u"), 3000);
				}

				setLoading(false);
			} catch (e) {
				setLoading(false);
				toast({
					title: "Error",
					description: "Something went wrong! Please try again later.",
				});
			}
		};
		res();
	}, [classId, courseCode, navigate, toast, user]);

	const eligibility = (num: number): boolean => {
		return num >= 20;
	};

	useEffect(() => {
		let temp: Array<ScoreProps> = new Array(0);

		if (filter === 0) temp = mainScores as Array<ScoreProps>;
		else if (filter === 1)
			temp = mainScores?.filter((item) =>
				eligibility(item.total)
			) as Array<ScoreProps>;
		else
			temp = mainScores?.filter(
				(item) => !eligibility(item.total)
			) as Array<ScoreProps>;

		setScores(() => temp);
	}, [mainScores, filter]);

	return (
		<>
			<div className="flex justify-between items-center gap-2 mb-2">
				<form action="/api/t/uploadMarks" className="min-w-10 flex items-center gap-5" encType="multipart/form-data">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
								<Upload className="h-3.5 w-3.5" />
								<span className="sr-only sm:/==[..............=================================================]] 1/not-sr-only">Upload Marks</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="bg-slate-500 px-5 py-2 text-black rounded-xl"
						>
							<DropdownMenuSeparator />
							<DropdownMenuCheckboxItem
								className="cursor-pointer"
							>
								<Input type="file" name="file" className="bg-slate-600" />
							</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>

          <Button type="submit">Submit</Button>
				</form>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
							<ListFilter className="h-3.5 w-3.5" />
							<span className="sr-only sm:not-sr-only">Filter</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Filter by</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem
							checked={filter === 0}
							onClick={() => setFilter(() => 0)}
						>
							ALL
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={filter === 1}
							onClick={() => setFilter(() => 1)}
						>
							Eligible
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={filter === 2}
							onClick={() => setFilter(() => 2)}
						>
							Not Eligible
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<Card x-chunk="dashboard-05-chunk-3">
				<CardHeader className="px-7">
					<CardTitle>Scores</CardTitle>
					<CardDescription>
						{scores && scores.length
							? `${scores[0].CourseObj.course.courseName} (${scores[0].CourseObj.course.courseCode})`
							: "NO COURSE FOUND"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table className="text-center">
						<TableHeader>
							<TableRow className="bg-accent">
								<TableHead className="text-center">Student Name</TableHead>
								<TableHead className="hidden sm:table-cell text-center">
									CIE 1
								</TableHead>
								<TableHead className="hidden sm:table-cell text-center">
									CIE 2
								</TableHead>
								<TableHead className="hidden sm:table-cell text-center">
									CIE 3
								</TableHead>
								<TableHead className="hidden sm:table-cell text-center">
									Quiz 1
								</TableHead>
								<TableHead className="hidden sm:table-cell text-center">
									Quiz 2
								</TableHead>
								<TableHead className="hidden sm:table-cell text-center">
									AAT
								</TableHead>
								<TableHead className="hidden sm:table-cell text-center">
									Lab
								</TableHead>
								<TableHead className="hidden sm:table-cell text-center">
									Score
								</TableHead>
								<TableHead className="text-center">Eligibility</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={10} className="text-center">
										<span className="loading loading-spinner loading-lg bg-white"></span>
									</TableCell>
								</TableRow>
							) : scores ? (
								scores.map((score: ScoreProps, ind: number) => (
									<TableRow key={ind}>
										<TableCell>{score.Student.name}</TableCell>
										<TableCell>{score.cie_1}</TableCell>
										<TableCell>{score.cie_2}</TableCell>
										<TableCell>{score.cie_3}</TableCell>
										<TableCell>{score.quiz_1}</TableCell>
										<TableCell>{score.quiz_2}</TableCell>
										<TableCell>{score.aat}</TableCell>
										<TableCell>{score.lab}</TableCell>
										<TableCell>{score.total}</TableCell>
										<TableCell>
											<Badge
												className="text-xs"
												variant={
													eligibility(score.total) ? "default" : "destructive"
												}
											>
												{eligibility(score.total) ? "Eligible" : "Not Eligible"}
											</Badge>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={10} className="text-center">
										NO SCORES YET!
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</>
	);
};

export default ScoreUpdater;
