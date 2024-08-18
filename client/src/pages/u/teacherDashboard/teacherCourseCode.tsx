import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useNavigate, useParams } from "react-router-dom";
import { AuthOptions } from "types";
import { useState, useEffect } from "react";
import axios from "axios";

interface dataa {
	classId: string;
	section: string;
	semester: string;
}

const ClassTaught = ({
	item,
	courseCode,
}: {
	item: dataa;
	courseCode: string;
}) => {
	const navigate = useNavigate();
	const user: AuthOptions | null = useAuthUser();

	if (user?.userRole !== "teacher") navigate("/u");

	return (
		<div
			className="mb-4 py-5 px-10 bg-slate-600 rounded-lg hover:scale-95 active:scale-90 transition-all duration-200 cursor-pointer flex flex-col justify-center items-center"
			onClick={() => navigate(`/u/${courseCode}/score-update/${item.classId}`)}
		>
			<span>{item.section}</span>
			<span>{item.semester}</span>
		</div>
	);
};

const TeacherCourseCode = () => {
	const cc = useParams();
	const courseCode: string = cc.courseCode as string;
	const [data, setData] = useState<Array<dataa> | null>(null);

	useEffect(() => {
		const fun = async () => {
			const response = await axios.get(`/api/c`, {
				headers: {
					Authorization: localStorage.getItem("accessToken"),
				},
			});
			setData(response.data);
		};
		fun();
	}, []);

	return (
		<div className="flex flex-wrap py-10 px-14 md:px-40 gap-10 justify-center items-center">
			{data &&
				data?.map((item: dataa, index: number) => (
					<ClassTaught item={item} courseCode={courseCode} key={index} />
				))}
			{/* <ClassTaught />
			<ClassTaught />
			<ClassTaught />
			<ClassTaught />
			<ClassTaught />
			<ClassTaught />
			<ClassTaught /> */}
		</div>
	);
};

export default TeacherCourseCode;
