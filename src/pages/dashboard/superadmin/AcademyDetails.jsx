import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAcademyDetails, addOwnerToAcademy, getUserById,getUserByEmail } from "../../../utils/auth";

export default function AcademyDetails() {
  const { academyId } = useParams();
  const [academy, setAcademy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    const fetchAcademy = async () => {
      try {
        setLoading(true);
        const data = await getAcademyDetails(academyId);
        setAcademy(data);
        const ownersData = await Promise.all(
          data.owners.map((ownerId) => getUserById(ownerId))
        );
        setOwners(ownersData);
      } catch (err) {
        setError("Failed to load academy details");
      } finally {
        setLoading(false);
      }
    };
    fetchAcademy();
  }, [academyId]);

  const handleAddOwner = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError(null);
  
    try {
      const userData = await getUserByEmail(email);
      if (!userData || !userData.userId) {
        throw new Error("User not found");
      }
  
      await addOwnerToAcademy(academyId, userData.userId);
  
      const updated = await getAcademyDetails(academyId);
      setAcademy(updated);
  
      const ownersData = await Promise.all(
        updated.owners.map((ownerId) => getUserById(ownerId))
      );
      setOwners(ownersData);
  
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to add owner");
    } finally {
      setAdding(false);
    }
  };
  

  if (loading) return <div className="p-6">⏳ Loading academy...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!academy) return <div className="p-6">❌ Academy not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow">
        <img
          src={academy.logo || "https://via.placeholder.com/120"}
          alt={academy.name}
          className="w-28 h-28 object-cover rounded-full border"
        />
        <div>
          <h1 className="text-3xl font-bold">{academy.name}</h1>
          <p className="text-gray-600">📞 {academy.phone || "N/A"}</p>
          <p className="text-gray-600">📧 {academy.email || "N/A"}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">🏆 Owners</h2>
      {academy.owners.length > 0 ? (
        <ul className="list-disc pl-6 space-y-1">
          {owners.map((owner) => (
            <li key={owner.id}>
              <span className="font-medium">{owner.name}</span>{" "}
              <span className="text-gray-500">({owner.email})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No owners assigned yet.</p>
      )}
    </div>

      {/* Add Owner */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">➕ Assign Owner</h2>
        <form onSubmit={handleAddOwner} className="flex gap-4">
          <input
            type="email"
            placeholder="Enter owner email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
          />
          <button
            type="submit"
            disabled={adding}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            {adding ? "Adding..." : "Add Owner"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
