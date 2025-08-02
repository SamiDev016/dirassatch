import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { isLoggedIn } from "../utils/auth"

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
            navigate("/test");
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <h1 className="text-xl font-bold mb-6 text-center p-5">Create Account</h1>

            {errorMessage && (
                <p className="text-center text-red-600">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-1/2 mx-auto" disabled={loading}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="p-2 rounded border"
                    onChange={handleChange}
                    value={formData.firstName}
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="p-2 rounded border"
                    onChange={handleChange}
                    value={formData.lastName}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="p-2 rounded border"
                    onChange={handleChange}
                    value={formData.email}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="p-2 rounded border"
                    onChange={handleChange}
                    value={formData.password}
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    className="p-2 rounded border"
                    onChange={handleChange}
                    value={formData.phone}
                />
                <button type="submit" className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition">
                    {loading ? "Loading..." : "Create Account"}
                </button>
            </form>

            <Footer />
        </div>
    );
};

export default Signup;
