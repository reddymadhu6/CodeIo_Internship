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
import { ScoreProps } from "types";

const EligibilityTable = ({ scores }: { scores: Array<ScoreProps> | null }) => {

	return (
		<TabsContent value="eligibility">
			<Card x-chunk="dashboard-05-chunk-3">
				<CardHeader className="px-7">
					<CardTitle>Eligibility</CardTitle>
					<CardDescription>Eligibility Status of all courses</CardDescription>
				</CardHeader>
				<CardContent>
					<Table className="text-center">
						<TableHeader>
							<TableRow className="bg-accent">
								<TableHead className="text-center">Course Name</TableHead>
								<TableHead className="hidden sm:table-cell text-center">
									Score
								</TableHead>
								<TableHead className="hidden sm:table-cell text-center ">
									Eligibility
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{scores ? (
								scores.map((item: ScoreProps, ind: number) => (
									<TableRow key={ind}>
										<TableCell>
											<div className="font-medium">{item.CourseObj.course.courseCode}</div>
											<div className="hidden text-sm text-muted-foreground md:inline">
												{item.CourseObj.course.courseName}
											</div>
										</TableCell>
										<TableCell className="text-xl">{item.total}</TableCell>
										<TableCell className="hidden sm:table-cell">
											<Badge className="text-xs" variant={(item.total >= 20) ? "default" : "destructive"}>
												{(item.total >= 20) ? "Eligible" : "Not Eligible"}
											</Badge>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={3} className="text-center">
										NO SCORES YET!
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</TabsContent>
	);
};

export default EligibilityTable;
