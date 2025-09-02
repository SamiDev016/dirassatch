import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { setToken, setIsSuperAdmin, resolveDashboardRoute,getUserRoles } from "../utils/auth"

const Login = () => {
    const [form, setForm] = useState({email: "",password: ""});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    const handleChange = (e) => {
        setForm(prev => ({...prev,[e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
      
          if (!response.ok) throw new Error("Failed to login");
      
          const data = await response.json();
          setToken(data.accessToken);
          setIsSuperAdmin(data.isSuperAdmin);
      
          const { academies } = await getUserRoles();
      
          if (academies.length === 1) {
            localStorage.setItem("selectedAcademyId", academies[0].academyId);
          }
      
          navigate("/dashboard");
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      
    return (
        <div>
            <Header />
            <div className="bg-gradient-to-tr from-blue-50 via-white to-blue-100 border-t border-blue-200 shadow-inner">
                <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-lg w-full space-y-8 bg-white rounded-xl shadow-lg p-8">
                        <h1 className="text-2xl font-bold text-center mb-6 text-blue-500">Login to Your Account</h1>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4" disabled={loading}>
                            <input type="email" name="email" placeholder="Email" onChange={handleChange} value={form.email} className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                            <input type="password" name="password" placeholder="Password" onChange={handleChange} value={form.password} className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                            <button type="submit" className="p-3 rounded bg-blue-500 text-white hover:bg-blue-600 transition font-semibold disabled:opacity-60" disabled={loading}>
                                {loading ? "Loading..." : "Login"}
                            </button>
                        </form>
                        <p className="text-center text-sm text-gray-500 mt-4">
                            Don't have an account?{' '}
                            <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/signup')}>Sign up</span>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Login
