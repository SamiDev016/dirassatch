

import Header from "../components/Header"
import Footer from "../components/Footer"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Spinner from "../components/Spinner"
import CourseCard from "../components/CourseCard"
const AcademyDetail = () => {

    const { id } = useParams();
    const [academy, setAcademy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [AcademyCourses, setAcademyCourses] = useState([]);

    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    useEffect(() => {
        const fetchAcademy = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/academy/${id}`);
                if (!response.ok) throw new Error("Failed to fetch academy");
                const data = await response.json();
                setAcademy(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        // /course/academy/{academyId}
        const fetchAcademyCourses = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/course/academy/${id}`);
                if (!response.ok) throw new Error("Failed to fetch academy courses");
                const data = await response.json();
                setAcademyCourses(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAcademy();
        fetchAcademyCourses();
    }, [id]);

    if (loading) return <div><Header /><Spinner /><Footer /></div>;
    if (error) return <div><Header /><p>{error}</p><Footer /></div>;
    if (!academy) return null;
    return(
        <div>
            <Header />
            <h1 className="text-xl font-bold mb-6 text-center p-5">{academy.name}</h1>
            <img className="w-full h-64 object-cover rounded" src={academy.logo} alt={academy.name} />
            <p className="text-center p-5" style={{ fontWeight: "bold" }}>Phone: {academy.phone ? academy.phone : "0782 68 46 01"}</p>
            <p className="text-center p-5" style={{ fontWeight: "bold" }}>Email: {academy.email ? academy.email : "dirassa.tech@gmail.com"}</p>
            <h1 className="text-xl font-bold mb-6 text-center p-5">{academy.name} Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {AcademyCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
            <Footer />
        </div>
    )
}

export default AcademyDetail
