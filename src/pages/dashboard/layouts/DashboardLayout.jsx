import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserRoles } from "../../../utils/auth";

export default function DashboardLayout() {
  const [roles, setRoles] = useState({ globalRoles: [], academies: [] });
  const [loading, setLoading] = useState(true);

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
  const hasAcademyAdmin = academies.some(a => a.roles.includes("manager"));

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="h-16 flex items-center justify-center border-b">
          <h2 className="text-xl font-bold text-gray-700">Dashboard</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
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

          {/* Academy Admin Links */}
          {hasAcademyAdmin && academies.map(a =>
            a.roles.includes("manager") ? (
              <Link
                key={a.academyId}
                to={`/dashboard/academy/${a.academyId}/admin`}
                className="block p-2 rounded cursor-pointer hover:bg-gray-200 text-gray-700"
              >
                {a.academyName} (Admin)
              </Link>
            ) : null
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
