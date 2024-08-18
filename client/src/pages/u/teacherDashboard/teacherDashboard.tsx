import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { CourseUndertaken } from "types";

const CourseCode = ({ code, name }: { code: string; name: string }) => {
	const navigate = useNavigate();

	return (
		<div
			className="mb-4 py-5 px-10 bg-slate-600 rounded-lg hover:scale-95 active:scale-90 transition-all duration-200 cursor-pointer flex flex-col justify-center items-center"
			onClick={() => navigate(`/u/${code}`)}
		>
			<span>{code}</span>
			<span>{name}</span>
		</div>
	);
};

const TeacherDashboard = () => {
	const [data, setData] = useState<Array<CourseUndertaken> | null>(null);

	useEffect(() => {
		const fun = async () => {
			const response = await axios.get(`/api/courses`, {
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
				data.map((item: CourseUndertaken, index: number) => {
					return (
						<CourseCode
							code={item.course.courseCode}
							name={item.course.courseName}
							key={index}
						></CourseCode>
					);
				})}
			{/* <CourseCode />
			<CourseCode />
			<CourseCode />
			<CourseCode />
			<CourseCode /> 
			<CourseCode />
			<CourseCode /> */}
		</div>
	);
};

export default TeacherDashboard;
