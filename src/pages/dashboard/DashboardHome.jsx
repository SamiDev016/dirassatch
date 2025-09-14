import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { resolveDashboardRoute, getUserRoles } from "../../utils/auth";
import { GraduationCap, ArrowRight, Users, Shield } from "lucide-react";

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

            // One academy & one role → auto redirect
            if (academies.length === 1 && academies[0].roles.length === 1) {
                const route = await resolveDashboardRoute(academies[0].academyId,academies[0].roles[0]);
                localStorage.setItem("selectedAcademyId", academies[0].academyId);
                localStorage.setItem("selectedRole",academies[0].roles[0]);
                setRedirectTo(route);
                setLoading(false);
                return;
            }

            // Otherwise → let user choose
            if (academies.length > 0) {
                setAcademies(academies);
                setLoading(false);
                return;
            }

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

    if (academies.length > 0) {
        return (
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to EduDash</h1>
                    <p className="text-slate-600">Choose an academy and role to access your dashboard.</p>
                </div>

                {/* Academy Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {academies.map((academy) => (
                        <div
                            key={academy.academyId}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 group"
                        >
                            {/* Academy Icon */}
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>

                            {/* Academy Info */}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    {academy.academyName}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-slate-600">Active</span>
                                </div>
                            </div>

                            {/* Role Selection Buttons */}
                            <div className="space-y-2">
                                {academy.roles.map((role) => (
                                    <button
                                        key={role}
                                        
                                        onClick={async () => {
                                            localStorage.setItem("selectedAcademyId", academy.academyId);
                                            localStorage.setItem("selectedRole", role);
                                            const route = await resolveDashboardRoute(academy.academyId, role);
                                            setRedirectTo(route);
                                        }}
                                        className="w-full flex items-center justify-between px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                                    >
                                        <span className="capitalize font-medium">{role}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                ))}
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
                        If you can't find the academy or role you're looking for, please contact your administrator.
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
