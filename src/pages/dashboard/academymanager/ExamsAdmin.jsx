import { useEffect, useState } from "react";
import {
  getAllExams,
  createExam,
  updateExam,
  deleteExam,
  getGroupsByCourse,
  getCoursesByAcademy,
  getAllMembersOfGroup,
  updateOrCreateGradeForUser,
} from "../../../utils/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function ExamsAdmin() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    dateTime: "",
    duration: "",
    courseId: "",
    groupId: "",
  });

  // Grades modal state
  const [showGradesModal, setShowGradesModal] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({}); // { userId: grade }

  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, []);

  async function fetchExams() {
    setLoading(true);
    const result = await getAllExams();
    if (result) setExams(result);
    setLoading(false);
  }

  async function fetchCourses() {
    const result = await getCoursesByAcademy({ academyId: 1 });
    if (result) setCourses(result);
  }

  async function fetchGroups(courseId) {
    const result = await getGroupsByCourse({ courseId });
    if (result) setGroups(result);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "courseId") {
      fetchGroups(value);
      setFormData((prev) => ({ ...prev, groupId: "" }));
    }
  }

  function openForm(exam = null) {
    if (exam) {
      setEditingExam(exam);
      setFormData({
        name: exam.name,
        dateTime: exam.dateTime?.slice(0, 16),
        duration: exam.duration,
        courseId: exam.group?.courseId || "",
        groupId: exam.groupId,
      });
      if (exam.group?.courseId) fetchGroups(exam.group.courseId);
    } else {
      setEditingExam(null);
      setFormData({ name: "", dateTime: "", duration: "", courseId: "", groupId: "" });
    }
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const isoDate = new Date(formData.dateTime).toISOString();

    const payload = {
      ...formData,
      dateTime: isoDate,
      duration: Number(formData.duration),
      groupId: Number(formData.groupId),
    };

    console.log("🚀 Submitting Exam:", payload);

    if (editingExam) {
      await updateExam({ examId: editingExam.id, ...payload });
    } else {
      await createExam(payload);
    }

    setShowForm(false);
    fetchExams();
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    await deleteExam({ examId: id });
    fetchExams();
  }

  // --- Grades Management ---

  async function openGradesModal(exam) {
    setCurrentExam(exam);
    setShowGradesModal(true);

    if (!exam.groupId) return;

    const groupMembers = await getAllMembersOfGroup({ groupId: exam.groupId });
    setStudents(groupMembers.filter((m) => m.role === "STUDENT"));

    const initialGrades = {};
    groupMembers.forEach((s) => {
      initialGrades[s.userId] = s.grade?.value || "";
    });
    setGrades(initialGrades);
  }

  function handleGradeChange(userId, value) {
    setGrades((prev) => ({ ...prev, [userId]: value }));
  }

  async function saveGrades() {
    for (const userId of Object.keys(grades)) {
      const gradeValue = Number(grades[userId]);
      await updateOrCreateGradeForUser({
        examId: currentExam.id,
        UserId: userId,
        grade: gradeValue,
      });
    }
    setShowGradesModal(false);
  }

  return (
    <div className="p-6">
      <motion.h1
        className="text-3xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Exams Management
      </motion.h1>

      <button
        onClick={() => openForm()}
        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
      >
        + Add Exam
      </button>

      {loading ? (
        <p>Loading exams...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Duration</th>
                <th className="p-3 border">Group</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <motion.tr
                  key={exam.id}
                  className="hover:bg-gray-50 transition"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="border p-3">{exam.name}</td>
                  <td className="border p-3">
                    {exam.dateTime ? new Date(exam.dateTime).toLocaleString() : "N/A"}
                  </td>
                  <td className="border p-3">{exam.duration} mins</td>
                  <td className="border p-3">{exam.group?.name || exam.groupId}</td>
                  <td className="border p-3 space-x-2">
                    <button
                      onClick={() => openForm(exam)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openGradesModal(exam)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                      Grades
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Exam Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4">
                {editingExam ? "Edit Exam" : "Add Exam"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Course</label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Group</label>
                  <select
                    name="groupId"
                    value={formData.groupId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Group</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    {editingExam ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grades Modal */}
      <AnimatePresence>
        {showGradesModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4">
                Grades for {currentExam?.name}
              </h2>

              {students.map((s) => (
                <div key={s.userId} className="flex items-center justify-between mb-2">
                  <span>{s.firstName} {s.lastName}</span>
                  <input
                    type="number"
                    value={grades[s.userId] || ""}
                    onChange={(e) => handleGradeChange(s.userId, e.target.value)}
                    className="w-20 p-1 border rounded"
                  />
                </div>
              ))}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowGradesModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveGrades}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Save Grades
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
