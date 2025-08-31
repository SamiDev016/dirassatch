import { useEffect, useState } from "react";
import { createAcademy, getAllAcademies } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
  const [academies, setAcademies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", logo: null });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAcademies = async () => {
      try {
        setLoading(true);
        const data = await getAllAcademies();
        if (data) setAcademies(data);
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
      <h1 className="text-3xl font-bold text-gray-800">⚡ Super Admin Dashboard</h1>

      {/* Create Academy Form */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Academy</h2>
        <form
          onSubmit={handleCreateAcademy}
          className="grid gap-4 md:grid-cols-2 items-center"
        >
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Academy Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Academy Logo</label>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm col-span-2">{error}</p>
          )}

          <div className="col-span-2">
            <button
              type="submit"
              disabled={creating}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              {creating ? "Creating..." : "Create Academy"}
            </button>
          </div>
        </form>
      </div>

      {/* Academy Cards */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">All Academies</h2>
        {loading ? (
          <p className="text-gray-500">⏳ Loading academies...</p>
        ) : academies.length === 0 ? (
          <p className="text-gray-600">No academies found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

  return (
    <div className="p-4 border rounded-xl flex flex-col bg-gray-50 hover:shadow-lg transition">
      <div className="flex items-center gap-4">
        <img
          src={academy.logo || "https://via.placeholder.com/80"}
          alt={academy.name}
          className="w-16 h-16 object-cover rounded-full border"
        />
        <span className="font-semibold text-lg">{academy.name}</span>
      </div>
      <button
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        onClick={() => navigate(`/dashboard/super-admin/academy/${academy.id}`)}
      >
        Show Details
      </button>
    </div>
  );
}
