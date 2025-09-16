import { useEffect, useState } from "react";
import { Outlet, Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Shield, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Layers, 
  Settings,
  ChevronRight,
  User,
  MousePointerBanIcon,
} from "lucide-react";
import { getUserRoles, getUserData, logout } from "../../../utils/auth";
import { useRef } from "react";

export default function DashboardLayout() {
  const [roles, setRoles] = useState({ globalRoles: [], academies: [] });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null); 
  const { academyId } = useParams();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    setTimeout(() => {
        logout();
        setLoggingOut(false);
        navigate("/login");
    }, 1000); 
};

  useEffect(() => {
    const loadRoles = async () => {
      const r = await getUserRoles();
      setRoles(r);
      setLoading(false);
    };
    loadRoles();
    const loadUser = async () => {
      const u = await getUserData();
      setUser(u);
    };
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  const { globalRoles, academies } = roles;
  const isSuperAdmin = globalRoles.includes("superAdmin");

  const currentAcademy = academies.find(
    (a) => String(a.academyId) === String(academyId)
  );
  const selectedRole = localStorage.getItem("selectedRole");
  const isAcademyAdmin =
    currentAcademy &&
    selectedRole &&
    (selectedRole === "manager" || selectedRole === "owner");

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span className="font-medium text-left">{children}</span>
        <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    );
  };

  return (
    <div className="w-full flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-1/5 bg-white shadow-xl border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex flex-row gap-2 items-center">
              <img src="https://png.pngtree.com/png-clipart/20230928/original/pngtree-education-school-logo-design-student-literature-academy-vector-png-image_12898118.png" alt="" className="w-10 h-10" />
              <h2 className="text-xl font-bold text-slate-900">DirassaTech</h2>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {/* Common Navigation */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Overview
            </h3>
            <div className="space-y-1">
              <NavLink to="/dashboard" icon={Home}>
                Dashboard Home
              </NavLink>
            </div>
          </div>

          {/* Super Admin Section */}
          {isSuperAdmin && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Super Admin
              </h3>
              <div className="space-y-1">
                <NavLink to="/dashboard/super-admin" icon={Shield}>
                  Admin Panel
                </NavLink>
                <NavLink to="/dashboard/super-admin/academies" icon={GraduationCap}>
                  Manage Academies
                </NavLink>
              </div>
            </div>
          )}

          {/* Academy Admin Section */}
          {isAcademyAdmin && currentAcademy && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Academy Management
              </h3>
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-900">
                    {currentAcademy.name}
                  </span>
                </div>
                <span className="text-xs text-slate-500 capitalize">
                  {currentAcademy.roles.join(", ")}
                </span>
              </div>
              <div className="space-y-1">
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/admin/students`} icon={Users}>
                  Students
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/admin/teachers`} icon={Users}>
                  Teachers
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/admin/courses`} icon={BookOpen}>
                  Courses
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/admin/modules`} icon={Layers}>
                  Modules
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/admin/groups`} icon={Users}>
                  Groups
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/admin/chapters`} icon={BookOpen}>
                  Chapters
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/admin/sections`} icon={MousePointerBanIcon}>
                  Sections
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/admin/seances`} icon={BookOpen}>
                  Seances
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/admin/exams`} icon={BookOpen}>
                  Exams
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/admin/settings`} icon={Settings}>
                  Settings
                </NavLink>
              </div>
            </div>
          )}

          {/* Teacher Section */}
          {selectedRole === "teacher" && currentAcademy && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Teacher Dashboard
              </h3>
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-900">
                    {currentAcademy.name}
                  </span>
                </div>
                <span className="text-xs text-slate-500 capitalize">
                  {selectedRole}
                </span>
              </div>
              <div className="space-y-1">
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/teacher`} icon={GraduationCap}>
                  My Dashboard
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/teacher/exams`} icon={BookOpen}>
                  Exams
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/teacher/supports`} icon={Users}>
                  Supports
                </NavLink>
              </div>
            </div>
          )}

          {/* Student Section */}
          {selectedRole === "student" && currentAcademy && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Student Dashboard
              </h3>
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-900">
                    {currentAcademy.name}
                  </span>
                </div>
                <span className="text-xs text-slate-500 capitalize">
                  {selectedRole}
                </span>
              </div>
              <div className="space-y-1">
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/student`} icon={GraduationCap}>
                  My Dashboard
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/student/courses`} icon={BookOpen}>
                  My Courses
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/student/sessions`} icon={BookOpen}>
                  My Sessions
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/student/grades`} icon={Users}>
                  My Grades
                </NavLink>
                <NavLink to={`/dashboard/academy/${currentAcademy.academyId}/student/attendance`} icon={Users}>
                  Attendance
                </NavLink>
              </div>
            </div>
          )}
        </nav>

        {/* User Profile Footer */}
        <div className="p-6 border-t border-slate-200">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              
              <p className="text-sm font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex flex-col justify-center w-full items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">Welcome back! Here's what's happening.</p>
          </div>
          <div className="flex items-center gap-4">
           
            
          <div className="relative">
          {/* Profile button */}
          <div
            className="profile w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setOpen(!open)}
          >
            <User className="w-5 h-5 text-white" />
          </div>

          {/* Dropdown */}
          {open && (
            <ul
              ref={dropdownRef}
              className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout} >Logout</li>
            </ul>
          )}
        </div>
          </div>
         
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 bg-slate-50">
          <div className="max-w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
    
  );
  
}
