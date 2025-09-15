import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createSeance,
  getAllSeance,
  updateSeance,
  deleteSeance,
  getTeachersByAcademy,
  getCoursesByAcademy,
  getGroupsByCourse,
  getChaptersByCourse,
  // Attendance
  getAttendacesBySeance,
  createAttendance,
  getAllMembersOfGroup,
} from "../../../utils/auth";

export default function SeanceAdmin() {
  const [seances, setSeances] = useState([]);
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [form, setForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
    meetingUrl: "",
    mode: "ONSITE",
    groupId: "",
    teacherId: "",
    courseId: "",
    chapterId: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [openSeanceDialog, setOpenSeanceDialog] = useState(false);

  // Attendance state
  const [attendanceDialog, setAttendanceDialog] = useState(false);
  const [currentSeance, setCurrentSeance] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [newAttendance, setNewAttendance] = useState({
    userId: "",
    status: "PRESENT",
  });

  // Fetch seances and dropdowns
  useEffect(() => {
    fetchSeances();
    fetchDropdowns();
  }, []);

  async function fetchSeances() {
    const data = await getAllSeance();
    if (data) setSeances(data);
  }

  async function fetchDropdowns() {
    const teachersData = await getTeachersByAcademy({ academyId: 1 });
    const coursesData = await getCoursesByAcademy({ academyId: 1 });

    if (teachersData) setTeachers(teachersData);
    if (coursesData) setCourses(coursesData);
  }

  async function handleCourseChange(courseId) {
    setForm({ ...form, courseId, groupId: "", chapterId: "" });

    if (courseId) {
      const groupsData = await getGroupsByCourse({ courseId });
      const chaptersData = await getChaptersByCourse({ id: courseId });
      if (groupsData) setGroups(groupsData);
      if (chaptersData) setChapters(chaptersData);
    } else {
      setGroups([]);
      setChapters([]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      groupId: Number(form.groupId),
      teacherId: Number(form.teacherId),
      chapterId: Number(form.chapterId),
    };

    if (editingId) {
      await updateSeance({ seanceId: editingId, ...payload });
      setEditingId(null);
    } else {
      await createSeance(payload);
    }

    resetForm();
    setOpenSeanceDialog(false);
    fetchSeances();
  }

  async function handleDelete(id) {
    await deleteSeance({ seanceId: id });
    fetchSeances();
  }

  function handleEdit(seance) {
    setForm({
      ...seance,
      groupId: String(seance.groupId),
      teacherId: String(seance.teacherId),
      courseId: String(seance.courseId || ""),
      chapterId: String(seance.chapterId),
    });
    setEditingId(seance.id);
    setOpenSeanceDialog(true);
  }

  function resetForm() {
    setForm({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      notes: "",
      meetingUrl: "",
      mode: "ONSITE",
      groupId: "",
      teacherId: "",
      courseId: "",
      chapterId: "",
    });
  }

  // Attendance handling
  async function openAttendance(seance) {
    setCurrentSeance(seance);

    // fetch attendance
    const data = await getAttendacesBySeance({ seanceId: seance.id });
    setAttendance(data || []);

    // fetch group students
    if (seance.groupId) {
      const members = await getAllMembersOfGroup({ groupId: seance.groupId });
      if (members) {
        const onlyStudents = members.filter((m) => m.role === "STUDENT");
        setStudents(onlyStudents);
      }
    }

    setAttendanceDialog(true);
  }

  async function handleAddAttendance() {
    if (!newAttendance.userId) return;
    await createAttendance({
      seanceId: currentSeance.id,
      userId: Number(newAttendance.userId),
      status: newAttendance.status,
    });
    const updated = await getAttendacesBySeance({ seanceId: currentSeance.id });
    setAttendance(updated || []);
    setNewAttendance({ userId: "", status: "PRESENT" });
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📚 Seances</h1>

      {/* Add Seance Button */}
      <button
        onClick={() => setOpenSeanceDialog(true)}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
      >
        + Add Seance
      </button>

      {/* Seance Table */}
      <motion.table
        className="w-full border-collapse border shadow-lg rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-3">Title</th>
            <th className="border p-3">Date</th>
            <th className="border p-3">Time</th>
            <th className="border p-3">Mode</th>
            <th className="border p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
        {seances.map((s) => (
            <motion.tr
            key={s.id}
            className="hover:bg-gray-50 transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            >
            {/* Title */}
            <td className="border p-3">{s.title}</td>

            {/* Date (from startsAt) */}
            <td className="border p-3">
                {new Date(s.startsAt).toLocaleDateString()}
            </td>

            {/* Time range */}
            <td className="border p-3">
                {new Date(s.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} 
                {" - "}
                {new Date(s.endsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </td>

            {/* Mode */}
            <td className="border p-3">{s.mode}</td>

            {/* Actions */}
            <td className="border p-3 space-x-2">
                <button
                onClick={() => handleEdit(s)}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                >
                Edit
                </button>
                <button
                onClick={() => handleDelete(s.id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                Delete
                </button>
                <button
                onClick={() => openAttendance(s)}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                Attendance
                </button>
            </td>
            </motion.tr>
        ))}
        </tbody>

      </motion.table>

      {/* Attendance Dialog */}
      <AnimatePresence>
        {attendanceDialog && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-[700px] p-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-4">
                Attendance for {currentSeance?.title}
              </h2>

              {/* Attendance Table */}
              <table className="w-full border-collapse border mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Student</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a, i) => {
                    const student = students.find((s) => s.userId === a.userId);
                    return (
                      <tr key={i}>
                        <td className="border p-2">
                          {student
                            ? `${student.firstName} ${student.lastName}`
                            : a.userId}
                        </td>
                        <td className="border p-2">{a.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Add attendance */}
              <div className="flex gap-2 mb-4">
                <select
                  value={newAttendance.userId}
                  onChange={(e) =>
                    setNewAttendance({
                      ...newAttendance,
                      userId: e.target.value,
                    })
                  }
                  className="border p-2 rounded flex-1"
                >
                  <option value="">Select Student</option>
                  {students.map((s) => (
                    <option key={s.userId} value={s.userId}>
                      {s.firstName} {s.lastName}
                    </option>
                  ))}
                </select>

                <select
                  value={newAttendance.status}
                  onChange={(e) =>
                    setNewAttendance({
                      ...newAttendance,
                      status: e.target.value,
                    })
                  }
                  className="border p-2 rounded"
                >
                  <option value="PRESENT">PRESENT</option>
                  <option value="ABSENT">ABSENT</option>
                </select>

                <button
                  onClick={handleAddAttendance}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Add
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setAttendanceDialog(false)}
                  className="px-4 py-2 bg-gray-400 rounded"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
