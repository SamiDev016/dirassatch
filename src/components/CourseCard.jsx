

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getToken, getUserId, isLoggedIn } from "../utils/auth"
import Spinner from "./Spinner"
import { Clock, User, BookOpen, ExternalLink, UserPlus } from "lucide-react"

const CourseCard = ({course, isFromHome}) => {
    const navigate = useNavigate();
    
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";

    const [requestEnrollment, setRequestEnrollment] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const handleRequestEnrollment = (value) => async () => {
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
        <div id="course-card" className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
                <img 
                    className="w-full h-48 object-cover" 
                    src={course.coverPhoto || "https://via.placeholder.com/300x200?text=Course"} 
                    alt={course.name} 
                />
                <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg font-medium text-sm">
                    {course.category || "Course"}
                </div>
            </div>
            
            <div className="p-5">
                <h1 className="font-bold text-xl text-gray-800">{course.name}</h1>
                <p className="text-gray-600 mt-2 line-clamp-2">
                    {course.description || "No description available"}
                </p>
                
                <div className="flex justify-between mt-4">
                    <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-1 text-green-500" />
                        <span>{course.duration || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <User size={16} className="mr-1 text-green-500" />
                        <span>{course.instructor || "Instructor"}</span>
                    </div>
                </div>
            </div>
            
            <div className="px-5 pb-5 pt-2">
                {!isFromHome ? (
                    <button
                        onClick={() => {
                            if (isLoggedIn()) {
                                handleRequestEnrollment(true)();
                            } else {
                                navigate("/login");
                            }
                        }}
                        disabled={loading || requestEnrollment}
                        className="w-full py-2 rounded-md bg-green-500 text-white font-medium flex items-center justify-center hover:bg-green-600 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {requestEnrollment ? "Enrollment Requested" : "Request Enrollment"}
                        {!requestEnrollment && <UserPlus size={16} className="ml-1" />}
                    </button>
                ) : (
                    <button 
                        onClick={() => navigate(`/course/${course.id}`)} 
                        className="w-full py-2 rounded-md bg-green-500 text-white font-medium flex items-center justify-center hover:bg-green-600 transition-colors duration-300"
                    >
                        View Details
                        <ExternalLink size={16} className="ml-1" />
                    </button>
                )}
                {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
                {loading && <div className="flex justify-center mt-3"><Spinner /></div>}
            </div>
        </div>
    )
}

export default CourseCard;