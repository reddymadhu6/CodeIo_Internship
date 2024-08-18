import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import {
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	Table,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { ScoreTableProps } from "types";

const ScoreTable = ({ scores }: { scores: Array<ScoreTableProps> | null }) => {

	return (
		<TabsContent value="scores">
			<Card x-chunk="dashboard-05-chunk-3">
				<CardHeader className="px-7">
					<CardTitle>Scores</CardTitle>
					<CardDescription>Examination scores</CardDescription>
				</CardHeader>
				<CardContent>
					<Table className="text-center">
						<TableHeader>
							<TableRow className="bg-accent">
								<TableHead className="text-center">Course Name</TableHead>
								<TableHead className="hidden sm:table-cell text-center">
									Exam
								</TableHead>
								<TableHead className="hidden sm:table-cell text-center">
									Score
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{scores ? (
								scores?.map((score: ScoreTableProps, ind: number) => (
									<TableRow key={ind}>
										<TableCell>
											<div className="font-medium">
												{score.CourseObj.course.courseCode}
											</div>
											<div className="hidden text-sm text-muted-foreground md:inline">
												{score.CourseObj.course.courseName}
											</div>
										</TableCell>
										<TableCell className="hidden sm:table-cell">
											<Badge className="text-xs" variant="secondary">
												{score.examType}
											</Badge>
										</TableCell>
										<TableCell className="text-xl">{score.score}</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
                  <TableCell colSpan={3} className="text-center">NO SCORES YET!</TableCell>
                </TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</TabsContent>
	);
};

export default ScoreTable;
