import { useEffect, useState } from "react";
import { createAcademy, getAllAcademies } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";

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
          
          // Set fake statistics data based on number of academies
          setStats({
            totalStudents: data.length * 45 + 230,
            totalTeachers: data.length * 8 + 25,
            totalCourses: data.length * 12 + 40,
            activeAcademies: Math.max(Math.floor(data.length * 0.8), 0)
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
      setForm({ name: "", logo: null });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-800">Manage Academies</h1>
      
      {/* Statistics Section */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl shadow-sm bg-blue-50 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Academies</h3>
                <p className="text-2xl font-bold text-gray-800">{academies.length}</p>
              </div>
              <div className="p-3 rounded-full text-blue-500 bg-white/80 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-500 mr-1">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              <span className="text-xs font-medium text-green-500">12% increase</span>
              <span className="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl shadow-sm bg-green-50 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Active Academies</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.activeAcademies}</p>
              </div>
              <div className="p-3 rounded-full text-green-500 bg-white/80 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-500 mr-1">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              <span className="text-xs font-medium text-green-500">8% increase</span>
              <span className="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl shadow-sm bg-purple-50 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Students</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.totalStudents.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full text-purple-500 bg-white/80 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-500 mr-1">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              <span className="text-xs font-medium text-green-500">15% increase</span>
              <span className="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl shadow-sm bg-amber-50 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Teachers</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.totalTeachers}</p>
              </div>
              <div className="p-3 rounded-full text-amber-500 bg-white/80 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-500 mr-1">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              <span className="text-xs font-medium text-green-500">5% increase</span>
              <span className="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>
      )}

      {/* Create Academy Form */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">Create New Academy</h2>
        <p className="text-gray-600 mb-4">Add a new academy to the platform by providing the required information below.</p>
        <form
          onSubmit={handleCreateAcademy}
          className="grid gap-4 md:grid-cols-2 items-center"
        >
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-2 font-medium">Academy Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-2 font-medium">Academy Logo</label>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm col-span-2">{error}</p>
          )}

          <div className="col-span-2">
            <button
              type="submit"
              disabled={creating}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition"
            >
              {creating ? "Creating..." : "Create Academy"}
            </button>
          </div>
        </form>
      </div>

      {/* Academies List */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">Manage Academies</h2>
        <p className="text-gray-600 mb-4">View and manage all academies registered on the platform. Click on an academy to see detailed information.</p>
        {loading ? (
          <div className="text-center py-10">Loading academies...</div>
        ) : academies.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 font-medium">No academies found.</p>
            <p className="text-gray-400 text-sm mt-1">Create your first academy using the form above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academies.map((academy) => (
              <AcademyCard key={academy.id} academy={academy} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AcademyCard({ academy }) {
  const navigate = useNavigate();

  // Fake data for academy card
  const students = Math.floor(Math.random() * 100) + 20;
  const teachers = Math.floor(Math.random() * 15) + 5;
  const courses = Math.floor(Math.random() * 20) + 3;

  return (
    <div className="p-6 border border-gray-200 rounded-2xl flex flex-col bg-gradient-to-b from-white to-gray-50 hover:shadow-2xl transition transform hover:-translate-y-1">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={academy.logo || "https://via.placeholder.com/80"}
          alt={academy.name}
          className="w-16 h-16 object-cover rounded-full border border-gray-300"
        />
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{academy.name}</h3>
          <p className="text-sm text-gray-500">ID: {academy.id}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 my-4">
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-500">Students</p>
          <p className="font-semibold text-gray-800">{students}</p>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <p className="text-xs text-gray-500">Teachers</p>
          <p className="font-semibold text-gray-800">{teachers}</p>
        </div>
        <div className="text-center p-2 bg-purple-50 rounded-lg">
          <p className="text-xs text-gray-500">Courses</p>
          <p className="font-semibold text-gray-800">{courses}</p>
        </div>
      </div>
      
      <button
        className="mt-auto bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 shadow transition flex items-center justify-center gap-2"
        onClick={() => navigate(`/dashboard/super-admin/academy/${academy.id}`)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        View Details
      </button>
    </div>
  );
}
