

import { useNavigate } from "react-router-dom"
import { BookOpen, ExternalLink } from "lucide-react"

const CourseCard = ({course}) => {
    const navigate = useNavigate();

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
                
            </div>
            
            <div className="px-5 pb-5 pt-2">
                <button 
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="w-full py-2 rounded-md bg-blue-500 text-white font-medium flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                >
                    View Details
                    <ExternalLink size={16} className="ml-1" />
                </button>
            </div>
        </div>
    )
}

export default CourseCard;