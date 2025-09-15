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
  getAttendacesBySeance,
  createAttendance,
  getAllMembersOfGroup,
} from "../../../utils/auth";
import { 
  Calendar, 
  Clock, 
  Video, 
  Users, 
  MapPin, 
  BookOpen, 
  UserCheck, 
  Plus, 
  Edit, 
  Trash, 
  X,
  CheckCircle,
  XCircle
} from "lucide-react";

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" /> Seances Management
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Schedule and manage class sessions, track attendance, and organize your e-learning activities.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Class Sessions</h2>
          <button
            onClick={() => setOpenSeanceDialog(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Seance
          </button>
        </div>

        {seances.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No class sessions found. Create your first seance to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {seances.map((s) => (
                  <motion.tr
                    key={s.id}
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{s.title}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" />
                        Group: {s.groupId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {new Date(s.startsAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        {new Date(s.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} 
                        - 
                        {new Date(s.endsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                        s.mode === 'ONSITE' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {s.mode === 'ONSITE' ? <MapPin className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                        {s.mode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(s)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash className="w-3 h-3" /> Delete
                        </button>
                        <button
                          onClick={() => openAttendance(s)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        >
                          <UserCheck className="w-3 h-3" /> Attendance
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Seance Form Modal */}
      <AnimatePresence>
        {openSeanceDialog && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingId ? "Edit Seance" : "Create New Seance"}
                </h2>
                <button
                  onClick={() => {
                    setOpenSeanceDialog(false);
                    resetForm();
                    setEditingId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Title</label>
                    <input
                      type="text"
                      placeholder="Enter session title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                    <select
                      value={form.mode}
                      onChange={(e) => setForm({ ...form, mode: e.target.value })}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    >
                      <option value="ONSITE">On-site</option>
                      <option value="ONLINE">Online</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <select
                      value={form.courseId}
                      onChange={(e) => handleCourseChange(e.target.value)}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    >
                      <option value="">Select a course</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                    <select
                      value={form.groupId}
                      onChange={(e) => setForm({ ...form, groupId: e.target.value })}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      disabled={!form.courseId}
                    >
                      <option value="">Select a group</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                    <select
                      value={form.teacherId}
                      onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    >
                      <option value="">Select a teacher</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.firstName} {t.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                    <select
                      value={form.chapterId}
                      onChange={(e) => setForm({ ...form, chapterId: e.target.value })}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      disabled={!form.courseId}
                    >
                      <option value="">Select a chapter</option>
                      {chapters.map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          {ch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting URL (for online sessions)</label>
                  <input
                    type="url"
                    placeholder="https://meet.example.com/room"
                    value={form.meetingUrl}
                    onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    disabled={form.mode === 'ONSITE'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    placeholder="Additional notes or instructions"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenSeanceDialog(false);
                      resetForm();
                      setEditingId(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    {editingId ? "Update Seance" : "Create Seance"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    Attendance Management
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Session: {currentSeance?.title} | {new Date(currentSeance?.startsAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setAttendanceDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Stats Summary */}
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Present: <span className="font-medium">{attendance.filter(a => a.status === 'PRESENT').length}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Absent: <span className="font-medium">{attendance.filter(a => a.status === 'ABSENT').length}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Total: <span className="font-medium">{attendance.length}</span></span>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Attendance Table */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Current Attendance Records</h3>
                    {attendance.length === 0 ? (
                      <div className="text-center py-8">
                        <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No attendance records found. Add attendance for students below.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recorded At</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {attendance.map((a, i) => {
                              const student = students.find((s) => s.userId === a.userId);
                              return (
                                <tr key={i} className="hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-600">
                                          {student ? `${student.firstName[0]}${student.lastName[0]}` : '?'}
                                        </span>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {student ? `${student.firstName} ${student.lastName}` : `Student ${a.userId}`}
                                        </div>
                                        <div className="text-xs text-gray-500">ID: {a.userId}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                      a.status === 'PRESENT' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {a.status === 'PRESENT' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                      {a.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-500">
                                    {new Date(a.createdAt).toLocaleString()}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <button
                                      onClick={() => {
                                        // Remove attendance functionality would go here
                                        const updated = attendance.filter((_, idx) => idx !== i);
                                        setAttendance(updated);
                                      }}
                                      className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  
                  {/* Add New Attendance */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Attendance Record</h3>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <select
                          value={newAttendance.userId}
                          onChange={(e) =>
                            setNewAttendance({
                              ...newAttendance,
                              userId: e.target.value,
                            })
                          }
                          className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                        >
                          <option value="">Select Student</option>
                          {students
                            .filter(s => !attendance.some(a => a.userId === s.userId))
                            .map((s) => (
                              <option key={s.userId} value={s.userId}>
                                {s.firstName} {s.lastName} (ID: {s.userId})
                              </option>
                            ))}
                        </select>
                      </div>
                      
                      <div className="w-32">
                        <select
                          value={newAttendance.status}
                          onChange={(e) =>
                            setNewAttendance({
                              ...newAttendance,
                              status: e.target.value,
                            })
                          }
                          className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                        >
                          <option value="PRESENT">Present</option>
                          <option value="ABSENT">Absent</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={handleAddAttendance}
                        disabled={!newAttendance.userId}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Record
                      </button>
                    </div>
                    
                    {students.filter(s => !attendance.some(a => a.userId === s.userId)).length === 0 && (
                      <p className="text-xs text-gray-500 mt-2">All students have been marked for attendance.</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Last updated: {new Date().toLocaleString()}
                  </div>
                  <button
                    onClick={() => setAttendanceDialog(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Close Attendance
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
