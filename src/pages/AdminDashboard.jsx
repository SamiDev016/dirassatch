
import { useEffect , useState} from "react"
import { isLoggedIn, getToken, getUserId, getUserRoles, getUserInfo } from "../utils/auth"
import { useNavigate } from "react-router-dom"
import Header from "../components/dashboard/Header"


const AdminDashboard = () => {

    const navigate = useNavigate();
    
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("/login");
            return;
        }
        const checkRole = async () => {
            const userRoleSuperAdmin = await getUserRoles(getUserId(), "super-admin");
            if (!userRoleSuperAdmin || (Array.isArray(userRoleSuperAdmin) && userRoleSuperAdmin.length === 0) || (typeof userRoleSuperAdmin === 'object' && Object.keys(userRoleSuperAdmin).length === 0)) {
                navigate("/");
            }
        };
        checkRole();
    }, []);
    return(
        <div>
            <Header />
            <div>
                Welcome {getUserInfo().firstName} {getUserInfo().lastName} 
                <br />
                {getUserInfo().isSuperAdmin ? "You are a super admin" : ""}
                <br />
                {getUserInfo().ownedAcademies ? "You are a owner of " + getUserInfo().ownedAcademies+ " academies" : "You are not a owner of any academies"}
            </div>
            <hr />
        </div>
    )
}

export default AdminDashboard
