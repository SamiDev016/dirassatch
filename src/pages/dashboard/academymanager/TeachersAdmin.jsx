import { useState, useEffect } from "react";
import { getTeachersByAcademy } from "../../../utils/auth";

export default function TeachersAdmin() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      const academyId = localStorage.getItem("selectedAcademyId");
      console.log("🔵 [TeachersAdmin] academyId from localStorage:", academyId);

      if (!academyId) {
        console.warn("🟡 [TeachersAdmin] No academyId found in localStorage!");
        setError("No academy selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getTeachersByAcademy({ academyId });
        console.log("🟢 [TeachersAdmin] API Response:", data);

        if (data && Array.isArray(data)) {
          setTeachers(data);
        } else {
          console.warn("🟡 [TeachersAdmin] No teachers found or invalid format:", data);
          setError("No teachers found");
        }
      } catch (err) {
        console.error("🔴 [TeachersAdmin] Failed to load teachers:", err);
        setError("Failed to load teachers");
      } finally {
        console.log("⚪ [TeachersAdmin] Fetch finished");
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) return <p>Loading teachers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Teachers</h1>
      <ul>
        {teachers.map((t) => (
          <li key={t.id}>
            {t.firstName} {t.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}
