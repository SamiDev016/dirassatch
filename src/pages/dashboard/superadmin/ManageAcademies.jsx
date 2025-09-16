import { useEffect, useState } from "react";
import { createAcademy, getAllAcademies, getStudentsByAcademy, getTeachersByAcademy, getAllTeachers, getAllStudents,getCoursesByAcademy } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Users, BookOpen, Building, Plus, Search, TrendingUp, Award } from "lucide-react";

export default function ManageAcademies() {
  const navigate = useNavigate();
  const [academies, setAcademies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", logo: null });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    activeAcademies: 0
  });

  useEffect(() => {
    const fetchAcademies = async () => {
      try {
        setLoading(true);
        const data = await getAllAcademies();
        if (data) {
          setAcademies(data);
          
          // Get total students and teachers across all academies
          const totalStudents = await getAllStudents();
          const totalTeachers = await getAllTeachers();
          
          setStats({
            totalStudents: totalStudents,
            totalTeachers: totalTeachers,
            totalCourses: 0,
            activeAcademies: data.length
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademies();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setForm({ ...form, logo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCreateAcademy = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (form.logo) fd.append("logo", form.logo);

      const newAcademy = await createAcademy(fd);
      if (!newAcademy) throw new Error("❌ Failed to create academy");

      const updated = await getAllAcademies();
      setAcademies(updated);
      
      // Refresh statistics
      const totalStudents = await getAllStudents();
      const totalTeachers = await getAllTeachers();
      setStats(prev => ({
        ...prev,
        totalStudents: totalStudents,
        totalTeachers: totalTeachers,
        activeAcademies: updated.length
      }));
      
      setForm({ name: "", logo: null });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <Building className="text-blue-600" size={36} />
              Manage Academies
            </h1>
            <p className="text-gray-600 mt-2">Oversee and manage all educational academies in your platform</p>
          </div>
          
        </motion.div>
      
        {/* Statistics Section */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-100 mb-1">Total Academies</h3>
                  <p className="text-3xl font-bold text-white">{academies.length}</p>
                </div>
                <div className="p-3 rounded-full text-white bg-blue-400/30 backdrop-blur-sm">
                  <Building size={24} />
                </div>
              </div>
              <div className="text-xs text-blue-100 flex items-center gap-1">
                <TrendingUp size={12} />
                <span>All registered academies</span>
              </div>
            </motion.div>
            
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-purple-100 mb-1">Total Students</h3>
                  <p className="text-3xl font-bold text-white">{stats.totalStudents}</p>
                </div>
                <div className="p-3 rounded-full text-white bg-purple-400/30 backdrop-blur-sm">
                  <GraduationCap size={24} />
                </div>
              </div>
              <div className="text-xs text-purple-100 flex items-center gap-1">
                <TrendingUp size={12} />
                <span>Students across all academies</span>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-amber-100 mb-1">Total Teachers</h3>
                  <p className="text-3xl font-bold text-white">{stats.totalTeachers}</p>
                </div>
                <div className="p-3 rounded-full text-white bg-amber-400/30 backdrop-blur-sm">
                  <Users size={24} />
                </div>
              </div>
              <div className="text-xs text-amber-100 flex items-center gap-1">
                <TrendingUp size={12} />
                <span>Teachers across all academies</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Create Academy Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Create New Academy</h2>
          </div>
          <p className="text-gray-600 mb-6">Add a new academy to the platform by providing the required information below.</p>
          <form
            onSubmit={handleCreateAcademy}
            className="grid gap-6 md:grid-cols-2"
          >
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Building size={16} />
                Academy Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter academy name"
                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Award size={16} />
                Academy Logo
              </label>
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: Square image, max 5MB</p>
            </div>

            {error && (
              <div className="col-span-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating Academy...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create Academy
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Academies List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Search className="text-purple-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Manage Academies</h2>
          </div>
          <p className="text-gray-600 mb-6">View and manage all academies registered on the platform. Click on an academy to see detailed information.</p>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading academies...</p>
            </div>
          ) : academies.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
              <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 font-semibold text-lg mb-2">No academies found.</p>
              <p className="text-gray-500">Create your first academy using the form above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {academies.map((academy, index) => (
                <motion.div
                  key={academy.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <AcademyCard academy={academy} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function AcademyCard({ academy }) {
  const navigate = useNavigate();
  const [academyStats, setAcademyStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchAcademyStats = async () => {
      try {
        setLoadingStats(true);
        const students = await getStudentsByAcademy({ academyId: academy.id || academy.academyId });
        const teachers = await getTeachersByAcademy({ academyId: academy.id || academy.academyId });
        const courses = await getCoursesByAcademy({ academyId: academy.id || academy.academyId });
        setAcademyStats({
          students: students ? students.length : 0,
          teachers: teachers ? teachers.length : 0,
          courses: courses ? courses.length : 0
        });
      } catch (err) {
        console.error('Error fetching academy stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    if (academy.id || academy.academyId) {
      fetchAcademyStats();
    }
  }, [academy.id, academy.academyId]);

  return (
    <motion.div 
      whileHover={{ scale: 1.01, x: 4 }}
      className="w-full p-6 border border-gray-200 rounded-2xl flex flex-row items-center bg-gradient-to-r from-white via-blue-50 to-indigo-50 hover:shadow-2xl transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/dashboard/super-admin/academy/${academy.id}`)}
    >
      {/* Academy Logo and Basic Info */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative">
          <img
            src={academy.logo || "https://via.placeholder.com/80"}
            alt={academy.name}
            className="w-16 h-16 object-cover rounded-full border-3 border-white shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{academy.name}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Building size={14} />
            ID: {academy.id || academy.academyId}
          </p>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="flex gap-4 mx-6">
        <div className="text-center p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border border-blue-200 min-w-[80px]">
          <div className="flex items-center justify-center mb-1">
            <GraduationCap className="text-blue-600" size={16} />
          </div>
          <p className="text-xs text-blue-700 font-medium">Students</p>
          <p className="font-bold text-blue-800">
            {loadingStats ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
            ) : (
              academyStats.students
            )}
          </p>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg border border-green-200 min-w-[80px]">
          <div className="flex items-center justify-center mb-1">
            <Users className="text-green-600" size={16} />
          </div>
          <p className="text-xs text-green-700 font-medium">Teachers</p>
          <p className="font-bold text-green-800">
            {loadingStats ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mx-auto"></div>
            ) : (
              academyStats.teachers
            )}
          </p>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg border border-purple-200 min-w-[80px]">
          <div className="flex items-center justify-center mb-1">
            <BookOpen className="text-purple-600" size={16} />
          </div>
          <p className="text-xs text-purple-700 font-medium">Courses</p>
          <p className="font-bold text-purple-800">{academyStats.courses}</p>
        </div>
      </div>
      
      {/* Action Button */}
      <button
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium whitespace-nowrap"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/dashboard/super-admin/academy/${academy.id}`);
        }}
      >
        <Search size={16} />
        View Details
      </button>
    </motion.div>
  );
}
