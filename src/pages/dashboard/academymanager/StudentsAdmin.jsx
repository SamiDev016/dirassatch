
import { useState, useEffect } from "react";
import { getStudentsByAcademy, getGroupByID, getSeanceByGroup, getAttendacesByUser, getExamsByGroup, getAllGradsByUser } from "../../../utils/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentsAdmin() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      const academyId = localStorage.getItem("selectedAcademyId");
      console.log("🔵 [StudentsAdmin] academyId:", academyId);

      if (!academyId) {
        setError("No academy selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getStudentsByAcademy({ academyId });
        console.log("🔵 getStudentsByAcademy response:", data);

        if (data && Array.isArray(data)) {
          const studentsWithGroups = await Promise.all(
            data.map(async (s) => {
              console.log(`🔹 [Student] ${s.firstName} ${s.lastName}`, s.group);

              // Extract userGroups from group
              const userGroups = s.group?.userGroups || [];
              console.log(`   📦 userGroups for ${s.firstName}:`, userGroups);

              // Fetch each group name
              const groupNames = await Promise.all(
                userGroups.map(async (ug) => {
                  console.log(`   🟡 Fetching groupId ${ug.groupId} for ${s.firstName}`);
                  const groupData = await getGroupByID({ id: ug.groupId });
                  console.log(`   🟢 Group fetched for ${s.firstName}:`, groupData);
                  return groupData?.name || "Unknown Group";
                })
              );

              console.log(`   ✅ Final group names for ${s.firstName}:`, groupNames);

              return { ...s, groupNames };
            })
          );

          setStudents(studentsWithGroups);
          console.log("🟢 [StudentsAdmin] Final Students with Groups:", studentsWithGroups);
        } else {
          setError("No students found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const toggleStudentDetails = async (studentId) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
      return;
    }

    setExpandedStudent(studentId);
    
    // If we haven't fetched details for this student yet, fetch them
    if (!studentDetails[studentId]) {
      await fetchStudentDetails(studentId);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student || !student.group?.userGroups) return;

      const allSeances = [];
      const allGrades = [];

      // Fetch seances and exams for each group
      for (const userGroup of student.group.userGroups) {
        const groupId = userGroup.groupId;
        
        // Fetch seances
        const seances = await getSeanceByGroup({ groupId });
        if (seances && Array.isArray(seances)) {
          // Fetch attendance for each seance
          const seancesWithAttendance = await Promise.all(
            seances.map(async (seance) => {
              const attendance = await getAttendacesByUser({ userId: studentId });
              const userAttendance = attendance?.find(a => a.seanceId === seance.id);
              return {
                ...seance,
                status: userAttendance?.status || 'not_recorded'
              };
            })
          );
          allSeances.push(...seancesWithAttendance);
        }

        // Fetch exams
        const exams = await getExamsByGroup({ groupId });
        if (exams && Array.isArray(exams)) {
          // Fetch grades for each exam
          const grades = await getAllGradsByUser({ userId: studentId });
          const examsWithGrades = exams.map(exam => {
            const grade = grades?.find(g => g.examId === exam.id);
            return {
              examName: exam.name || 'Exam',
              date: exam.date || new Date(),
              score: grade?.score || null
            };
          });
          allGrades.push(...examsWithGrades);
        }
      }

      setStudentDetails(prev => ({
        ...prev,
        [studentId]: {
          seances: allSeances,
          grades: allGrades
        }
      }));

      console.log(`📊 [StudentDetails] Fetched details for student ${studentId}:`, { seances: allSeances, grades: allGrades });
    } catch (error) {
      console.error(`Error fetching details for student ${studentId}:`, error);
    }
  };

  if (loading) return <p>Loading students...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Students Admin
        </h1>
        <p className="text-gray-600">Manage and view student information, attendance, and grades</p>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-left">
              <th className="p-4 border-b-2 border-gray-200 font-semibold text-gray-700">Student</th>
              <th className="p-4 border-b-2 border-gray-200 font-semibold text-gray-700">Groups</th>
              <th className="p-4 border-b-2 border-gray-200 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {students.map((s) => (
                <motion.tr
                  key={s.id}
                  className="hover:bg-gray-50 transition"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Student Name */}
                  <td className="border-b border-gray-100 p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {s.firstName?.charAt(0)}{s.lastName?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{s.firstName} {s.lastName}</div>
                        <div className="text-sm text-gray-500">ID: {s.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Groups */}
                  <td className="border-b border-gray-100 p-4">
                    <div className="flex flex-wrap gap-2">
                      {s.groupNames?.map((groupName, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {groupName}
                        </span>
                      )) || (
                        <span className="text-gray-500 italic">No groups assigned</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="border p-3">
                    <button
                      onClick={() => toggleStudentDetails(s.id)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      {expandedStudent === s.id ? 'Hide Details' : 'Show Details'}
                    </button>
                  </td>
                </motion.tr>
              ))}
              
              {/* Detail Tables Row */}
              <AnimatePresence>
                {expandedStudent && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td colSpan="3" className="p-0 border-0">
                      <div className="bg-gray-50 p-6 border-t-2 border-blue-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Seances Table */}
                          <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4">
                              <h3 className="text-lg font-semibold flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Seances & Attendance
                              </h3>
                            </div>
                            <div className="p-4">
                              {studentDetails[expandedStudent]?.seances ? (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-gray-100">
                                        <th className="p-2 text-left border">Date</th>
                                        <th className="p-2 text-left border">Course</th>
                                        <th className="p-2 text-left border">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {studentDetails[expandedStudent].seances.map((seance, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                          <td className="p-2 border">{new Date(seance.date).toLocaleDateString()}</td>
                                          <td className="p-2 border">{seance.courseName || 'N/A'}</td>
                                          <td className="p-2 border">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${seance.status === 'present' ? 'bg-green-100 text-green-800' : seance.status === 'absent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                              {seance.status || 'N/A'}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-gray-500 text-center py-4">Loading seances data...</p>
                              )}
                            </div>
                          </div>

                          {/* Exams & Grades Table */}
                          <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
                              <h3 className="text-lg font-semibold flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Exams & Grades
                              </h3>
                            </div>
                            <div className="p-4">
                              {studentDetails[expandedStudent]?.grades ? (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-gray-100">
                                        <th className="p-2 text-left border">Exam</th>
                                        <th className="p-2 text-left border">Date</th>
                                        <th className="p-2 text-left border">Grade</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {studentDetails[expandedStudent].grades.map((grade, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                          <td className="p-2 border">{grade.examName || 'N/A'}</td>
                                          <td className="p-2 border">{new Date(grade.date).toLocaleDateString()}</td>
                                          <td className="p-2 border">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${grade.score >= 10 ? 'bg-green-100 text-green-800' : grade.score >= 7 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                              {grade.score || 'N/A'}/20
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-gray-500 text-center py-4">Loading grades data...</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
