import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { isLoggedIn } from "../utils/auth"
import { storeUserInfo } from "../utils/auth"

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: ""
    });

    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";

    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);


        setLoading(true);
        try {
            // Signup
            const res = await fetch(`${API_BASE}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Signup failed");
            }

            // After signup, login with same credentials
            const loginRes = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            if (!loginRes.ok) {
                const loginError = await loginRes.json();
                throw new Error(loginError.message || "Login after signup failed");
            }

            const loginData = await loginRes.json();
            storeUserInfo(loginData);
            navigate("/adminDashboard");
        } catch (error) {
            setErrorMessage(error.message);
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
                        <h1 className="text-2xl font-bold text-center mb-6 text-blue-500">Create Account</h1>
                        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4" disabled={loading}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={handleChange}
                                value={formData.firstName}
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={handleChange}
                                value={formData.lastName}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={handleChange}
                                value={formData.email}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={handleChange}
                                value={formData.password}
                                required
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={handleChange}
                                value={formData.phone}
                                required
                            />
                            <button type="submit" className="p-3 rounded bg-blue-500 text-white hover:bg-blue-600 transition font-semibold disabled:opacity-60" disabled={loading}>
                                {loading ? "Loading..." : "Create Account"}
                            </button>
                        </form>
                        <p className="text-center text-sm text-gray-500 mt-4">
                            Already have an account?{' '}
                            <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/login')}>Login</span>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Signup;
