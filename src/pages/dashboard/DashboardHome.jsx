import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { resolveDashboardRoute } from "../../utils/auth";


export default function DashboardHome() {
    const [redirectTo, setRedirectTo] = useState(null);

    useEffect(() => {
        const resolve = async () => {
            const route = await resolveDashboardRoute();
            setRedirectTo(route);
        };
        resolve();
    }, []);

    if (!redirectTo) {
        return <div className="p-6">Loading your dashboard...</div>;
    }
    return <Navigate to={redirectTo} replace />;

}
