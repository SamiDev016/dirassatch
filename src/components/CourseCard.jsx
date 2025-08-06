

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getToken, getUserId, isLoggedIn } from "../utils/auth"
import Spinner from "./Spinner"


const CourseCard = ({course,isFromHome}) => {
    const navigate = useNavigate();
    
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";

    const [requestEnrollment, setRequestEnrollment] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleRequestEnrollment = (value) => async () => {
        ///enrollment-request/create
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/enrollment-request/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    courseId: course.id,
                    userId: getUserId()
                })
            });
            if (!response.ok) throw new Error("Failed to create enrollment request");
            const data = await response.json();
            console.log(data);
            setRequestEnrollment(value);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div id="course-card" className="flex flex-col bg-white shadow rounded p-4 hover:shadow-lg transition">
            <img className="w-full h-96 object-cover rounded" src={course.coverPhoto} alt={course.name} />
            <h1 className="font-bold text-lg mt-3">{course.name}</h1>
            <hr className="my-3" style={{borderColor: "#ccc"}}/>
            <button
                hidden={isFromHome}
                onClick={() => {
                    if (isLoggedIn()) {
                        handleRequestEnrollment(true)();
                    } else {
                        navigate("/login");
                    }
                }}
                className="p-2 rounded mt-3 cursor-pointer transition"
                >
                Request Enrollment
            </button>
            <button hidden={!isFromHome} onClick={() => navigate(`/course/${course.id}`)} className="p-2 rounded mt-3 cursor-pointer transition hover:bg-blue-600 hover:text-white">View Details</button>
            {error && <p className="text-red-500 mt-3">{error}</p>}
            {loading && <Spinner />}
        </div>
    )
}

export default CourseCard;