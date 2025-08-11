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
        <div className="flex gap-5">
          <img id="custom-logo-image" src="https://png.pngtree.com/png-clipart/20230928/original/pngtree-education-school-logo-design-student-literature-academy-vector-png-image_12898118.png" alt="Dirassa Tech Logo" />
          <a id="custom-logo" className="font-bold p-2 rounded-md cursor-pointer hover:text-blue-500" href="/">DirassaTech</a>
        </div>
        <ul className="flex gap-10">
          <a className="hover:text-blue-500 cursor-pointer h-10 w-20 text-lg font-bold" href="/">Home </a>
          <a className="hover:text-blue-500 cursor-pointer h-10 w-20 text-lg font-bold" href="/academies">Academies</a>
          <a className="hover:text-blue-500 cursor-pointer h-10 w-20 text-lg font-bold" href="/courses">Courses</a>
          <a className="hover:text-blue-500 cursor-pointer h-10 w-20 text-lg font-bold" href="/about">About</a>
          <a className="hover:text-blue-500 cursor-pointer h-10 w-20 text-lg font-bold" href="/contact">Contact</a>
        </ul>
        {isLoggedIn() ? (
          <div className="flex gap-2 items-center">
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
            <a className="cursor-pointer hover:text-blue-500 font-bold" onClick={() => navigate("/signup")}>Join Us</a>
          </div>
        )}
      </div>
    )
}

export default Header