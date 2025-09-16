import { isLoggedIn, logout, getIsSuperAdmin } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Spinner from "./Spinner";

const Header = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    setTimeout(() => {
      logout();
      setLoggingOut(false);
      navigate("/login");
    }, 1000);
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Academies", path: "/academies" },
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="https://png.pngtree.com/png-clipart/20230928/original/pngtree-education-school-logo-design-student-literature-academy-vector-png-image_12898118.png"
              alt="Dirassa Tech Logo"
              className="w-10 h-10"
            />
            <span
              className="font-bold text-xl cursor-pointer hover:text-blue-500"
              onClick={() => navigate("/")}
            >
              DirassaTech
            </span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map(item => (
              <span
                key={item.name}
                onClick={() => navigate(item.path)}
                className="text-gray-700 hover:text-blue-500 font-medium cursor-pointer transition-colors"
              >
                {item.name}
              </span>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn() ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  Admin Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                >
                  {loggingOut ? <Spinner /> : "Logout"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-1 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                >
                  Join Us
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700 hover:text-blue-500"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <nav className="flex flex-col px-4 py-4 gap-3">
            {menuItems.map(item => (
              <span
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                className="text-gray-700 hover:text-blue-500 font-medium cursor-pointer transition-colors"
              >
                {item.name}
              </span>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              {isLoggedIn() ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    Admin Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                  >
                    {loggingOut ? <Spinner /> : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 transition mb-2"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                  >
                    Join Us
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
