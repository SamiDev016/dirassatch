import { getUserData, getChaptersByCourse, getSectionsByChapter, getAllSupportsBySection } from "../../../utils/auth";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Users, GraduationCap, Calendar, Clock, ChevronRight, X, FileText, FolderOpen, Video, Download, Loader2 } from "lucide-react";

export default function StudentDashboardCourses() {
  const [userData, setUserData] = useState(null);
  const [studentCourses, setStudentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    chapters: [],
    sections: {},
    supports: {},
    loading: false,
    error: null
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔍 Loading user data...');
        const user = await getUserData();
        console.log('🔍 User data received:', user);
        
        setUserData(user);
        
        // Filter groups where user role is STUDENT
        const studentGroups = user.groups.filter(group => group.role === 'STUDENT');
        console.log('🔍 Student groups filtered:', studentGroups);
        
        // Extract course information from student groups
        const courses = studentGroups.map(group => ({
          id: group.course.id,
          name: group.course.name,
          academy: group.course.academy.name, // Fix: access academy name instead of academy object
          groupName: group.name,
          groupId: group.id,
          role: group.role
        }));
        
        console.log('🔍 Student courses extracted:', courses);
        setStudentCourses(courses);
        
      } catch (err) {
        console.error('🔴 Error loading data:', err);
        setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Function to handle opening course details modal
  const handleViewDetails = async (course) => {
    console.log('🔍 Opening course details for:', course);
    setSelectedCourse(course);
    setIsModalOpen(true);
    
    // Reset modal data
    setModalData({
      chapters: [],
      sections: {},
      supports: {},
      loading: true,
      error: null
    });
    
    try {
      console.log('🔍 Fetching chapters for course:', course.id);
      const chapters = await getChaptersByCourse({ courseId: course.id });
      console.log('🔍 Chapters received:', chapters);
      
      if (!chapters || chapters.length === 0) {
        console.log('🔍 No chapters found for course:', course.id);
        setModalData({
          chapters: [],
          sections: {},
          supports: {},
          loading: false,
          error: null
        });
        return;
      }
      
      const sectionsMap = {};
      const supportsMap = {};
      
      // Fetch sections for each chapter
      for (const chapter of chapters) {
        console.log('🔍 Fetching sections for chapter:', chapter.id);
        const sections = await getSectionsByChapter({ chapterId: chapter.id });
        console.log('🔍 Sections for chapter', chapter.id, ':', sections);
        
        if (sections && sections.length > 0) {
          sectionsMap[chapter.id] = sections;
          
          // Fetch supports for each section
          for (const section of sections) {
            console.log('🔍 Fetching supports for section:', section.id);
            const supports = await getAllSupportsBySection({ sectionId: section.id });
            console.log('🔍 Supports for section', section.id, ':', supports);
            
            if (supports && supports.length > 0) {
              supportsMap[section.id] = supports;
            }
          }
        }
      }
      
      console.log('🔍 All data fetched successfully');
      setModalData({
        chapters: chapters || [],
        sections: sectionsMap,
        supports: supportsMap,
        loading: false,
        error: null
      });
      
    } catch (error) {
      console.error('🔴 Error fetching course details:', error);
      setModalData({
        chapters: [],
        sections: {},
        supports: {},
        loading: false,
        error: 'Failed to load course details. Please try again.'
      });
    }
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setModalData({
      chapters: [],
      sections: {},
      supports: {},
      loading: false,
      error: null
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {userData?.firstName}! Here are your enrolled courses.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                {studentCourses.length} Course{studentCourses.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {studentCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
            <p className="text-gray-600 mb-6">You haven't been enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{course.academy}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{course.groupName}</span>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        <span>{course.role}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Enrolled</span>
                  </div>
                  <button 
                    onClick={() => handleViewDetails(course)}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {studentCourses.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{studentCourses.length}</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {new Set(studentCourses.map(c => c.academy.name)).size}
                </div>
                <div className="text-sm text-gray-600">Academies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {new Set(studentCourses.map(c => c.groupName)).size}
                </div>
                <div className="text-sm text-gray-600">Groups</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedCourse.name}</h2>
                    <p className="text-blue-100">{selectedCourse.academy} • {selectedCourse.groupName}</p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {modalData.loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-gray-600">Loading course content...</span>
                  </div>
                ) : modalData.error ? (
                  <div className="text-center py-12">
                    <div className="text-red-500 mb-4">
                      <FileText className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Content</h3>
                    <p className="text-gray-600 mb-4">{modalData.error}</p>
                    <button
                      onClick={() => handleViewDetails(selectedCourse)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Try Again
                    </button>
                  </div>
                ) : modalData.chapters.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Available</h3>
                    <p className="text-gray-600">This course doesn't have any chapters yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Chapters Section */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <FolderOpen className="w-5 h-5 mr-2 text-blue-600" />
                        Course Chapters ({modalData.chapters.length})
                      </h3>
                      
                      <div className="space-y-4">
                        {modalData.chapters.map((chapter, chapterIndex) => (
                          <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 p-4 border-b border-gray-200">
                              <h4 className="font-semibold text-gray-900 flex items-center">
                                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                                  {chapterIndex + 1}
                                </span>
                                {chapter.name}
                              </h4>
                              {chapter.description && (
                                <p className="text-gray-600 mt-2 ml-9">{chapter.description}</p>
                              )}
                            </div>
                            
                            {/* Sections */}
                            {modalData.sections[chapter.id] && modalData.sections[chapter.id].length > 0 && (
                              <div className="p-4 space-y-3">
                                <h5 className="font-medium text-gray-700 flex items-center text-sm">
                                  <FileText className="w-4 h-4 mr-2" />
                                  Sections ({modalData.sections[chapter.id].length})
                                </h5>
                                
                                <div className="space-y-2 pl-6">
                                  {modalData.sections[chapter.id].map((section) => (
                                    <div key={section.id} className="bg-white border border-gray-200 rounded-lg p-3">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <h6 className="font-medium text-gray-900">{section.name}</h6>
                                          {section.description && (
                                            <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                                          )}
                                        </div>
                                        
                                        {/* Support Documents */}
                                        {modalData.supports[section.id] && modalData.supports[section.id].length > 0 && (
                                          <div className="flex items-center space-x-2">
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                              {modalData.supports[section.id].length} file(s)
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Support Documents List */}
                                      {modalData.supports[section.id] && modalData.supports[section.id].length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                          <h7 className="text-xs font-medium text-gray-700 mb-2 block">Support Documents:</h7>
                                          <div className="space-y-2">
                                            {modalData.supports[section.id].map((support) => (
                                              <div key={support.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                                                <div className="flex items-center space-x-2">
                                                  {support.type === 'VIDEO' ? (
                                                    <Video className="w-4 h-4 text-red-600" />
                                                  ) : (
                                                    <FileText className="w-4 h-4 text-blue-600" />
                                                  )}
                                                  <div>
                                                    <p className="text-sm font-medium text-gray-900">{support.title}</p>
                                                    {support.description && (
                                                      <p className="text-xs text-gray-600">{support.description}</p>
                                                    )}
                                                  </div>
                                                </div>
                                                <button className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors duration-200">
                                                  <Download className="w-4 h-4" />
                                                </button>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}