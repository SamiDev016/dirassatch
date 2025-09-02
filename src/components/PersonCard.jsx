

import { Mail, Users, BookOpen, Award, ExternalLink } from "lucide-react"

const PersonCard = ({person}) => {
    return (
        <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
                <img 
                    className="w-full h-48 object-cover" 
                    src={person.photo || "https://via.placeholder.com/300x300?text=Teacher"} 
                    alt={person.name} 
                />
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg font-medium text-sm">
                    {person.role || "Teacher"}
                </div>
            </div>
            
            <div className="p-5">
                <h2 className="font-bold text-xl text-gray-800">{person.name}</h2>
                <p className="text-gray-600 mt-2 flex items-center">
                    <Award size={16} className="mr-1 text-blue-500" />
                    {person.specialty || "Subject Specialist"}
                </p>
                
                <div className="mt-4 space-y-2">
                    {person.email && (
                        <p className="text-gray-600 flex items-center">
                            <Mail size={16} className="mr-2 text-gray-400" />
                            {person.email}
                        </p>
                    )}
                    
                    <div className="flex justify-between">
                        <div className="flex items-center text-gray-600">
                            <Users size={16} className="mr-1 text-blue-500" />
                            <span>{person.studentCount || "0"} Students</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <BookOpen size={16} className="mr-1 text-blue-500" />
                            <span>{person.courseCount || "0"} Courses</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {person.id && (
                <div className="px-5 pb-5 pt-2">
                    <button 
                        onClick={() => window.location.href = `/teacher/${person.id}`} 
                        className="w-full py-2 rounded-md bg-blue-500 text-white font-medium flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                    >
                        View Profile
                        <ExternalLink size={16} className="ml-1" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default PersonCard
