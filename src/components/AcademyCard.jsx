import { useNavigate } from "react-router-dom"
import { MapPin, Users, BookOpen, ExternalLink } from "lucide-react"

const AcademyCard = ({ academy }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src={academy.logo || "https://via.placeholder.com/300x200?text=Academy"}
          alt={academy.name}
        />
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg font-medium text-sm">
          {academy.type || "Academy"}
        </div>
      </div>
      
      <div className="p-5">
        <h2 className="font-bold text-xl text-gray-800">{academy.name}</h2>
        <p className="text-gray-600 mt-2 flex items-center">
          <MapPin size={16} className="mr-1 text-gray-400" />
          {academy.location || "Location not specified"}
        </p>
        
        <div className="flex justify-between mt-4">
          <div className="flex items-center text-gray-600">
            <Users size={16} className="mr-1 text-blue-500" />
            <span>{academy.studentCount || "0"} Students</span>
          </div>
          <div className="flex items-center text-gray-600">
            <BookOpen size={16} className="mr-1 text-blue-500" />
            <span>{academy.courseCount || "0"} Courses</span>
          </div>
        </div>
      </div>
      
      <div className="px-5 pb-5 pt-2">
        <button 
          onClick={() => navigate(`/academy/${academy.id}`)} 
          className="w-full py-2 rounded-md bg-blue-500 text-white font-medium flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
        >
          View Details
          <ExternalLink size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default AcademyCard
