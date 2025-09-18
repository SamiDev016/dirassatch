import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import { getCourseById, getGroupsByCourse, getAllMembersOfGroup, createEnrollmentRequest, getEnrollmentRequestsByGroup, getEnrollmentRequestsByUser, getToken } from "../utils/auth";
import { Clock, Users, BookOpen, Target, Award, DollarSign, Building2, FolderOpen, UserPlus, CheckCircle } from "lucide-react";

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [groups, setGroups] = useState([]);
    const [groupMembers, setGroupMembers] = useState({});
    const [enrollmentRequests, setEnrollmentRequests] = useState({});
    const [loadingEnrollment, setLoadingEnrollment] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEnrollmentRequests, setUserEnrollmentRequests] = useState([]);
    const [loadingUserRequests, setLoadingUserRequests] = useState(false);

    // Helper function to check if user has already requested enrollment for a specific group
    const hasUserRequestedEnrollment = (groupId) => {
        return userEnrollmentRequests.some(request => request.groupId === groupId);
    };

    const handleEnrollmentRequest = async (groupId) => {
        try {
            setLoadingEnrollment(prev => ({ ...prev, [groupId]: true }));
            const token = getToken();
            if (!token) {
                alert('Please log in to submit enrollment request');
                return;
            }
            
            // Extract userId from token (assuming JWT format)
            const userId = JSON.parse(atob(token.split('.')[1])).userId;
            const result = await createEnrollmentRequest({ userId, groupId });
            
            if (result) {
                // Try to refresh enrollment requests for this group, but don't fail if it doesn't work
                try {
                    const requests = await getEnrollmentRequestsByGroup({ groupId });
                    setEnrollmentRequests(prev => ({ ...prev, [groupId]: requests || [] }));
                } catch (refreshError) {
                    console.warn('Failed to refresh enrollment requests:', refreshError);
                    // Even if refresh fails, the request was submitted successfully
                }
                
                // Refresh user enrollment requests
                try {
                    const userId = JSON.parse(atob(token.split('.')[1])).userId;
                    const updatedUserRequests = await getEnrollmentRequestsByUser({ userId });
                    setUserEnrollmentRequests(updatedUserRequests || []);
                } catch (refreshError) {
                    console.warn('Failed to refresh user enrollment requests:', refreshError);
                }
                
                alert('Enrollment request submitted successfully!');
            } else {
                alert('Failed to submit enrollment request. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting enrollment request:', error);
            alert('Error submitting enrollment request. Please try again.');
        } finally {
            setLoadingEnrollment(prev => ({ ...prev, [groupId]: false }));
        }
    };

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                
                // Check if user is logged in
                const token = getToken();
                const loggedIn = !!token;
                setIsLoggedIn(loggedIn);
                
                // Fetch user enrollment requests if logged in
                if (loggedIn) {
                    try {
                        const userId = JSON.parse(atob(token.split('.')[1])).userId;
                        const userRequests = await getEnrollmentRequestsByUser({ userId });
                        setUserEnrollmentRequests(userRequests || []);
                    } catch (userRequestError) {
                        console.warn('Failed to fetch user enrollment requests:', userRequestError);
                        setUserEnrollmentRequests([]);
                    }
                }
                
                const courseData = await getCourseById({ id });
                const groupsData = await getGroupsByCourse({ courseId: id });
                
                if (courseData) {
                    setCourse(courseData);
                }
                if (groupsData) {
                    setGroups(groupsData);
                    
                    // Get member counts for each group
                    const membersData = {};
                    const requestsData = {};
                    
                    for (const group of groupsData) {
                        try {
                            const members = await getAllMembersOfGroup({ groupId: group.id });
                            membersData[group.id] = members || [];
                        } catch (memberError) {
                            console.warn(`Failed to fetch members for group ${group.id}:`, memberError);
                            membersData[group.id] = [];
                        }
                        
                        try {
                            const requests = await getEnrollmentRequestsByGroup({ groupId: group.id });
                            requestsData[group.id] = requests || [];
                        } catch (requestError) {
                            console.warn(`Failed to fetch enrollment requests for group ${group.id}:`, requestError);
                            requestsData[group.id] = [];
                        }
                    }
                    
                    setGroupMembers(membersData);
                    setEnrollmentRequests(requestsData);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [id]);

    if (loading) return (
        <div>
            <Header />
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Course Details</h3>
                        <p className="text-gray-600">Please wait while we fetch the course information...</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
    if (error) return <div><Header /><div className="container mx-auto px-4 py-8 text-center"><p className="text-red-500">{error}</p></div><Footer /></div>;
    if (!course) return null;

    return (
        <div>
            <Header />
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Course Header */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="relative">
                        <img 
                            className="w-full h-64 object-cover" 
                            src={course.coverPhoto || "https://via.placeholder.com/800x400?text=Course"} 
                            alt={course.name} 
                        />
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg font-medium">
                            {course.category || "Course"}
                        </div>
                    </div>
                    
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.name}</h1>
                                <div className="flex items-center text-gray-600">
                                    <Building2 size={16} className="mr-2 text-blue-500" />
                                    <span>{course.academy?.name || "Academy"}</span>
                                    <span className="mx-2">•</span>
                                    <FolderOpen size={16} className="mr-2 text-purple-500" />
                                    <span>{course.module?.name || "Module"}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-green-600">
                                    <p size={20} className="inline mr-1" /> 
                                    {course.price?.toLocaleString() || "0"}
                                </div>
                                <div className="text-sm text-gray-500">Course Price</div>
                            </div>
                        </div>
                        
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {course.description || "No description available"}
                        </p>
                        
                        {/* Course Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <Target size={20} className="mr-2 text-blue-500" />
                                    <h3 className="font-semibold text-gray-800">Target Audience</h3>
                                </div>
                                <p className="text-gray-600">{course.targetAudience || "Not specified"}</p>
                            </div>
                            
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <Award size={20} className="mr-2 text-green-500" />
                                    <h3 className="font-semibold text-gray-800">Prerequisites</h3>
                                </div>
                                <p className="text-gray-600">{course.prerequisites || "None"}</p>
                            </div>
                            
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <Clock size={20} className="mr-2 text-purple-500" />
                                    <h3 className="font-semibold text-gray-800">Age Range</h3>
                                </div>
                                <p className="text-gray-600">
                                    {course.minAge && course.maxAge 
                                        ? `${course.minAge} - ${course.maxAge} years` 
                                        : "Not specified"}
                                </p>
                            </div>
                        </div>
                        
                        {/* Learning Outcomes */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="bg-yellow-50 p-6 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                    <BookOpen size={20} className="mr-2 text-yellow-500" />
                                    What You Will Learn
                                </h3>
                                <p className="text-gray-600">{course.whatYouWillLearn || "Learning outcomes not specified"}</p>
                            </div>
                            
                            <div className="bg-indigo-50 p-6 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                    <Award size={20} className="mr-2 text-indigo-500" />
                                    What You Can Do After
                                </h3>
                                <p className="text-gray-600">{course.whatYouCanDoAfter || "Career outcomes not specified"}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Chapters Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <BookOpen size={24} className="mr-3 text-blue-500" />
                        Course Chapters
                    </h2>
                    
                    {course.chapters && course.chapters.length > 0 ? (
                        <div className="space-y-4">
                            {course.chapters.map((chapter, index) => (
                                <div key={chapter.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start">
                                        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-4 flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-lg mb-2">{chapter.name}</h3>
                                            <p className="text-gray-600">{chapter.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>No chapters available for this course.</p>
                        </div>
                    )}
                </div>
                
                {/* Groups Section */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <Users size={24} className="mr-3 text-green-500" />
                        Available Groups
                    </h2>
                    
                    {groups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groups.map((group) => (
                                <div key={group.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-800 text-lg">{group.name}</h3>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${group.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {group.active ? 'Active' : 'Inactive'}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                <Users size={14} className="inline mr-1" />
                                                {groupMembers[group.id]?.length || 0} Members
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        {!isLoggedIn ? (
                                            <button
                                                disabled={true}
                                                className="w-full py-2 px-4 rounded-md font-medium flex items-center justify-center bg-gray-300 text-gray-500 cursor-not-allowed transition-colors duration-300"
                                            >
                                                <UserPlus size={16} className="mr-2" />
                                                Login to Enroll
                                            </button>
                                        ) : hasUserRequestedEnrollment(group.id) ? (
                                            <button
                                                disabled={true}
                                                className="w-full py-2 px-4 rounded-md font-medium flex items-center justify-center bg-yellow-100 text-yellow-800 cursor-not-allowed transition-colors duration-300"
                                            >
                                                <CheckCircle size={16} className="mr-2" />
                                                Request Sent
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEnrollmentRequest(group.id)}
                                                disabled={loadingEnrollment[group.id] || !group.active}
                                                className={`w-full py-2 px-4 rounded-md font-medium flex items-center justify-center transition-colors duration-300 ${
                                                    loadingEnrollment[group.id] || !group.active
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                                }`}
                                            >
                                                {loadingEnrollment[group.id] ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Submitting...
                                                    </>
                                                ) : enrollmentRequests[group.id]?.some(req => req.status === 'PENDING') ? (
                                                    <>
                                                        <CheckCircle size={16} className="mr-2" />
                                                        Request Pending
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus size={16} className="mr-2" />
                                                        Request Enrollment
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Users size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>No groups available for this course.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CourseDetails;
