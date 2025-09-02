import { Outlet, Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserRoles } from "../../../utils/auth";

export default function DashboardLayout() {
  const [roles, setRoles] = useState({ globalRoles: [], academies: [] });
  const [loading, setLoading] = useState(true);
  const { academyId } = useParams(); 

  useEffect(() => {
    const loadRoles = async () => {
      const r = await getUserRoles();
      setRoles(r);
      setLoading(false);
    };
    loadRoles();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  const { globalRoles, academies } = roles;
  const isSuperAdmin = globalRoles.includes("superAdmin");

  // find the current academy user is inside
  const currentAcademy = academies.find(
    (a) => String(a.academyId) === String(academyId)
  );

  const isAcademyAdmin =
    currentAcademy &&
    (currentAcademy.roles.includes("manager") ||
      currentAcademy.roles.includes("owner"));

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="h-16 flex items-center justify-center border-b">
          <h2 className="text-xl font-bold text-gray-700">Dashboard</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {/* Common */}
          <Link
            to="/dashboard"
            className="block p-2 rounded cursor-pointer hover:bg-gray-200 text-gray-700"
          >
            Home
          </Link>
          <Link
            to="/dashboard/profile"
            className="block p-2 rounded cursor-pointer hover:bg-gray-200 text-gray-700"
          >
            Profile
          </Link>

          {/* Super Admin Links */}
          {isSuperAdmin && (
            <>
              <Link
                to="/dashboard/super-admin"
                className="block p-2 rounded cursor-pointer hover:bg-gray-200 text-gray-700"
              >
                Super Admin
              </Link>
              <Link
                to="/dashboard/super-admin/academy/1"
                className="block p-2 rounded cursor-pointer hover:bg-gray-200 text-gray-700"
              >
                Manage Academies
              </Link>
            </>
          )}
          {isAcademyAdmin && currentAcademy && (
            <div className="mt-4">
              <div className="ml-3 space-y-1">
                <Link
                  to={`/dashboard/academy/${currentAcademy.academyId}/admin/courses`}
                  className="block p-2 rounded hover:bg-gray-200 text-gray-700"
                >
                  Courses
                </Link>
                <Link
                  to={`/dashboard/academy/${currentAcademy.academyId}/admin/modules`}
                  className="block p-2 rounded hover:bg-gray-200 text-gray-700"
                >
                  Modules
                </Link>
                <Link
                  to={`/dashboard/academy/${currentAcademy.academyId}/admin/groups`}
                  className="block p-2 rounded hover:bg-gray-200 text-gray-700"
                >
                  Groups
                </Link>
                <Link
                  to={`/dashboard/academy/${currentAcademy.academyId}/admin/chapters`}
                  className="block p-2 rounded hover:bg-gray-200 text-gray-700"
                >
                  Chapters
                </Link>
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
