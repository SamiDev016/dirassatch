import { useState, useEffect } from 'react';
import { getAllAcademies, getAllTeachers, getAllStudents } from '../../../utils/auth';
import StatCard from '../../../components/dashboard/StatCard';
import { School, DollarSign, Users, GraduationCap, BookOpen } from 'lucide-react';

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState({
        academies: 0,
        revenue: 0,
        totalStudents: 0,
        totalTeachers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const totalTeachers = await getAllTeachers();
                const academies = await getAllAcademies();
                const totalStudents = await getAllStudents();
                setStats({
                    academies: academies?.length || 0,
                    revenue: 125000,
                    totalStudents: totalStudents,
                    totalTeachers: totalTeachers
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <h1 className="text-3xl font-bold text-gray-800">Super Admin Dashboard</h1>
            
            {loading ? (
                <div className="text-center py-10">Loading statistics...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard 
                            title="Total Academies" 
                            value={stats.academies} 
                            icon={School}
                            bgColor="bg-blue-50" 
                            iconColor="text-blue-500" 
                        />
                        <StatCard 
                            title="Total Students" 
                            value={stats.totalStudents.toString()} 
                            icon={Users}
                            bgColor="bg-purple-50" 
                            iconColor="text-purple-500" 
                        />
                        <StatCard 
                            title="Total Teachers" 
                            value={stats.totalTeachers} 
                            icon={GraduationCap}
                            bgColor="bg-amber-50" 
                            iconColor="text-amber-500" 
                        />
                    </div>

                    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold mb-6 text-gray-700">Platform Overview</h2>
                        <p className="text-gray-600 mb-4">
                            Welcome to the Super Admin Dashboard. From here, you can manage all academies and monitor overall platform performance.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="p-4 border border-gray-200 rounded-xl bg-slate-50">
                                <h3 className="font-medium text-gray-800 mb-2">Quick Actions</h3>
                                <ul className="space-y-2">
                                    <a href="/dashboard/super-admin/academies"><li className="text-blue-600 hover:underline cursor-pointer" >Create New Academy</li></a>
                                    <li className="text-blue-600 hover:underline cursor-pointer">Manage System Settings</li>
                                </ul>
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl bg-slate-50">
                                <h3 className="font-medium text-gray-800 mb-2">Recent Activity</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>New academy "Tech Masters" was created</li>
                                    <li>Revenue increased by 8% this month</li>
                                    <li>15 new teachers joined the platform</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}