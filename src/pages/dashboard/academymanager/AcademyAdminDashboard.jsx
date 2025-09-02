

import { useState, useEffect } from 'react';
import { getUserData, getCoursesByAcademy, getGroupsByAcademy } from '../../../utils/auth';
import { BookOpen, Users, Layers, Settings, GraduationCap, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

export default function AcademyAdminDashboard() {
    const [academyId, setAcademyId] = useState(null);
    const [academy, setAcademy] = useState(null);
    const [stats, setStats] = useState({
        courses: 0,
        groups: 0,
        students: 0,
        modules: 0
    });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("selectedAcademyId");
        if (stored) setAcademyId(stored);

        const loadUser = async () => {
            const userData = await getUserData();
            setUser(userData);
        };
        loadUser();
    }, []);

    useEffect(() => {
        if (!academyId) return;
        fetchData();
    }, [academyId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch courses
            const courses = await getCoursesByAcademy({ academyId });
            
            // Fetch groups
            const groups = await getGroupsByAcademy({ academyId });
            
            // Set stats with real data and some placeholder data
            setStats({
                courses: courses?.length || 0,
                groups: groups?.length || 0,
                students: 120, // Placeholder
                modules: 15 // Placeholder
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Academy Dashboard</span>
                    </h1>
                    <p className="text-gray-600">Manage your academy's courses, groups, and settings</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 shadow-sm transition flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Schedule</span>
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-medium hover:from-blue-700 hover:to-indigo-700 shadow-md transition flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                    </button>
                </div>
            </div>
            
            {loading ? (
                <div className="text-center py-10">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading dashboard...</p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            title="Total Courses" 
                            value={stats.courses} 
                            icon={BookOpen} 
                            trend="up" 
                            trendValue="12" 
                            bgColor="bg-blue-50" 
                            iconColor="text-blue-500" 
                        />
                        <StatCard 
                            title="Active Groups" 
                            value={stats.groups} 
                            icon={Users} 
                            trend="up" 
                            trendValue="8" 
                            bgColor="bg-green-50" 
                            iconColor="text-green-500" 
                        />
                        <StatCard 
                            title="Total Students" 
                            value={stats.students} 
                            icon={GraduationCap} 
                            trend="up" 
                            trendValue="15" 
                            bgColor="bg-purple-50" 
                            iconColor="text-purple-500" 
                        />
                        <StatCard 
                            title="Learning Modules" 
                            value={stats.modules} 
                            icon={Layers} 
                            trend="up" 
                            trendValue="5" 
                            bgColor="bg-amber-50" 
                            iconColor="text-amber-500" 
                        />
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Activity */}
                        <div className="lg:col-span-2 bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-700">Recent Activity</h2>
                                <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
                            </div>
                            <div className="space-y-4">
                                <ActivityItem 
                                    icon={<BookOpen className="w-4 h-4 text-blue-500" />}
                                    title="New course created"
                                    description="Web Development Fundamentals"
                                    time="2 hours ago"
                                    bgColor="bg-blue-50"
                                />
                                <ActivityItem 
                                    icon={<Users className="w-4 h-4 text-green-500" />}
                                    title="New group added"
                                    description="Frontend Development Team"
                                    time="Yesterday"
                                    bgColor="bg-green-50"
                                />
                                <ActivityItem 
                                    icon={<GraduationCap className="w-4 h-4 text-purple-500" />}
                                    title="5 new students enrolled"
                                    description="In JavaScript Mastery course"
                                    time="2 days ago"
                                    bgColor="bg-purple-50"
                                />
                                <ActivityItem 
                                    icon={<TrendingUp className="w-4 h-4 text-amber-500" />}
                                    title="Course completion rate increased"
                                    description="From 68% to 75%"
                                    time="1 week ago"
                                    bgColor="bg-amber-50"
                                />
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
                            <h2 className="text-xl font-semibold mb-6 text-gray-700">Quick Actions</h2>
                            <div className="space-y-3">
                                <QuickAction 
                                    icon={<BookOpen className="w-5 h-5" />}
                                    title="Create New Course"
                                    bgColor="bg-blue-500"
                                    link={`/dashboard/academy/${academyId}/admin/courses`}
                                />
                                <QuickAction 
                                    icon={<Users className="w-5 h-5" />}
                                    title="Manage Groups"
                                    bgColor="bg-green-500"
                                    link={`/dashboard/academy/${academyId}/admin/groups`}
                                />
                                <QuickAction 
                                    icon={<Layers className="w-5 h-5" />}
                                    title="Organize Modules"
                                    bgColor="bg-purple-500"
                                    link={`/dashboard/academy/${academyId}/admin/modules`}
                                />
                                <QuickAction 
                                    icon={<Settings className="w-5 h-5" />}
                                    title="Academy Settings"
                                    bgColor="bg-gray-500"
                                    link={`/dashboard/academy/${academyId}/admin/settings`}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, trend, trendValue, bgColor = 'bg-blue-50', iconColor = 'text-blue-500' }) {
    const isTrendUp = trend === 'up';
    
    return (
        <div className={`p-6 rounded-2xl shadow-sm ${bgColor} border border-gray-100 transition-all duration-300 hover:shadow-md`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${iconColor} bg-white/80 shadow-sm`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            
            {trendValue && (
                <div className="flex items-center">
                    {isTrendUp ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs font-medium ${isTrendUp ? 'text-green-500' : 'text-red-500'}`}>
                        {trendValue}% {isTrendUp ? 'increase' : 'decrease'}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">from last month</span>
                </div>
            )}
        </div>
    );
}

// Activity Item Component
function ActivityItem({ icon, title, description, time, bgColor = 'bg-blue-50' }) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className={`p-2 rounded-full ${bgColor}`}>
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800">{title}</h4>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <span className="text-xs text-gray-400">{time}</span>
        </div>
    );
}

// Quick Action Component
function QuickAction({ icon, title, bgColor = 'bg-blue-500', link = '#' }) {
    return (
        <a 
            href={link}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
        >
            <div className={`p-3 rounded-xl ${bgColor} text-white shadow-sm group-hover:shadow-md transition-all`}>
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{title}</h4>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
            </svg>
        </a>
    );
}