import { Outlet, Link } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="h-16 flex items-center justify-center border-b">
          <h2 className="text-xl font-bold text-gray-700">My Dashboard</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            className="block p-2 rounded hover:bg-gray-200 text-gray-700"
          >
            Home
          </Link>
          <Link
            to="/dashboard/profile"
            className="block p-2 rounded hover:bg-gray-200 text-gray-700"
          >
            Profile
          </Link>
          <Link
            to="/dashboard/settings"
            className="block p-2 rounded hover:bg-gray-200 text-gray-700"
          >
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">🔔</button>
            <button className="text-gray-600 hover:text-gray-800">👤</button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
