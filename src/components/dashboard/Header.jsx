import { useNavigate } from "react-router-dom"
import { logout, isLoggedIn } from "../../utils/auth"
import { useState } from "react"

const Header = () => {
    const navigate = useNavigate();
    
    const [loggingOut, setLoggingOut] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const handleLogout = async () => {
        setLoggingOut(true);
        setTimeout(() => {
            logout();
            setLoggingOut(false);
            navigate("/login");
        }, 1000); 
        };

    return(
        <div className=" w-full h-16">
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center cursor-pointer" onClick={() => navigate("/")}>
                    <img className="w-16 h-16" src="https://png.pngtree.com/png-clipart/20230928/original/pngtree-education-school-logo-design-student-literature-academy-vector-png-image_12898118.png" alt="" />
                    <h1 className="font-bold text-2xl hover:text-blue-500 transition">Dirassa Tech</h1>
                </div>
                <span className="font-bold text-lg hover:text-blue-500 transition">Admin Dashboard</span>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handleLogout}>
                    {loggingOut ? "Logging out..." : "Logout"}
                </button>
            </div>
            <hr className="w-full h-1" />
        </div>
    )
}

export default Header