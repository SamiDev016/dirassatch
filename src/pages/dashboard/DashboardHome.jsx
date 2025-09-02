import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { resolveDashboardRoute, getUserRoles } from "../../utils/auth";
import { GraduationCap, ArrowRight, Users, Shield } from "lucide-react";

export default function DashboardHome() {
    const [redirectTo, setRedirectTo] = useState(null);
    const [academies, setAcademies] = useState([]);
    const [loading, setLoading] = useState(true);


    const userRoles = getUserRoles();
    console.log("user",userRoles.user);
    console.log("academies",userRoles.academies);


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
                console.log("academies",academies[0].academyId);
                
                localStorage.setItem("selectedAcademyId", academies[0].academyId);
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
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    if (academies.length > 1) {
        return (
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to EduDash</h1>
                    <p className="text-slate-600">Choose an academy to access your dashboard and manage your courses.</p>
                </div>

                {/* Academy Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {academies.map((academy) => (
                        <div
                            key={academy.academyId}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer"
                            onClick={async () => {
                                localStorage.setItem("selectedAcademyId", academy.academyId);
                                const route = await resolveDashboardRoute(academy.academyId);
                                setRedirectTo(route);
                            }}
                        >
                            {/* Academy Icon */}
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>

                            {/* Academy Info */}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {academy.academyName}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-slate-600">Active</span>
                                </div>
                                {academy.roles && (
                                    <div className="flex items-center gap-2">
                                        {academy.roles.includes("owner") || academy.roles.includes("manager") ? (
                                            <Shield className="w-4 h-4 text-amber-500" />
                                        ) : (
                                            <Users className="w-4 h-4 text-blue-500" />
                                        )}
                                        <span className="text-sm text-slate-500 capitalize">
                                            {academy.roles.join(", ")}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Action Button */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                                    Access Dashboard
                                </span>
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Help Section */}
                <div className="mt-12 bg-slate-50 rounded-2xl p-8 text-center">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Need Help?</h3>
                    <p className="text-slate-600 mb-4">
                        If you can't find the academy you're looking for or need access to additional academies, 
                        please contact your administrator.
                    </p>
                    <button className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium">
                        Contact Support
                    </button>
                </div>
            </div>
        );
    }

    return null;
}