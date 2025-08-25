import Header from "../../../components/dashboard/Header";
import Sidebar from "../../../components/dashboard/Sidebar";
import Footer from "../../../components/dashboard/Footer";
import { useState, useEffect } from "react";
import { getAllAcademies, createAcademy } from "../../../utils/auth";

const AdminDashboardAcademies = () => {
    const [academies, setAcademies] = useState([]);
    const [loading, setLoading] = useState(true); // for fetching academies
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        logo: null,
    });
    const [logoPreview, setLogoPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false); // for form submission

    useEffect(() => {
        const fetchAcademies = async () => {
            try {
                const academies = await getAllAcademies();
                setAcademies(academies);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAcademies();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "logo" && files.length > 0) {
            setFormData({ ...formData, logo: files[0] });
            setLogoPreview(URL.createObjectURL(files[0]));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return; // prevent double click

        setSubmitting(true);

        try {
            const payload = new FormData();
            payload.append("name", formData.name);
            payload.append("logo", formData.logo);

            const newAcademy = await createAcademy(payload);
            if (newAcademy) {
                setAcademies((prev) => [...prev, newAcademy]);
                setFormData({ name: "", logo: null });
                setLogoPreview(null);
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Error submitting academy:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="w-full md:w-4/5 bg-gradient-to-tr from-blue-50 via-white to-blue-100 p-10 border-t border-blue-200 shadow-inner">
                    <div className="flex justify-end mb-4 gap-2">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                        >
                            Add Academy
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                            Requests Academy
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
                        <h1 className="text-2xl font-bold mb-6">Academies</h1>
                        {loading ? (
                            <p>Loading academies...</p>
                        ) : (
                            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left">ID</th>
                                        <th className="px-6 py-3 text-left">Logo</th>
                                        <th className="px-6 py-3 text-left">Name</th>
                                        <th className="px-6 py-3 text-left">Address</th>
                                        <th className="px-6 py-3 text-left">Phone</th>
                                        <th className="px-6 py-3 text-left">Email</th>
                                        <th className="px-6 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {academies.map((academy, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">{academy.id}</td>
                                            <td className="px-6 py-4">
                                                <img
                                                    src={academy.logo}
                                                    alt={academy.name}
                                                    className="h-20 w-20 object-contain rounded-full"
                                                />
                                            </td>
                                            <td className="px-6 py-4">{academy.name}</td>
                                            <td className="px-6 py-4">{academy.addressId}</td>
                                            <td className="px-6 py-4">{academy.phone}</td>
                                            <td className="px-6 py-4">{academy.email}</td>
                                            <td className="px-6 py-4 flex gap-2 justify-center">
                                                <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                                                    View
                                                </button>
                                                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                                                    Edit
                                                </button>
                                                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                                <h2 className="text-xl font-bold mb-4">Add New Academy</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="mb-4 flex-row flex gap-2 items-center">
                                        <label className="block text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4 flex-row flex gap-2 items-center">
                                        <label className="block text-gray-700 mb-2">Logo</label>
                                        <input
                                            type="file"
                                            name="logo"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2 cursor-pointer hover:border-blue-500"
                                            required
                                        />
                                        {logoPreview && (
                                            <img
                                                src={logoPreview}
                                                alt="Logo Preview"
                                                className="h-20 w-20 object-contain mt-2"
                                            />
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="cursor-pointer px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className={`cursor-pointer px-4 py-2 text-white rounded ${submitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                                        >
                                            {submitting ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboardAcademies;
