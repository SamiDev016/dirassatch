
import { useEffect , useState} from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/dashboard/Header"
import Footer from "../../components/dashboard/Footer"
import Sidebar from "../../components/dashboard/Sidebar"
import { getToken } from "../../utils/auth"

const AdminDashboard = () => {

    const navigate = useNavigate();
    
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate("/login");
            return;
        }
    }, []);


    return(
        <div id="admin-dashboard">
            <Header />
            <div className="flex flex-row">
                <Sidebar />
                <main className="w-4/5 h-screen">
                    <h1>Main Section</h1>
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default AdminDashboard
