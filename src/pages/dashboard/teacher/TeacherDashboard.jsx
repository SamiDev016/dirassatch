import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, Calendar, BookOpen, Users, Clock, Award, 
  MapPin, Video, CheckCircle, XCircle, AlertCircle, 
  TrendingUp, GraduationCap, Eye, FileText, UserCheck,
  BarChart3, Target, CalendarDays
} from "lucide-react";
import { 
  getUserData, 
  getSeanceByGroup, 
  getExamsByGroup,
  getCoursesByAcademy,
  getGroupsByCourse,
  getAllMembersOfGroup
} from "../../../utils/auth";

export default function TeacherDashboard() {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seances, setSeances] = useState([]);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalGroups: 0,
    totalSeances: 0,
    totalExams: 0,
    totalStudents: 0,
    upcomingSeances: 0
  });

  // Debug: Check what's in localStorage
  const debugLocalStorage = () => {
    console.log('=== DEBUG: Teacher LocalStorage Contents ===');
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    console.log('user:', user);
    console.log('token:', token);
    console.log('user parsed:', user ? JSON.parse(user) : null);
    return { user, token };
  };

  // Enhanced debugging for data fetching
  const debugDataFetch = (step, data) => {
    console.log(`=== DEBUG: ${step} ===`);
    console.log('Data:', data);
    console.log('Type:', typeof data);
    console.log('Length:', Array.isArray(data) ? data.length : 'N/A');
    if (Array.isArray(data) && data.length > 0) {
      console.log('First item:', data[0]);
    }
  };

  useEffect(() => {
    const fetchTeacherData = async () => {
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
        console.log('DEBUG: Attempting to fetch teacher data...');
        
        // Fetch teacher data using getUserData
        const teacher = await getUserData();
        console.log('DEBUG: Teacher data response:', teacher);
        
        if (!teacher) {
          console.error('DEBUG: Failed to fetch teacher data');
          setError('Failed to fetch teacher data');
          setLoading(false);
          return;
        }
        
        setTeacherData(teacher);
        debugDataFetch('Full teacher data', teacher);
        
        // Get teacher's groups and courses
        console.log('DEBUG: Raw teacher.groups:', teacher.groups);
        console.log('DEBUG: Teacher groups type:', typeof teacher.groups);
        console.log('DEBUG: Teacher groups length:', Array.isArray(teacher.groups) ? teacher.groups.length : 'N/A');
        
        if (teacher.groups && Array.isArray(teacher.groups)) {
          teacher.groups.forEach((group, index) => {
            console.log(`DEBUG: Group ${index}:`, group);
            console.log(`DEBUG: Group ${index} role:`, group.role);
            console.log(`DEBUG: Group ${index} name:`, group.name);
          });
        }
        
        const teacherGroups = teacher.groups?.filter(g => g.role === 'TEACHER') || [];
        console.log('DEBUG: Filtered TEACHER groups:', teacherGroups);
        debugDataFetch('Teacher groups', teacherGroups);
        
        const teacherCourses = teacherGroups.map(g => g.course).filter(Boolean);
        const uniqueCourses = Array.from(new Map(teacherCourses.map(course => [course.id, course])).values());
        debugDataFetch('Teacher courses', uniqueCourses);
        
        setCourses(uniqueCourses);
        setGroups(teacherGroups);
        
        // Fetch actual student counts for each group
        let totalStudents = 0;
        const groupsWithStudentCounts = [];
        
        console.log('DEBUG: Starting to fetch student counts for', teacherGroups.length, 'groups');
        
        for (const group of teacherGroups) {
          console.log(`DEBUG: Processing group ${group.id} (${group.name}) for student count`);
          try {
            const members = await getAllMembersOfGroup({ groupId: group.id });
            console.log(`DEBUG: Members for group ${group.name}:`, members);
            
            const students = members?.filter(m => m.role === 'STUDENT') || [];
            const studentCount = students.length;
            
            groupsWithStudentCounts.push({
              ...group,
              studentCount,
              students
            });
            
            totalStudents += studentCount;
            
            console.log(`DEBUG: Group ${group.name} has ${studentCount} students:`, students.map(s => s.userId));
          } catch (error) {
            console.error(`DEBUG: Error fetching students for group ${group.id}:`, error);
            groupsWithStudentCounts.push({
              ...group,
              studentCount: 0,
              students: []
            });
          }
        }
        
        setGroups(groupsWithStudentCounts);
        debugDataFetch('Groups with student counts', groupsWithStudentCounts);
        
        setStats(prev => ({
          ...prev,
          totalCourses: uniqueCourses.length,
          totalGroups: teacherGroups.length,
          totalStudents
        }));
        
        // Fetch seances for each group
        const allSeances = [];
        
        console.log('DEBUG: Starting to fetch seances for', teacherGroups.length, 'groups');
        
        for (const group of teacherGroups) {
          try {
            console.log(`DEBUG: Fetching seances for group ${group.id} (${group.name})`);
            const groupSeances = await getSeanceByGroup({ groupId: group.id });
            console.log(`DEBUG: Raw seances response for group ${group.name}:`, groupSeances);
            debugDataFetch(`Seances for group ${group.name}`, groupSeances);
            
            if (groupSeances && Array.isArray(groupSeances)) {
              console.log(`DEBUG: Adding ${groupSeances.length} seances from group ${group.name}`);
              allSeances.push(...groupSeances);
            } else {
              console.log(`DEBUG: No valid seances array for group ${group.name}`);
            }
          } catch (error) {
            console.error(`DEBUG: Error fetching seances for group ${group.id}:`, error);
          }
        }
        
        setSeances(allSeances);
        debugDataFetch('All seances', allSeances);
        
        // Calculate upcoming seances (next 7 days)
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        console.log('DEBUG: Date filtering - now:', now, 'nextWeek:', nextWeek);
        
        const upcomingSeances = allSeances.filter(seance => {
          const seanceDate = new Date(seance.startsAt);
          console.log('DEBUG: Seance date check:', seance.title, seanceDate, '>=', now, '=', seanceDate >= now, '<=', nextWeek, '=', seanceDate <= nextWeek);
          return seanceDate >= now && seanceDate <= nextWeek;
        });
        
        debugDataFetch('Upcoming seances (next 7 days)', upcomingSeances);
        
        // Fetch exams for each group
        const allExams = [];
        
        for (const group of teacherGroups) {
          try {
            console.log(`DEBUG: Fetching exams for group ${group.id} (${group.name})`);
            const groupExams = await getExamsByGroup({ groupId: group.id });
            debugDataFetch(`Exams for group ${group.name}`, groupExams);
            
            if (groupExams && Array.isArray(groupExams)) {
              allExams.push(...groupExams);
            }
          } catch (error) {
            console.error(`DEBUG: Error fetching exams for group ${group.id}:`, error);
          }
        }
        
        setExams(allExams);
        debugDataFetch('All exams', allExams);
        
        setStats(prev => ({
          ...prev,
          totalSeances: allSeances.length,
          totalExams: allExams.length,
          upcomingSeances: upcomingSeances.length
        }));
        
      } catch (err) {
        console.error('Error fetching teacher data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  // Get upcoming seances (next 7 days)
  const getUpcomingSeances = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return seances.filter(seance => {
      const seanceDate = new Date(seance.startsAt);
      return seanceDate >= now && seanceDate <= nextWeek;
    }).sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  };

  // Get upcoming exams (next 30 days)
  const getUpcomingExams = () => {
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return exams.filter(exam => {
      const examDate = new Date(exam.dateTime);
      return examDate >= now && examDate <= nextMonth;
    }).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <UserCheck className="w-8 h-8 mr-3 text-blue-600" />
          Teacher Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {teacherData?.firstName}! Here's your teaching overview.
        </p>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
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
              <p className="text-sm text-gray-600">Students</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalStudents}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-purple-100" />
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
              <p className="text-sm text-gray-600">Sessions</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalSeances}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-100" />
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
              <p className="text-sm text-gray-600">Exams</p>
              <p className="text-2xl font-bold text-red-600">{stats.totalExams}</p>
            </div>
            <FileText className="w-8 h-8 text-red-100" />
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
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.upcomingSeances}</p>
            </div>
            <CalendarDays className="w-8 h-8 text-indigo-100" />
          </div>
        </motion.div>
      </div>
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
                {teacherData?.firstName?.charAt(0)}{teacherData?.lastName?.charAt(0)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {teacherData?.firstName} {teacherData?.lastName}
              </h3>
              <p className="text-sm text-gray-500 flex items-center justify-center mt-1">
                <Mail className="w-4 h-4 mr-1" />
                {teacherData?.account?.email}
              </p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <UserCheck className="w-3 h-3 mr-1" />
                Teacher
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium">Account ID:</span>
                <span className="ml-2">{teacherData?.account?.id}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium">Joined:</span>
                <span className="ml-2">
                  {teacherData?.account?.createdAt ? new Date(teacherData.account.createdAt).toLocaleDateString() : 'N/A'}
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
            
            {getUpcomingSeances().length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming sessions scheduled</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getUpcomingSeances().slice(0, 5).map((seance) => (
                  <div key={seance.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{seance.title}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(seance.startsAt).toLocaleDateString()} at {new Date(seance.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        seance.mode === 'ONSITE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {seance.mode === 'ONSITE' ? (
                          <MapPin className="w-3 h-3 mr-1" />
                        ) : (
                          <Video className="w-3 h-3 mr-1" />
                        )}
                        {seance.mode}
                      </span>
                      <span className="text-sm text-gray-500">
                        {seance.duration}min
                      </span>
                    </div>
                  </div>
                ))}
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
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Courses & Groups
            </h2>
            
            <div className="space-y-4">
              {courses.map((course) => {
                const courseGroups = groups.filter(g => g.course?.id === course.id);
                return (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{course.name}</h3>
                      <span className="text-sm text-gray-500">{courseGroups.length} groups</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {courseGroups.map((group) => (
                        <div key={group.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium text-gray-700">{group.name}</span>
                          <span className="text-xs text-gray-500">{group.studentCount || 0} students</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}