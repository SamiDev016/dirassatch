import { isLoggedIn, logout } from "../utils/auth"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Spinner from "./Spinner"

const Header = () => {
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        setTimeout(() => {
            logout();
            setLoggingOut(false);
            navigate("/login");
        }, 1000); 
    };

    return (
      <div className="flex justify-between py-5" style={{ borderBottom: "1px solid #ccc" }}>
        <a className="font-bold p-2 rounded-md" href="/">Dirassa Tech</a>
        <ul className="flex gap-5">
          <a className="hover:text-blue-500 cursor-pointer" href="/">Home </a>
          <a className="hover:text-blue-500 cursor-pointer" href="/academies">Academies</a>
          <a className="hover:text-blue-500 cursor-pointer" href="/courses">Courses</a>
          <a className="hover:text-blue-500 cursor-pointer" href="/about">About</a>
          <a className="hover:text-blue-500 cursor-pointer" href="#">Contact</a>
        </ul>
        {isLoggedIn() ? (
          <div className="flex gap-2">
            <a className="cursor-pointer hover:text-blue-500" onClick={() => navigate("/test")}>Profile</a>
            <button
              className="cursor-pointer hover:text-red-500 px-2 py-1 rounded disabled:opacity-60 bg-transparent border-none"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? <Spinner /> : "Logout"}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <a className="cursor-pointer hover:text-blue-500" onClick={() => navigate("/signup")}>Create Account</a>
            <a className="cursor-pointer hover:text-blue-500" onClick={() => navigate("/login")}>Login</a>
          </div>
        )}
      </div>
    )
}

export default Header