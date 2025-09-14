import { useState, useEffect } from "react";
import { getStudentsByAcademy } from "../../../utils/auth";

export default function StudentsAdmin() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const academyId = localStorage.getItem("selectedAcademyId");
      console.log("🔵 [StudentsAdmin] academyId from localStorage:", academyId);

      if (!academyId) {
        console.warn("🟡 [StudentsAdmin] No academyId found in localStorage!");
        setError("No academy selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getStudentsByAcademy({ academyId });
        console.log("🟢 [StudentsAdmin] API Response:", data);

        if (data && Array.isArray(data)) {
          setStudents(data);
        } else {
          console.warn("🟡 [StudentsAdmin] No students found or invalid format:", data);
          setError("No students found");
        }
      } catch (err) {
        console.error("🔴 [StudentsAdmin] Failed to load students:", err);
        setError("Failed to load students");
      } finally {
        console.log("⚪ [StudentsAdmin] Fetch finished");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Students Admin</h1>
      <ul>
        {students.map((s) => (
          <li key={s.id}>
            {s.firstName} {s.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}
