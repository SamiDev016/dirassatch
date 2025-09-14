import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAcademyDetails, addOwnerToAcademy, getUserById,getUserByEmail, getTotalMemebersByAcademy, getCoursesByAcademy } from "../../../utils/auth";

export default function AcademyDetails() {
  const { academyId } = useParams();
  const [academy, setAcademy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [owners, setOwners] = useState([]);

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    completionRate: 0,
    activeModules: 0
  });

  useEffect(() => {
    const fetchAcademy = async () => {
      try {
        setLoading(true);
        const data = await getAcademyDetails(academyId);
        setAcademy(data);
  
        // ✅ Get owners directly from userLinks
        const ownersData = data.userLinks
          .filter((link) => link.role?.name === "owner") // only owners
          .map((link) => ({
            id: link.user.id,
            firstName: link.user.firstName,
            lastName: link.user.lastName,
            email: link.user.account?.email,
            profilePhoto: link.user.profilePhoto,
          }));
  
        setOwners(ownersData);
  
        // Stats still mocked for now
        const { countTeacher, countStudent } = await getTotalMemebersByAcademy({
          $academyId: academyId,
        });
      
        const coursesCount = await getCoursesByAcademy({ academyId });
        setStats({
          students: countStudent,
          teachers: countTeacher,
          courses: coursesCount.length,
          completionRate: Math.floor(Math.random() * 30) + 70,
          activeModules: Math.floor(Math.random() * 25) + 10,
        });
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
  

  if (loading) return <div className="p-6 text-center py-10">Loading academy...</div>;
  if (error) return <div className="p-6 text-center py-10 text-red-500">{error}</div>;
  if (!academy) return <div className="p-6 text-center py-10">Academy not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
        <img
          src={academy.logo || "https://via.placeholder.com/120"}
          alt={academy.name}
          className="w-28 h-28 object-cover rounded-full border-4 border-blue-100 shadow-md"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{academy.name}</h1>
          <p className="text-gray-600 flex items-center gap-1 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            {academy.phone || ""}
          </p>
          <p className="text-gray-600 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            {academy.email || ""}
          </p>
        </div>
      </div>
      
      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl shadow-sm bg-blue-50 border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Students</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.students}</p>
            </div>
            <div className="p-3 rounded-full text-blue-500 bg-white/80 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-2xl shadow-sm bg-green-50 border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Teachers</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.teachers}</p>
            </div>
            <div className="p-3 rounded-full text-green-500 bg-white/80 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-2xl shadow-sm bg-purple-50 border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Courses</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.courses}</p>
            </div>
            <div className="p-3 rounded-full text-purple-500 bg-white/80 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
          </div>
        </div>
        
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
            <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"></path>
            <circle cx="12" cy="8" r="7"></circle>
          </svg>
          Academy Owners
        </h2>
        {owners.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {owners.map((owner) => (
      <div
        key={owner.id}
        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
      >
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
          {owner.firstName
            ? owner.firstName.charAt(0).toUpperCase()
            : "?"}
        </div>
        <div>
          <p className="font-medium text-gray-800">
            {owner.firstName} {owner.lastName}
          </p>
          <p className="text-sm text-gray-500">{owner.email}</p>
        </div>
      </div>
    ))}
  </div>
) : (
          <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-gray-500 font-medium">No owners assigned yet.</p>
            <p className="text-gray-400 text-sm mt-1">Add an owner using the form below.</p>
          </div>
        )}
      </div>

      {/* Add Owner */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
          Assign New Owner
        </h2>
        <p className="text-gray-600 mb-4">Add a new owner to this academy by entering their email address below.</p>
        <form onSubmit={handleAddOwner} className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter owner email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
          />
          <button
            type="submit"
            disabled={adding}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            {adding ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Owner
              </>
            )}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
