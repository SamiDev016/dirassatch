import { useState, useEffect } from "react";
import { updateUserProfile, getUserData, getUserId } from "../../../utils/auth";

export default function ProfileAdminDashboard() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        profilePhoto: "",
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const user = await getUserData();
            if (user) {
                setFormData({
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    phone: user.phone || "",
                    profilePhoto: user.profilePhoto || "",
                });
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        const id = getUserId();
        if (!id) {
            setMessage("User not found.");
            return;
        }

        const updated = await updateUserProfile(
            id,
            formData.firstName,
            formData.lastName,
            formData.phone,
            formData.profilePhoto
        );

        if (updated) {
            setMessage("✅ Profile updated successfully!");
        } else {
            setMessage("❌ Failed to update profile.");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>

            {message && (
                <p
                    className={`mb-4 ${
                        message.includes("✅")
                            ? "text-green-600"
                            : "text-red-600"
                    }`}
                >
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Profile Photo (URL)</label>
                    <input
                        type="text"
                        name="profilePhoto"
                        value={formData.profilePhoto}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                    {formData.profilePhoto && (
                        <img
                            src={formData.profilePhoto}
                            alt="Profile Preview"
                            className="mt-2 w-20 h-20 rounded-full object-cover"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
}
