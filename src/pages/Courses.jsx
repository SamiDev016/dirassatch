import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState, useEffect } from "react"
import Spinner from "../components/Spinner"
import CourseCard from "../components/CourseCard"
import { isLoggedIn } from "../utils/auth"
import { useNavigate } from "react-router-dom"



const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [search, setSearch] = useState("");
    
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

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <Header />
            <div className="flex flex-col justify-center items-center">
              <div className="p-5 w-full">
                <div className="flex flex-row mt-5">
                  <img className="w-full h-96 object-cover" src="https://img.freepik.com/free-photo/medium-shot-students-studying-together_23-2148950552.jpg?semt=ais_hybrid&w=740" alt="" />
                  <div className="flex flex-col w-1/2 items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-blue-100 border-t border-blue-200 shadow-inner">
                    <h1 className="text-xl font-bold mb-6 text-center p-5">Dirassa Tech</h1>
                    <p className="text-gray-700">You have Access to All Courses.</p>
                    <button className="cursor-pointer rounded-lg p-2 transition flex items-center justify-center font-bold text-xl border border-gray-300 hover:bg-gray-300 ">Join Us</button>
                  </div>
                </div>
              </div>
              <h1 className="text-xl font-bold mb-2 text-center p-5">Our Courses</h1>
              <div className="flex items-center gap-2 w-1/2">
                  <input
                      type="text"
                      placeholder="Search Courses"
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                  />
                  <button
                      type="button"
                      disabled
                      className="cursor-pointer rounded p-2 transition flex items-center justify-center hover:bg-gray-100"
                      tabIndex={-1}
                  >
                      <img src="../public/search.svg" alt="search" className="w-5 h-5" />
                  </button>
              </div>
              <div className="w-full">
              {errorMessage && <p className="text-red-500 mb-6">{errorMessage.toString()}</p>}
              {isLoading ? (
                  <Spinner />
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                  {filteredCourses.map(course => (
                      <CourseCard key={course.id} isLogedIn={isLoggedIn()} course={course} />
                  ))}
              </div>
              )}
              </div>
            </div>
            <Footer />
        </div>
    )
}

export default Courses
