import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState, useEffect } from "react"
import Spinner from "../components/Spinner"
import CourseCard from "../components/CourseCard"






const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";

    const fetchCourses = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`${API_BASE}/course/all`);
          if(!response.ok){
            throw new Error("Failed to fetch courses.");
          }
          const data = await response.json();
          if(data.Response === "False"){
            setErrorMessage(data.Message);
          }
          setCourses(data.slice(0, 8));
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          setErrorMessage(error.message || "Failed to courses.");
        }
      };

    useEffect(() => {
        fetchCourses();
    }, []);



    return (
        <div>
            <Header />
            <h1 className="text-xl font-bold mb-6 text-center p-5">Courses</h1>
            {errorMessage && <p className="text-red-500 mb-6">{errorMessage.toString()}</p>}
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
            )}
            <Footer />
        </div>
    )
}

export default Courses
