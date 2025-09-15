import { useState, useEffect } from "react"; 
import { updateUserProfile, getUserData, getUserId } from "../../../utils/auth";
import { motion } from "framer-motion";
import { User, Mail, Phone, Camera, Save, Building2 } from "lucide-react";

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
      console.log("🔍 [ProfileAdmin] Fetching user data...");
      const user = await getUserData();
      console.log("🔍 [ProfileAdmin] User data received:", user);
      
      if (user) {
        console.log("🟢 [ProfileAdmin] Setting form data with:", {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          profilePhoto: user.profilePhoto
        });
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: user.phone || "",
          profilePhoto: user.profilePhoto || "",
        });
      } else {
        console.log("🔴 [ProfileAdmin] No user data received");
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
    
    console.log("🔍 [ProfileAdmin] Starting profile update...");
    console.log("🔍 [ProfileAdmin] Form data:", formData);
    
    const id = getUserId();
    console.log("🔍 [ProfileAdmin] User ID:", id);
    
    if (!id) {
      console.log("🔴 [ProfileAdmin] No user ID found");
      setMessage("User not found.");
      return;
    }

    console.log("🔵 [ProfileAdmin] Calling updateUserProfile with:", {
      id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      profilePhoto: formData.profilePhoto
    });

    const updated = await updateUserProfile(
      id,
      formData.firstName,
      formData.lastName,
      formData.phone,
      formData.profilePhoto
    );

    console.log("🔍 [ProfileAdmin] Update result:", updated);

    if (updated) {
      console.log("🟢 [ProfileAdmin] Profile update successful");
      setMessage("Profile updated successfully!");
    } else {
      console.log("🔴 [ProfileAdmin] Profile update failed");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* 🔹 Profile Settings Section */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Profile Settings
          </h1>
          <p className="text-sm text-gray-600 mt-1">Manage your personal information and profile details</p>
        </div>
        
        <div className="p-6">
          {message && (
            <motion.div 
              className={`mb-6 p-4 rounded-lg border ${
                message.includes("successfully") 
                  ? "bg-green-50 border-green-200 text-green-800" 
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                {message.includes("successfully") ? (
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="font-medium">{message}</span>
              </div>
            </motion.div>
          )}
          
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-500" />
                Profile Photo URL
              </label>
              <input
                type="url"
                name="profilePhoto"
                value={formData.profilePhoto}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter profile photo URL"
              />
              {formData.profilePhoto && (
                <div className="mt-4 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={formData.profilePhoto}
                    alt="Profile Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' /%3E%3C/svg%3E";
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Profile Photo Preview</p>
                    <p className="text-xs text-gray-500">Click the image to open in new tab</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <motion.button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-4 h-4" />
                Save Profile Changes
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* 🔹 Academy Settings Section */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-green-600" />
            Academy Settings
          </h1>
          <p className="text-sm text-gray-600 mt-1">Configure your academy information and branding</p>
        </div>

        {academyMessage && (
          <motion.div 
            className={`mb-6 p-4 rounded-lg border ${
              academyMessage.includes("saved") 
                ? "bg-green-50 border-green-200 text-green-800" 
                : "bg-red-50 border-red-200 text-red-800"
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              {academyMessage.includes("saved") ? (
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{academyMessage}</span>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleAcademySubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-green-500" />
              Academy Name
            </label>
            <input
              type="text"
              name="name"
              value={academyData.name}
              onChange={handleAcademyChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Enter academy name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Camera className="w-4 h-4 text-green-500" />
              Academy Logo (URL)
            </label>
            <input
              type="url"
              name="logo"
              value={academyData.logo}
              onChange={handleAcademyChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Enter academy logo URL"
            />
            {academyData.logo && (
              <div className="mt-4 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={academyData.logo}
                  alt="Academy Logo Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-green-500 shadow-md"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' /%3E%3C/svg%3E";
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Academy Logo Preview</p>
                  <p className="text-xs text-gray-500">Click the image to open in new tab</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-500" />
                Academy Email
              </label>
              <input
                type="email"
                name="email"
                value={academyData.email}
                onChange={handleAcademyChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Enter academy email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-500" />
                Academy Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={academyData.phone}
                onChange={handleAcademyChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Enter academy phone"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <motion.button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-4 h-4" />
              Save Academy Settings
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}