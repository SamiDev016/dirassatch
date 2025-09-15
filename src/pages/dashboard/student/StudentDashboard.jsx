import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, Calendar, BookOpen, Users, Clock, Award, 
  MapPin, Video, CheckCircle, XCircle, AlertCircle, 
  TrendingUp, GraduationCap, Eye, FileText
} from "lucide-react";
import { 
  getUserData, 
  getSeanceByGroup, 
  getAttendanceBySeanceUser, 
  getExamsByGroup, 
  getAllGradsByUser
} from "../../../utils/auth";

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seances, setSeances] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [exams, setExams] = useState([]);
  const [grades, setGrades] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalGroups: 0,
    totalSeances: 0,
    totalExams: 0,
    attendanceRate: 0,
    averageGrade: 0
  });

  // Debug: Check what's in localStorage
  const debugLocalStorage = () => {
    console.log('=== DEBUG: LocalStorage Contents ===');
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    console.log('user:', user);
    console.log('token:', token);
    console.log('user parsed:', user ? JSON.parse(user) : null);
    return { user, token };
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      // Debug: Check localStorage contents
      const { user, token } = debugLocalStorage();
      
      if (!token) {
        console.error('DEBUG: No token found in localStorage');
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('DEBUG: Attempting to fetch user data...');
        
        // Fetch student data using getUserData (no ID needed)
        const student = await getUserData();
        console.log('DEBUG: Student data response:', student);
        
        if (!student) {
          console.error('DEBUG: Failed to fetch student data');
          setError('Failed to fetch student data');
          setLoading(false);
          return;
        }
        
        setStudentData(student);
        
        // Calculate basic stats
        const studentGroups = student.groups?.filter(g => g.role === 'STUDENT') || [];
        const totalCourses = new Set(studentGroups.map(g => g.course?.id)).size;
        
        setStats(prev => ({
          ...prev,
          totalCourses,
          totalGroups: studentGroups.length
        }));
        
        // Fetch seances for each group
        const allSeances = [];
        
        for (const group of studentGroups) {
          const groupSeances = await getSeanceByGroup({ groupId: group.id });
          if (groupSeances) {
            allSeances.push(...groupSeances);
          }
          
          // For now, we'll assume exams are part of the group data
          // In a real implementation, you might need a getExamsByGroup function
        }
        
        setSeances(allSeances);
        setStats(prev => ({
          ...prev,
          totalSeances: allSeances.length
        }));
        
        // Fetch attendance for each seance
        const attendanceRecords = {};
        let presentCount = 0;
        let totalAttendanceRecords = 0;
        
        console.log('DEBUG: Fetching attendance for', allSeances.length, 'seances');
        
        for (const seance of allSeances) {
          try {
            const attendanceRecord = await getAttendanceBySeanceUser({ 
              seanceId: seance.id, 
              userId: student.id 
            });
            
            console.log('DEBUG: Attendance for seance', seance.id, ':', attendanceRecord);
            
            if (attendanceRecord) {
              attendanceRecords[seance.id] = attendanceRecord;
              totalAttendanceRecords++;
              if (attendanceRecord.status === 'PRESENT') {
                presentCount++;
              }
            }
            // If attendanceRecord is null, it means no attendance record exists - this is normal
          } catch (error) {
            console.log('DEBUG: No attendance record for seance', seance.id, '- this is normal');
            // No attendance record exists for this seance/user - this is normal
          }
        }
        
        setAttendance(attendanceRecords);
        
        // Calculate attendance rate
        // Use totalAttendanceRecords (seances with attendance data) instead of allSeances
        const attendanceRate = totalAttendanceRecords > 0 
          ? Math.round((presentCount / totalAttendanceRecords) * 100) 
          : 0;
        
        console.log('DEBUG: Attendance stats:', {
          totalSeances: allSeances.length,
          totalAttendanceRecords,
          presentCount,
          attendanceRate
        });
        
        setStats(prev => ({
          ...prev,
          attendanceRate
        }));
        
        // Fetch exam data for each group
        const allExams = [];
        
        console.log('DEBUG: Fetching exams for', studentGroups.length, 'groups');
        
        for (const group of studentGroups) {
          try {
            const groupExams = await getExamsByGroup({ groupId: group.id });
            if (groupExams) {
              allExams.push(...groupExams);
              console.log('DEBUG: Found', groupExams.length, 'exams for group', group.id);
            }
          } catch (error) {
            console.log('DEBUG: No exams for group', group.id, '- this is normal');
          }
        }
        
        setExams(allExams);
        
        // Fetch grades for the student
        let studentGrades = [];
        try {
          studentGrades = await getAllGradsByUser({ userId: student.id });
          console.log('DEBUG: Student grades:', studentGrades);
        } catch (error) {
          console.log('DEBUG: No grades found for student', student.id, '- this is normal');
        }
        
        setGrades(studentGrades);
        
        // Calculate average grade from student's grades
        const averageGrade = studentGrades.length > 0 
          ? Math.round(studentGrades.reduce((sum, grade) => sum + (grade.grade || 0), 0) / studentGrades.length)
          : 0;
        
        console.log('DEBUG: Exam and grade stats:', {
          totalExams: allExams.length,
          totalGrades: studentGrades.length,
          averageGrade
        });
        
        setStats(prev => ({
          ...prev,
          totalExams: allExams.length,
          averageGrade
        }));
        
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Get upcoming seances (next 7 days)
  const getUpcomingSeances = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return seances
      .filter(seance => {
        const seanceDate = new Date(seance.startsAt);
        return seanceDate >= now && seanceDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  };

  // Get attendance status for a seance
  const getAttendanceStatus = (seanceId) => {
    const record = attendance[seanceId];
    if (!record) return null;
    return record.status;
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-blue-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const upcomingSeances = getUpcomingSeances();
  const studentGroups = studentData?.groups?.filter(g => g.role === 'STUDENT') || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-600">
          Student Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {studentData?.firstName} {studentData?.lastName}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Courses</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalCourses}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Groups</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalGroups}</p>
            </div>
            <Users className="w-8 h-8 text-green-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sessions</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalSeances}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Exams</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.totalExams}</p>
            </div>
            <FileText className="w-8 h-8 text-indigo-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.attendanceRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Grade</p>
              <p className="text-2xl font-bold text-red-600">{stats.averageGrade || '-'}</p>
            </div>
            <Award className="w-8 h-8 text-red-100" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Profile
            </h2>
            
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl mx-auto mb-4">
                {studentData?.firstName?.charAt(0)}{studentData?.lastName?.charAt(0)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {studentData?.firstName} {studentData?.lastName}
              </h3>
              <p className="text-sm text-gray-500 flex items-center justify-center mt-1">
                <Mail className="w-4 h-4 mr-1" />
                {studentData?.account?.email}
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Student ID</span>
                <span className="font-medium">#{studentData?.id}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="font-medium">
                  {new Date(studentData?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Upcoming Sessions
            </h2>
            
            {upcomingSeances.length > 0 ? (
              <div className="space-y-4">
                {upcomingSeances.slice(0, 5).map((seance) => {
                  const attendanceStatus = getAttendanceStatus(seance.id);
                  return (
                    <div key={seance.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{seance.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{seance.chapter?.name}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(seance.startsAt)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatTime(seance.startsAt)}
                            </span>
                            <span className="flex items-center">
                              {seance.mode === 'ONSITE' ? (
                                <MapPin className="w-4 h-4 mr-1" />
                              ) : (
                                <Video className="w-4 h-4 mr-1" />
                              )}
                              {seance.mode}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {attendanceStatus === 'PRESENT' && (
                            <span className="flex items-center text-green-600 text-sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Present
                            </span>
                          )}
                          {attendanceStatus === 'ABSENT' && (
                            <span className="flex items-center text-red-600 text-sm">
                              <XCircle className="w-4 h-4 mr-1" />
                              Absent
                            </span>
                          )}
                          {attendanceStatus === 'LATE' && (
                            <span className="flex items-center text-yellow-600 text-sm">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Late
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming sessions</p>
              </div>
            )}
          </motion.div>

          {/* Courses & Groups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
              My Courses & Groups
            </h2>
            
            {studentGroups.length > 0 ? (
              <div className="space-y-4">
                {studentGroups.map((group, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{group.course?.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{group.name}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {group.course?.academy?.name}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                            {group.role}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">Group</span>
                        <p className="font-medium text-blue-600">{group.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No courses enrolled</p>
              </div>
            )}
          </motion.div>

          {/* Exams & Grades */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Exams & Grades
            </h2>
            
            {grades.length > 0 ? (
              <div className="space-y-4">
                {grades.map((grade, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{grade.exam?.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(grade.exam?.dateTime).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{grade.grade}/20</div>
                        <div className="text-sm text-gray-500">
                          {grade.grade >= 16 ? 'Excellent' : 
                           grade.grade >= 14 ? 'Good' : 
                           grade.grade >= 10 ? 'Pass' : 'Needs Work'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No exams or grades available</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}