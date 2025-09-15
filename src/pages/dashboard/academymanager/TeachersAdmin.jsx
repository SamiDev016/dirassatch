import { useState, useEffect } from "react";
import { getTeachersByAcademy, getUserById } from "../../../utils/auth";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Calendar, BookOpen, Users, X, Eye } from "lucide-react";

export default function TeachersAdmin() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      const academyId = localStorage.getItem("selectedAcademyId");
      
      if (!academyId) {
        setError("No academy selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getTeachersByAcademy({ academyId });
        
        if (data && Array.isArray(data)) {
          const teachersWithGroups = data.map(teacher => ({
            ...teacher,
            groupNames: teacher.groups?.filter(g => g.role === 'TEACHER').map(g => g.name) || []
          }));
          
          setTeachers(teachersWithGroups);
        } else {
          setError("No teachers found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load teachers");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleShowDetails = async (teacherId) => {
    setSelectedTeacher(teacherId);
    setDetailsLoading(true);
    
    try {
      const details = await getUserById(teacherId);
      setTeacherDetails(details);
    } catch (err) {
      console.error("Error fetching teacher details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedTeacher(null);
    setTeacherDetails(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-blue-600">Loading teachers...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-red-600">{error}</div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-600">
          Teachers
        </h1>
        <p className="text-gray-600">Manage and view teacher information</p>
      </div>

      {/* Teachers List */}
      <div className="bg-white rounded-lg">
        <div className="divide-y divide-gray-100">
          {teachers.map((teacher) => (
            <motion.div
              key={teacher.id}
              className="p-4 hover:bg-gray-50 transition-colors duration-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                    {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">
                      {teacher.firstName} {teacher.lastName}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {teacher.groupNames?.map((groupName, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
                          {groupName}
                        </span>
                      )) || (
                        <span className="text-gray-500 text-sm">No groups assigned</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleShowDetails(teacher.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Eye className="w-4 h-4" />
                  <span>Details</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {teachers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No teachers found</p>
          </div>
        )}
      </div>

      {/* Teacher Details Modal */}
      <AnimatePresence>
        {selectedTeacher && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetails}
            >
              {/* Modal Content */}
              <motion.div
                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {teacherDetails?.firstName?.charAt(0)}{teacherDetails?.lastName?.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {teacherDetails?.firstName} {teacherDetails?.lastName}
                      </h2>
                      <p className="text-sm text-gray-500">Teacher Details</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseDetails}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  {detailsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-blue-600">Loading teacher details...</div>
                    </div>
                  ) : teacherDetails ? (
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2 text-blue-600" />
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="text-sm text-gray-500">Full Name</label>
                            <p className="font-medium text-gray-900">
                              {teacherDetails.firstName} {teacherDetails.lastName}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="text-sm text-gray-500">Email</label>
                            <p className="font-medium text-gray-900 flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {teacherDetails.account?.email || 'N/A'}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="text-sm text-gray-500">Teacher ID</label>
                            <p className="font-medium text-gray-900">#{teacherDetails.id}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="text-sm text-gray-500">Member Since</label>
                            <p className="font-medium text-gray-900 flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {new Date(teacherDetails.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Groups and Courses */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Users className="w-5 h-5 mr-2 text-blue-600" />
                          Groups & Courses
                        </h3>
                        <div className="space-y-3">
                          {teacherDetails.groups?.filter(g => g.role === 'TEACHER').map((group, index) => (
                            <div key={index} className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-blue-900">{group.name}</h4>
                                <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-md text-sm">
                                  {group.role}
                                </span>
                              </div>
                              {group.course && (
                                <div className="flex items-center text-sm text-blue-700">
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  {group.course.name}
                                  {group.course.academy && (
                                    <span className="ml-2 text-blue-600">
                                      • {group.course.academy.name}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )) || (
                            <div className="text-gray-500 text-center py-4">
                              No groups assigned
                            </div>
                          )}
                        </div>
                      </div>

                      {/* User Groups (Detailed) */}
                      {teacherDetails.userGroup && teacherDetails.userGroup.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                            Course Details
                          </h3>
                          <div className="space-y-3">
                            {teacherDetails.userGroup.filter(ug => ug.role === 'TEACHER').map((userGroup, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm text-gray-500">Group</label>
                                    <p className="font-medium text-gray-900">{userGroup.group?.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-500">Role</label>
                                    <p className="font-medium text-gray-900">{userGroup.role}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-500">Joined</label>
                                    <p className="font-medium text-gray-900">
                                      {new Date(userGroup.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-500">Status</label>
                                    <p className="font-medium text-gray-900">
                                      {userGroup.group?.active ? 'Active' : 'Inactive'}
                                    </p>
                                  </div>
                                </div>
                                {userGroup.group?.course && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <label className="text-sm text-gray-500">Course</label>
                                    <p className="font-medium text-gray-900">{userGroup.group.course.name}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {userGroup.group.course.description}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Failed to load teacher details</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
