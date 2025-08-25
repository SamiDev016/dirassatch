import { Navigate } from "react-router-dom";
import { isLoggedIn, getIsSuperAdmin , getUserData } from "../utils/auth";


export default function ProtectedRoute({ children, role}) {
    const isLoggedIn = isLoggedIn();
    const isSuperAdmin = getIsSuperAdmin();
    const userData = getUserData();
    const userRole = userData?.roles;

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    

    return children;
}