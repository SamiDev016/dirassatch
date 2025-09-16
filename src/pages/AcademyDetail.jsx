

import Header from "../components/Header"
import Footer from "../components/Footer"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Spinner from "../components/Spinner"
import CourseCard from "../components/CourseCard"
import UserCard from "../components/UserCard"
import { getAcademyDetails, getCoursesByAcademy, getGroupByID, getAllMembersOfGroup, createEnrollmentRequest } from "../utils/auth"
const AcademyDetail = () => {

    const { id } = useParams();
    const [academy, setAcademy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupMembers, setGroupMembers] = useState({});
    const [enrollmentLoading, setEnrollmentLoading] = useState({});
    useEffect(() => {
        const fetchAcademyData = async () => {
            try {
                setLoading(true);
                
                // Fetch academy details
                const academyData = await getAcademyDetails(id);
                console.log('Academy Data:', academyData);
                console.log('Academy has students:', academyData.students?.length || 0);
                console.log('Academy has teachers:', academyData.teachers?.length || 0);
                if (!academyData) throw new Error("Failed to fetch academy details");
                setAcademy(academyData);
                
                // Fetch courses
                const coursesData = await getCoursesByAcademy({ academyId: id });
                console.log('Courses Data:', coursesData);
                console.log('Number of courses:', coursesData?.length || 0);
                if (coursesData) {
                    setCourses(coursesData);
                    
                    // Extract groups from academy students and teachers
                    const groupsData = [];
                    const membersData = {};
                    const uniqueGroups = new Set();
                    
                    console.log('Extracting groups from students and teachers...');
                    
                    // Extract unique group IDs from students
                    if (academyData.students && academyData.students.length > 0) {
                        academyData.students.forEach((student, index) => {
                            console.log(`Student ${index}:`, student.firstName, student.lastName, 'Group:', student.group);
                            if (student.group && student.group.id) {
                                uniqueGroups.add(student.group.id);
                                console.log('Added group ID from student:', student.group.id);
                            }
                        });
                    }
                    
                    // Extract unique group IDs from teachers
                    if (academyData.teachers && academyData.teachers.length > 0) {
                        academyData.teachers.forEach((teacher, index) => {
                            console.log(`Teacher ${index}:`, teacher.firstName, teacher.lastName, 'Group:', teacher.group);
                            if (teacher.group && teacher.group.id) {
                                uniqueGroups.add(teacher.group.id);
                                console.log('Added group ID from teacher:', teacher.group.id);
                            }
                        });
                    }
                    
                    console.log('Unique group IDs found:', Array.from(uniqueGroups));
                    
                    // Fetch each unique group
                    for (const groupId of uniqueGroups) {
                        console.log('Fetching group with ID:', groupId);
                        const groupData = await getGroupByID({ id: groupId });
                        console.log('Group data result:', groupData);
                        if (groupData) {
                            groupsData.push(groupData);
                            console.log('Added group to groupsData, total groups:', groupsData.length);
                            
                            // Fetch members for this group
                            console.log('Fetching members for group:', groupId);
                            const members = await getAllMembersOfGroup({ groupId: groupId });
                            console.log('Members result:', members);
                            if (members) {
                                membersData[groupId] = members;
                            }
                        } else {
                            console.log('Failed to fetch group with ID:', groupId);
                        }
                    }
                    
                    console.log('Final groupsData:', groupsData);
                    console.log('Final membersData:', membersData);
                    setGroups(groupsData);
                    setGroupMembers(membersData);
                } else {
                    console.log('No courses data found');
                }
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAcademyData();
    }, [id]);

    const handleEnrollment = async (groupId) => {
        try {
            setEnrollmentLoading(prev => ({ ...prev, [groupId]: true }));
            const result = await createEnrollmentRequest({ groupId });
            if (result) {
                alert('Enrollment request sent successfully!');
            } else {
                alert('Failed to send enrollment request');
            }
        } catch (error) {
            console.error('Error enrolling:', error);
            alert('Error sending enrollment request');
        } finally {
            setEnrollmentLoading(prev => ({ ...prev, [groupId]: false }));
        }
    };

    console.log('Rendering state:', { loading, error, academy: !!academy, courses: courses.length, groups: groups.length });
    
    if (loading) return <div><Header /><Spinner /><Footer /></div>;
    if (error) return <div><Header /><p>{error}</p><Footer /></div>;
    if (!academy) return null;
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Academy Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-shrink-0">
                            {academy.logo ? (
                                <img 
                                    src={academy.logo} 
                                    alt={academy.name} 
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
                                    <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{academy.name}</h1>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <span>{academy.students?.length || 0} Students</span>
                                </div>
                                <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <span>{academy.teachers?.length || 0} Teachers</span>
                                </div>
                                <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span>{courses.length} Courses</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Courses Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Courses</h2>
                    </div>
                    
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map(course => (
                                <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    {course.coverPhoto && (
                                        <img 
                                            src={course.coverPhoto} 
                                            alt={course.name} 
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.name}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-blue-600 font-semibold">${course.price}</span>
                                            <span className="text-sm text-gray-500">{course.targetAudience}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg">No courses available</p>
                        </div>
                    )}
                </div>

                {/* Groups Section */}
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Groups & Students</h2>
                    </div>
                    
                    {groups.length > 0 ? (
                        <div className="space-y-6">
                            {groups.map(group => (
                                <div key={group.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-800">{group.name}</h3>
                                                <p className="text-gray-600">Course: {courses.find(c => c.id === group.courseId)?.name || 'Unknown Course'}</p>
                                            </div>
                                            <button
                                                onClick={() => handleEnrollment(group.id)}
                                                disabled={enrollmentLoading[group.id]}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {enrollmentLoading[group.id] ? (
                                                    <>
                                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    'Request Enrollment'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        <h4 className="text-lg font-medium text-gray-800 mb-4">Students ({groupMembers[group.id]?.length || 0})</h4>
                                        
                                        {groupMembers[group.id] && groupMembers[group.id].length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {groupMembers[group.id].map(member => (
                                                    <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                        {member.profilePhoto ? (
                                                            <img 
                                                                src={member.profilePhoto} 
                                                                alt={`${member.firstName} ${member.lastName}`} 
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                <span className="text-gray-600 font-medium">
                                                                    {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-gray-800">{member.firstName} {member.lastName}</p>
                                                            <p className="text-sm text-gray-600">{member.role}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500">No students in this group</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg">No groups available</p>
                        </div>
                    )}
                </div>
            </div>
            
            
            <Footer />
        </div>
    )
}

export default AcademyDetail
