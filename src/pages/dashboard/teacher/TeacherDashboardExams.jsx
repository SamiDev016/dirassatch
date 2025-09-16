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
  getExamById,
  getAllGradsByUser,
  getUserData,
  getExamsByGroup,
} from "../../../utils/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Plus,
  Edit,
  Trash,
  Award,
  X,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";

export default function TeacherDashboardExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [teacherGroups, setTeacherGroups] = useState([]);
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    dateTime: "",
    duration: "",
    groupId: "",
  });

  // Grades modal state
  const [showGradesModal, setShowGradesModal] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({}); // { userId: grade }

  useEffect(() => {
    const initializeData = async () => {
      console.log('🚀 Starting initialization...');
      console.log('🚀 Initial teacherGroups state:', teacherGroups);
      
      await fetchUserData();
      console.log('🚀 After fetchUserData, teacherGroups:', teacherGroups);
      
      await fetchCourses();
      console.log('🚀 After fetchCourses, teacherGroups:', teacherGroups);
      
      // Don't call fetchExams here, let the useEffect handle it
      console.log('🚀 Initialization complete, waiting for teacherGroups useEffect');
    };
    
    initializeData();
  }, []);

  // Refetch exams when teacherGroups change
  useEffect(() => {
    console.log('🔄 teacherGroups useEffect triggered. Current teacherGroups:', teacherGroups);
    console.log('🔄 teacherGroups length:', teacherGroups.length);
    if (teacherGroups.length > 0) {
      console.log('🔄 Calling fetchExams from teacherGroups useEffect');
      fetchExams();
    } else {
      console.log('🔄 teacherGroups is empty, not calling fetchExams');
    }
  }, [teacherGroups]);

  async function fetchExams() {
    setLoading(true);
    console.log('🔍 fetchExams called. Teacher Groups:', teacherGroups);
    
    // If we have teacher groups, fetch exams for each teacher group
    if (teacherGroups.length > 0) {
      const allExams = [];
      
      // Fetch exams for each teacher group
      for (const group of teacherGroups) {
        console.log(`🔍 Fetching exams for teacher group: ${group.name} (ID: ${group.id})`);
        const groupExams = await getExamsByGroup({ groupId: group.id });
        console.log(`🔍 Exams for group ${group.name}:`, groupExams);
        if (groupExams && Array.isArray(groupExams)) {
          // Add group information to each exam
          const examsWithGroupInfo = groupExams.map(exam => ({
            ...exam,
            group: group
          }));
          allExams.push(...examsWithGroupInfo);
        }
      }
      
      console.log('🔍 Final exams list:', allExams);
      setExams(allExams);
    } else {
      console.log('🔍 No teacher groups found, falling back to all exams');
      // Fallback to all exams if no teacher groups found
      const result = await getAllExams();
      if (result) setExams(result);
    }
    
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

  async function fetchUserData() {
    console.log('🔍 Starting fetchUserData...');
    const result = await getUserData();
    if (result) {
      console.log('🔍 User Data:', result);
      console.log('🔍 All Groups:', result.groups);
      
      // Log each group with its role for debugging
      if (result.groups) {
        result.groups.forEach((group, index) => {
          console.log(`🔍 Group ${index + 1}:`, {
            id: group.id,
            name: group.name,
            role: group.role,
            course: group.course?.name || 'No course'
          });
        });
      }
      
      setUserData(result);
      
      // Filter groups where user is a teacher
      const teacherGroupsList = result.groups.filter(group => group.role === 'TEACHER');
      console.log('🔍 Filtered Teacher Groups Only:', teacherGroupsList);
      console.log('🔍 Number of teacher groups:', teacherGroupsList.length);
      
      // Log the filtering result
      teacherGroupsList.forEach((group, index) => {
        console.log(`🔍 Teacher Group ${index + 1}:`, {
          id: group.id,
          name: group.name,
          role: group.role,
          course: group.course?.name || 'No course'
        });
      });
      
      setTeacherGroups(teacherGroupsList);
    } else {
      console.log('🔍 No user data returned from getUserData');
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function openForm(exam = null) {
    if (exam) {
      setEditingExam(exam);
      setFormData({
        name: exam.name,
        dateTime: exam.dateTime?.slice(0, 16),
        duration: exam.duration,
        groupId: exam.groupId,
      });
    } else {
      setEditingExam(null);
      setFormData({ name: "", dateTime: "", duration: "", groupId: "" });
    }
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const isoDate = new Date(formData.dateTime).toISOString();

    const payload = {
      name: formData.name,
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

    // Get all students in the group
    const groupMembers = await getAllMembersOfGroup({ groupId: exam.groupId });
    const studentsInGroup = groupMembers.filter((m) => m.role === "STUDENT");
    setStudents(studentsInGroup);

    // Get exam details with existing grades (single API call)
    const examDetails = await getExamById({ examId: exam.id });
    
    // Initialize grades with empty values
    const initialGrades = {};
    
    // Set existing grades from the exam details
    if (examDetails?.grade) {
      examDetails.grade.forEach(gradeRecord => {
        initialGrades[gradeRecord.userId] = gradeRecord.grade;
      });
    }
    
    // Fill in empty grades for students without grades
    studentsInGroup.forEach(student => {
      if (initialGrades[student.userId] === undefined) {
        initialGrades[student.userId] = "";
      }
    });
    
    setGrades(initialGrades);
  }

  function handleGradeChange(userId, value) {
    setGrades((prev) => ({ ...prev, [userId]: value }));
  }

  async function saveGrades() {
    let savedCount = 0;
    let errorCount = 0;
    
    console.log('🔍 Debug - grades object:', grades);
    console.log('🔍 Debug - grades keys:', Object.keys(grades));
    
    for (const userIdStr of Object.keys(grades)) {
      console.log('🔍 Debug - processing userIdStr:', userIdStr, 'type:', typeof userIdStr);
      const userId = Number(userIdStr); 
      console.log('🔍 Debug - converted userId:', userId, 'type:', typeof userId);
      const gradeValue = grades[userIdStr];
      console.log('🔍 Debug - gradeValue:', gradeValue, 'for userId:', userId);
      
      if (gradeValue === "" || gradeValue === null || gradeValue === undefined) {
        continue;
      }
      
      // Validate grade is a number between 0 and 20
      const numericGrade = Number(gradeValue);
      if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 20) {
        console.error(`Invalid grade for user ${userId}: ${gradeValue}`);
        errorCount++;
        continue;
      }
      
      console.log('🔍 Debug - sending grade as number:', numericGrade, 'type:', typeof numericGrade);
      
      const result = await updateOrCreateGradeForUser({
        examId: currentExam.id,
        UserId: userId, // Send as number (API expects UserId with capital U)
        grade: numericGrade, // Send as number (API expects number, not string)
      });
      
      if (result) {
        savedCount++;
      } else {
        errorCount++;
      }
    }
    
    // Show feedback to user
    if (errorCount === 0) {
      alert(`Successfully saved ${savedCount} grades!`);
    } else {
      alert(`Saved ${savedCount} grades. ${errorCount} errors occurred.`);
    }
    
    setShowGradesModal(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" /> Exams Management
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Schedule and manage exams, track student performance, and organize assessments for your courses.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex flex-col justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" /> Exam Schedule
          </h2>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Exam
          </button>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Loading exams...</p>
          </div>
        ) : exams.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No exams found. Create your first exam to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exams.map((exam) => (
                  <motion.tr
                    key={exam.id}
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{exam.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <BookOpen className="w-3 h-3" />
                        Course: {exam.group?.courseId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {exam.dateTime ? new Date(exam.dateTime).toLocaleDateString() : "N/A"}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-green-500" />
                        {exam.dateTime ? new Date(exam.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-500" />
                        {exam.duration} minutes
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        {exam.group?.name || exam.groupId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openForm(exam)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(exam.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash className="w-3 h-3" /> Delete
                        </button>
                        <button
                          onClick={() => openGradesModal(exam)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        >
                          <Award className="w-3 h-3" /> Grades
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
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {editingExam ? "Edit Exam" : "Add Exam"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exam Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter exam name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="dateTime"
                      value={formData.dateTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter duration"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Group
                    </label>
                    <select
                      name="groupId"
                      value={formData.groupId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">Select Group</option>
                      {teacherGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name} ({group.course?.name || 'Course'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    {editingExam ? "Update Exam" : "Create Exam"}
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
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Grade Management
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Exam: {currentExam?.name} • Group: {currentExam?.group?.name || 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => setShowGradesModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Stats Summary */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {students.length}
                    </div>
                    <div className="text-xs text-gray-500">Total Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.values(grades).filter(g => g !== "" && g !== null && g !== undefined).length}
                    </div>
                    <div className="text-xs text-gray-500">Graded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {students.length - Object.values(grades).filter(g => g !== "" && g !== null && g !== undefined).length}
                    </div>
                    <div className="text-xs text-gray-500">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {(() => {
                        const validGrades = Object.values(grades).filter(g => g !== "" && g !== null && g !== undefined && !isNaN(Number(g)));
                        const count = validGrades.length;
                        if (count === 0) return '0.0';
                        const sum = validGrades.reduce((a, b) => a + Number(b), 0);
                        return (sum / count).toFixed(1);
                      })()}
                    </div>
                    <div className="text-xs text-gray-500">Average</div>
                  </div>
                </div>
              </div>
              
              {/* Grades Table */}
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {students.map((student) => {
                        const grade = grades[student.userId] || "";
                        const hasGrade = grade !== "" && grade !== null && grade !== undefined;
                        const gradeNumber = Number(grade);
                        
                        return (
                          <tr key={student.userId} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-blue-600">
                                    {student.firstName?.[0]}{student.lastName?.[0]}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {student.firstName} {student.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {student.userId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="number"
                                value={grade}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow only valid numbers between 0 and 20
                                  if (value === '' || (Number(value) >= 0 && Number(value) <= 20)) {
                                    handleGradeChange(student.userId, value);
                                  }
                                }}
                                className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="0"
                                min="0"
                                max="20"
                                step="0.1"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              {hasGrade ? (
                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                  gradeNumber >= 16 ? 'bg-green-100 text-green-800' :
                                  gradeNumber >= 12 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  <CheckCircle className="w-3 h-3" />
                                  {gradeNumber >= 16 ? 'Excellent' :
                                   gradeNumber >= 12 ? 'Good' : 'Needs Work'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                  <XCircle className="w-3 h-3" />
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center gap-2">
                                {hasGrade && (
                                  <button
                                    onClick={() => handleGradeChange(student.userId, "")}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                  >
                                    <Trash className="w-3 h-3" /> Clear
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    {Object.values(grades).filter(g => g !== "" && g !== null && g !== undefined).length} of {students.length} students graded
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowGradesModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveGrades}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      Save All Grades
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
