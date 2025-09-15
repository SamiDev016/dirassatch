import React, { useEffect, useState } from "react";
import {
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupsByCourse,
  addMemberToGroup,
  removeMemberFromGroup,
  getAllMembersOfGroup,
  getCoursesByAcademy,
  getUserByEmail,
  getUserById,
  getGroupByID,
  getEnrollmentRequestsByCourse,
  acceptEnrollmentRequest,
} from "../../../utils/auth";
import {
  Users,
  UserPlus,
  Edit, 
  Trash2,
  BookOpen,
  PlusCircle,
  Search,
  UserCheck,
  UserX,
  User,
  X,
} from "lucide-react";

export default function GroupsAdmin() {
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberDetails, setMemberDetails] = useState([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState(null);
  const [showGroupSelectionModal, setShowGroupSelectionModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [formData, setFormData] = useState({ id: null, name: "", courseId: "" });
  const [memberForm, setMemberForm] = useState({ email: "", role: "STUDENT" });
  const [loading, setLoading] = useState(false);
  const [academyId, setAcademyId] = useState(null);

  // Load academyId from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem("selectedAcademyId");
    if (stored) {
      setAcademyId(Number(stored));
    }
  }, []);

  // Load courses when academyId is ready
  useEffect(() => {
    if (academyId) {
      fetchCourses();
    }
  }, [academyId]);

  // Load groups whenever selectedCourseId changes
  useEffect(() => {
    if (selectedCourseId) {
      fetchGroups();
    }
  }, [selectedCourseId]);

  async function fetchGroups() {
    if (!selectedCourseId) return; // don’t call API with null
    setLoading(true);
    const data = await getGroupsByCourse({ courseId: selectedCourseId });
    if (data) setGroups(data);
    setLoading(false);
  }
  

  async function fetchCourses() {
    setLoading(true);
    const data = await getCoursesByAcademy({ academyId });
    if (data) setCourses(data);
    setLoading(false);
  }

  async function handleSaveGroup(e) {
    e.preventDefault();
  
    let payload = {
      name: formData.name,
      courseId: Number(formData.courseId),
    };
  
    if (formData.id) {
      await updateGroup({ ...payload, id: formData.id });
    } else {
      await createGroup(payload);
    }
  
    // Reset form
    setFormData({ id: null, name: "", courseId: "" });
  
    // Make sure we are looking at the right course
    setSelectedCourseId(payload.courseId);
  
    // Refresh groups for that course
    fetchGroups();
  }
  

  async function handleDeleteGroup(id) {
    if (!confirm("Are you sure you want to delete this group?")) return;
    await deleteGroup({ id });
    fetchGroups();
  }

  async function handleSelectGroup(group) {
    setSelectedGroup(group);
    
    // Fetch group details
    const groupDetails = await getGroupByID({ id: group.id });
    if (groupDetails) {
      setSelectedGroupDetails(groupDetails);
    }
    
    // Fetch group members
    const members = await getAllMembersOfGroup({ groupId: group.id });
    if (members) {
      setMembers(members);
      
      // Fetch user details for each member
      const details = await Promise.all(
        members.map(async (member) => {
          const user = await getUserById(member.userId);
          return user;
        })
      );
      setMemberDetails(details);
    }
    
    // Fetch enrollment requests for the course
    if (groupDetails && groupDetails.courseId) {
      const requests = await getEnrollmentRequestsByCourse({ courseId: groupDetails.courseId });
      if (requests) {
        setEnrollmentRequests(requests);
      }
    }
  }

  async function handleAddMember(e) {
    e.preventDefault();
    if (!selectedGroup) return;
    
    // Get user by email first
    const user = await getUserByEmail(memberForm.email);
    if (!user) {
      alert("User not found with this email");
      return;
    }
    
    console.log("User found:", user);
    console.log("User ID:", user.userId, "Type:", typeof user.userId);
    console.log("User ID as number:", Number(user.userId), "Type:", typeof Number(user.userId));
    
    const userId = parseInt(user.userId, 10);
    console.log("User ID parsed with parseInt:", userId, "Type:", typeof userId);
    
    await addMemberToGroup({
      userId: userId,
      groupId: selectedGroup.id,
      role: memberForm.role,
    });
    setMemberForm({ email: "", role: "STUDENT" });
    handleSelectGroup(selectedGroup);
  }

  async function handleRemoveMember(userId) {
    if (!selectedGroup) return;
    await removeMemberFromGroup({ userId, groupId: selectedGroup.id });
    handleSelectGroup(selectedGroup);
  }

  async function handleAcceptEnrollment(request) {
    setSelectedRequest(request);
    setSelectedGroupId("");
    setShowGroupSelectionModal(true);
  }

  async function handleConfirmGroupSelection() {
    if (!selectedRequest || !selectedGroupId) {
      alert("Please select a group");
      return;
    }

    try {
      // Accept the enrollment request
      const acceptResult = await acceptEnrollmentRequest({ id: selectedRequest.id });
      
      if (acceptResult) {
        // Add the student to the selected group
        // Note: We need to get the student ID from the request
        const studentId = selectedRequest.studentId || selectedRequest.userId;
        if (studentId) {
          await addMemberToGroup({
            userId: parseInt(studentId, 10),
            groupId: parseInt(selectedGroupId, 10),
            role: "STUDENT"
          });
        }
        
        // Remove the accepted request from local state
        setEnrollmentRequests(prevRequests => 
          prevRequests.filter(request => request.id !== selectedRequest.id)
        );
        
        // Close modal and reset state
        setShowGroupSelectionModal(false);
        setSelectedRequest(null);
        setSelectedGroupId("");
        
        alert("Enrollment request accepted and student added to group successfully!");
        
        // Refresh the selected group if it's the one we added to
        if (selectedGroup && selectedGroup.id === parseInt(selectedGroupId, 10)) {
          handleSelectGroup(selectedGroup);
        }
      } else {
        alert("Failed to accept enrollment request");
      }
    } catch (error) {
      console.error("Error processing enrollment request:", error);
      alert("Failed to process enrollment request");
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Groups Management
          </h1>
          <p className="text-gray-500 mt-1">
            Create and manage student and teacher groups
          </p>
        </div>
        {/* Course selector */}
        <div>
          <select
            value={selectedCourseId || ""}
            onChange={(e) => setSelectedCourseId(Number(e.target.value))}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Group form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-blue-600" />
                {formData.id ? "Update Group" : "Create New Group"}
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={handleSaveGroup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter group name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Associated Course
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) =>
                      setFormData({ ...formData, courseId: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  {formData.id ? (
                    <Edit className="h-4 w-4" />
                  ) : (
                    <PlusCircle className="h-4 w-4" />
                  )}
                  {formData.id ? "Update Group" : "Create Group"}
                </button>
                {formData.id && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ id: null, name: "", courseId: "" })
                    }
                    className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Cancel Editing
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Groups list */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Available Groups
              </h2>
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search groups..."
                  className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                />
              </div>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-600">Loading groups...</p>
                </div>
              ) : groups.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <Users className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-700 font-medium">No groups found</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Select a course and create your first group
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {groups.map((g) => (
                    <div
                      key={g.id}
                      className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          {g.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {courses.find((c) => c.id === g.courseId)?.name ||
                            `Course ID: ${g.courseId}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center gap-1"
                          onClick={() => setFormData(g)}
                          title="Edit Group"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200 flex items-center gap-1"
                          onClick={() => handleSelectGroup(g)}
                          title="Manage Members"
                        >
                          <UserPlus className="h-4 w-4" />
                          <span className="hidden sm:inline">Members</span>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center gap-1"
                          onClick={() => handleDeleteGroup(g.id)}
                          title="Delete Group"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Members Management */}
      {selectedGroup && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-600" />
              Members of {selectedGroup.name}
            </h2>
            <button
              onClick={() => setSelectedGroup(null)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <form
              onSubmit={handleAddMember}
              className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Email
                </label>
                <input
                  type="email"
                  placeholder="Enter user email"
                  value={memberForm.email}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, email: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={memberForm.role}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, role: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="TEACHER">TEACHER</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm h-[42px]"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Member
                </button>
              </div>
            </form>

            {members.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <User className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-700 font-medium">
                  No members in this group
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Add members using the form above
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2 px-2">
                  <h3 className="font-medium text-gray-700">Current Members</h3>
                  <span className="text-sm text-gray-500">
                    {members.length} member{members.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {members.map((m, index) => {
                  const userDetail = memberDetails[index];
                  return (
                    <div
                      key={m.userId}
                      className="border border-gray-200 rounded-lg p-3 flex justify-between items-center hover:border-red-200 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 rounded-full p-2">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {userDetail ? `${userDetail.firstName} ${userDetail.lastName}` : `User ID: ${m.userId}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {userDetail && <span>{userDetail.email}</span>}
                          </p>
                          <p className="text-sm text-gray-500">
                            {m.role === "TEACHER" ? (
                              <span className="text-green-600 font-medium flex items-center gap-1">
                                <BookOpen className="h-3.5 w-3.5" /> Teacher
                              </span>
                            ) : m.role === "ASSISTANT" ? (
                              <span className="text-blue-600 font-medium flex items-center gap-1">
                                <UserCheck className="h-3.5 w-3.5" /> Assistant
                              </span>
                            ) : (
                              <span className="text-gray-600 font-medium flex items-center gap-1">
                                <User className="h-3.5 w-3.5" /> Student
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center gap-1"
                        onClick={() => handleRemoveMember(m.userId)}
                        title="Remove Member"
                      >
                        <UserX className="h-4 w-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enrollment Requests Management */}
      {selectedGroup && selectedGroupDetails && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-600" />
              Enrollment Requests for {selectedGroup.name}
            </h2>
            <span className="text-sm text-gray-500">
              {enrollmentRequests.length} request{enrollmentRequests.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="p-4">
            {enrollmentRequests.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <UserCheck className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-700 font-medium">
                  No enrollment requests
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  All enrollment requests have been processed
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {enrollmentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:border-green-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 rounded-full p-2">
                        <UserPlus className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {request.studentName || request.studentEmail || `Student ID: ${request.studentId || request.userId || 'Unknown'}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {request.studentEmail && request.studentName && <span>{request.studentEmail}</span>}
                        </p>
                        <p className="text-sm text-gray-500">
                          Requested: {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
                      onClick={() => handleAcceptEnrollment(request)}
                      title="Accept Request"
                    >
                      <UserCheck className="h-4 w-4" />
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Group Selection Modal */}
      {showGroupSelectionModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-green-600" />
                  Select Group for Enrollment
                </h3>
                <button
                  onClick={() => {
                    setShowGroupSelectionModal(false);
                    setSelectedRequest(null);
                    setSelectedGroupId("");
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Student:</p>
                <p className="font-medium text-gray-800">
                  {selectedRequest.studentName || selectedRequest.studentEmail || `Student ID: ${selectedRequest.studentId || selectedRequest.userId || 'Unknown'}`}
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Group to Add Student:
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">Choose a group...</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowGroupSelectionModal(false);
                    setSelectedRequest(null);
                    setSelectedGroupId("");
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmGroupSelection}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                  disabled={!selectedGroupId}
                >
                  <UserCheck className="h-4 w-4" />
                  Accept & Add to Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
