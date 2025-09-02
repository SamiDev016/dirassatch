import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { resolveDashboardRoute, getUserRoles } from "../../utils/auth";

export default function DashboardHome() {
    const [redirectTo, setRedirectTo] = useState(null);
    const [academies, setAcademies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const resolve = async () => {
            const { academies, globalRoles } = await getUserRoles();

            if (globalRoles.includes("superAdmin")) {
                const route = await resolveDashboardRoute();
                setRedirectTo(route);
                setLoading(false);
                return;
            }

            if (academies.length === 1) {
                const route = await resolveDashboardRoute(academies[0].academyId);
                setRedirectTo(route);
                setLoading(false);
                return;
            }

            if (academies.length > 1) {
                setAcademies(academies);
                setLoading(false);
                return;
            }

            // Fallback: no academies
            setRedirectTo("/dashboard");
            setLoading(false);
        };

        resolve();
    }, []);

    if (loading) {
        return <div className="p-6">Loading your dashboard...</div>;
    }

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }
    if (academies.length > 1) {
        return (
            <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Choose an academy to continue:
                </h2>
                <ul className="space-y-2">
                    {academies.map(a => (
                        <li key={a.academyId}>
                            <button
                                onClick={async () => {
                                    localStorage.setItem("selectedAcademyId", a.academyId);
                                    const route = await resolveDashboardRoute(a.academyId);
                                    setRedirectTo(route);
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {a.academyName}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return null;
}
