import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter } from "lucide-react";
import ScoreTable from "./scoreTable";
import EligibilityTable from "./eligibilityTable";
import { useEffect, useState } from "react";
import { AuthOptions, ScoreProps, ScoreTableProps } from "types";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [mainScores, setMainScores] = useState<Array<ScoreProps> | null>(null);
  const [allScores, setAllScores] = useState<Array<ScoreTableProps> | null>(null);
  const [scores, setScores] = useState<Array<ScoreTableProps> | null>(null);
  const [filter, setFilter] = useState<number>(0);

  const user: AuthOptions | null = useAuthUser();

  console.log("USERRRR: ", user);
  
  const navigate = useNavigate();
  if(!user) navigate("/");

  useEffect(() => {
    const res = async () => {
      if(!user) return;

      const response: {data: Array<ScoreProps>} = await axios.get(`/api/s/scores/${user.userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      });

      const temp: Array<ScoreTableProps> = new Array(0);
      setMainScores(() => response.data);
      
      mainScores?.forEach((item: ScoreProps) => {
        temp.push({CourseObj: item.CourseObj, examType: "cie_1", score: item.cie_1});
        temp.push({CourseObj: item.CourseObj, examType: "cie_2", score: item.cie_2});
        temp.push({CourseObj: item.CourseObj, examType: "cie_3", score: item.cie_3});
        temp.push({CourseObj: item.CourseObj, examType: "quiz_1", score: item.quiz_1});
        temp.push({CourseObj: item.CourseObj, examType: "quiz_2", score: item.quiz_2});
        temp.push({CourseObj: item.CourseObj, examType: "aat", score: item.aat});
        temp.push({CourseObj: item.CourseObj, examType: "lab", score: item.lab});
        temp.push({CourseObj: item.CourseObj, examType: "score", score: item.score});
      });

      console.log("TEMP: ", temp);
      
      setAllScores(temp);
      setScores(temp);
    };
    res();
  }, [mainScores, user]);

  useEffect(() => {
    let temp: Array<ScoreTableProps> = new Array(0);

    if(filter === 0) temp = allScores as Array<ScoreTableProps>;
    else if(filter === 1) temp = allScores?.filter((item) => item.examType === "cie_1") as Array<ScoreTableProps>;
    else if(filter === 2) temp = allScores?.filter((item) => item.examType === "cie_2") as Array<ScoreTableProps>;
    else if(filter === 3) temp = allScores?.filter((item) => item.examType === "cie_3") as Array<ScoreTableProps>;
    else if(filter === 4) temp = allScores?.filter((item) => item.examType === "quiz_1") as Array<ScoreTableProps>;
    else if(filter === 5) temp = allScores?.filter((item) => item.examType === "quiz_2") as Array<ScoreTableProps>;
    else if(filter === 6) temp = allScores?.filter((item) => item.examType === "aat") as Array<ScoreTableProps>;
    else if(filter === 7) temp = allScores?.filter((item) => item.examType === "lab") as Array<ScoreTableProps>;
    else temp = allScores?.filter((item) => item.examType === "score") as Array<ScoreTableProps>;

    setScores(() => temp);
  }, [allScores, filter]);
  
  return (
    <Tabs defaultValue="scores" className="w-2/3">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="scores">Scores</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild >  
              <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={filter === 0} onClick={() => setFilter(() => 0)}>
                ALL
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filter === 1} onClick={() => setFilter(() => 1)}>CIE 1</DropdownMenuCheckboxItem> 
              <DropdownMenuCheckboxItem checked={filter === 2} onClick={() => setFilter(() => 2)}>CIE 2</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filter === 3} onClick={() => setFilter(() => 3)}>CIE 3</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filter === 4} onClick={() => setFilter(() => 4)}>Quiz 1</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filter === 5} onClick={() => setFilter(() => 5)}>Quiz 2</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filter === 6} onClick={() => setFilter(() => 6)}>AAT</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filter === 7} onClick={() => setFilter(() => 7)}>Lab</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filter === 8} onClick={() => setFilter(() => 8)}>Total</DropdownMenuCheckboxItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <ScoreTable scores={scores}/>
      <EligibilityTable scores={mainScores}/>
      
    </Tabs>
  );
};

export default StudentDashboard;
