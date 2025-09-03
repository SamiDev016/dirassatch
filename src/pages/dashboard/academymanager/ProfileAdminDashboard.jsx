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

  // Fake academy data for now
  const [academyData, setAcademyData] = useState({
    id: 15,
    name: "Jugurta Stud",
    logo: "https://storage.googleapis.com/daracademyfireproject.appspot.com/academy_logo/4390eda9-866d-4b0e-9085-f90ccd476903.jpg",
    phone: "",
    email: "",
  });
  const [academyMessage, setAcademyMessage] = useState("");

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

  // Profile change handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
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
      setMessage("Profile updated successfully!");
    } else {
      setMessage("Failed to update profile.");
    }
  };

  // Academy change handlers
  const handleAcademyChange = (e) => {
    const { name, value } = e.target;
    setAcademyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAcademySubmit = (e) => {
    e.preventDefault();
    setAcademyMessage("Academy settings saved!");
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-12">

      {/* 🔹 Academy Settings Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Academy Settings</h1>

        {academyMessage && (
          <p
            className={`mb-4 p-3 rounded ${
              academyMessage.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            } transition-all duration-300`}
          >
            {academyMessage}
          </p>
        )}

        <form onSubmit={handleAcademySubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">Academy Name</label>
            <input
              type="text"
              name="name"
              value={academyData.name}
              onChange={handleAcademyChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Academy Logo (URL)</label>
            <input
              type="text"
              name="logo"
              value={academyData.logo}
              onChange={handleAcademyChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {academyData.logo && (
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={academyData.logo}
                  alt="Academy Logo Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow-md"
                />
                <p className="text-gray-500 text-sm">Academy logo preview</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={academyData.phone}
              onChange={handleAcademyChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={academyData.email}
              onChange={handleAcademyChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-transform transform hover:scale-105"
          >
            Save Academy Settings
          </button>
        </form>
      </div>

      {/* 🔹 Profile Settings Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile Settings</h1>

        {message && (
          <p
            className={`mb-4 p-3 rounded ${
              message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            } transition-all duration-300`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleProfileChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleProfileChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleProfileChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Profile Photo (URL)</label>
            <input
              type="text"
              name="profilePhoto"
              value={formData.profilePhoto}
              onChange={handleProfileChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {formData.profilePhoto && (
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={formData.profilePhoto}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow-md transition-transform transform hover:scale-105"
                />
                <p className="text-gray-500 text-sm">Profile photo preview</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-transform transform hover:scale-105"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
    