import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/course/${id}`);
                if (!response.ok) throw new Error("Failed to fetch course");
                const data = await response.json();
                setCourse(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) return <div><Header /><Spinner /><Footer /></div>;
    if (error) return <div><Header /><p>{error}</p><Footer /></div>;
    if (!course) return null;

    return (
        <div>
            <Header />
            <h1 className="text-xl font-bold mb-6 text-center p-5">{course.name}</h1>
            <img className="w-full h-48 object-cover rounded" src={course.coverPhoto} alt={course.name} />
            <Footer />
        </div>
    );
};

export default CourseDetails;
