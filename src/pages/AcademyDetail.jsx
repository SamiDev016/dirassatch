

import Header from "../components/Header"
import Footer from "../components/Footer"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Spinner from "../components/Spinner"
import CourseCard from "../components/CourseCard"
import UserCard from "../components/UserCard"
const AcademyDetail = () => {

    const { id } = useParams();
    const [academy, setAcademy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [AcademyCourses, setAcademyCourses] = useState([]);
    const [AcademyOwners, setAcademyOwners] = useState([]);
    // /academy/{id}/owners
    // {
    //     "id": 1,
    //     "name": "JOMJ",
    //     "logo": "https://storage.googleapis.com/daracademyfireproject.appspot.com/academy_logo/06060aa0-9e3c-4098-987e-aa92b2509378.jpg",
    //     "phone": null,
    //     "email": null,
    //     "owners": [
    //       {
    //         "userId": 3,
    //         "firstName": "faress",
    //         "lastName": "aouf",
    //         "profilePhoto": "https://storage.googleapis.com/daracademyfireproject.appspot.com/super_admin/profile_photo/543d0441-cf5c-49c5-a0dd-18b31fbf6344.jpg",
    //         "isSuperAdmin": true,
    //         "email": "faress@gmail.com"
    //       },
    //       {
    //         "userId": 4,
    //         "firstName": "abdo",
    //         "lastName": "aouf",
    //         "profilePhoto": "https://storage.googleapis.com/daracademyfireproject.appspot.com/profile_photo/c28649ed-1c90-4ea9-bb66-c5009e6e325c.jpg",
    //         "isSuperAdmin": false,
    //         "email": "abdo@gmail.com"
    //       },
    //       {
    //         "userId": 2,
    //         "firstName": "rayan",
    //         "lastName": "aouf",
    //         "profilePhoto": "https://storage.googleapis.com/daracademyfireproject.appspot.com/profile_photo/486854ab-0d2d-4c1e-ae61-95d6c699f0e3.jpg",
    //         "isSuperAdmin": true,
    //         "email": "rayanaouf1512@gmail.com"
    //       }
    //     ]
    //   }

    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    useEffect(() => {
        const fetchAcademyOwners = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/academy/${id}/owners`);
                if (!response.ok) throw new Error("Failed to fetch academy owners");
                const data = await response.json();
                setAcademyOwners(data.owners || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAcademyOwners();
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {AcademyOwners.map(owner => (
                    <UserCard key={owner.userId} user={owner} />
                ))}
            </div>
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
