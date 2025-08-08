import { useNavigate } from "react-router-dom"
import { getToken } from "../../utils/auth"

const Sidebar= () => {
    const navigate = useNavigate();
    return(
        <div className="w-1/5 h-screen border-r">
            <ul className="flex flex-col gap-5 p-5">
                <li className="cursor-pointer hover:text-blue-500" onClick={() => navigate("/adminDashboard")}>Acceil</li>
                <li className="cursor-pointer hover:text-blue-500" onClick={() => navigate("/adminDashboard/academies")}>Academies</li>
                <li className="cursor-pointer hover:text-blue-500">Courses</li>
                <li className="cursor-pointer hover:text-blue-500">Users</li>
            </ul>
        </div>
    )
}

export default Sidebar