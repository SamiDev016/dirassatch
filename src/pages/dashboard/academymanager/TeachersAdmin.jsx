import { useState, useEffect } from "react";
import { getTeachersByAcademy, getSeanceByTeacher, getUserById, getAttendanceBySeanceUser } from "../../../utils/auth";

export default function TeachersAdmin() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacherData, setTeacherData] = useState([]);
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      const academyId = localStorage.getItem("selectedAcademyId");

      if (!academyId) {
        setError("No academy selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("🔵 [TeachersAdmin] Starting data fetch for academy:", academyId);

        // Fetch teachers
        const teachersData = await getTeachersByAcademy({ academyId });
        console.log("🔵 [TeachersAdmin] Teachers data:", teachersData);

        if (teachersData && Array.isArray(teachersData)) {
          setTeachers(teachersData);
          console.log("🔵 [TeachersAdmin] Teachers set:", teachersData.length, "teachers found");
        } else {
          setError("No teachers found");
          console.log("🔴 [TeachersAdmin] No teachers found in response:", teachersData);
        }


        // Fetch detailed data for each teacher
        const teacherDetails = [];
        for (const teacher of teachersData) {
          console.log("🔵 [TeachersAdmin] Processing teacher:", teacher);
          
          // Get complete teacher data with groups and email
          const completeTeacherData = await getUserById(teacher.id);
          console.log(`🔵 [TeachersAdmin] Complete data for teacher ${teacher.id}:`, completeTeacherData);
          
          // Get teacher's seances
          const seances = await getSeanceByTeacher({ teacherId: teacher.id });
          console.log(`🔵 [TeachersAdmin] Seances for teacher ${teacher.id}:`, seances);
          
          // Extract groups from userGroup array where role is TEACHER
          const teacherGroups = [];
          if (completeTeacherData && completeTeacherData.userGroup) {
            completeTeacherData.userGroup.forEach(userGroup => {
              if (userGroup.role === 'TEACHER' && userGroup.group) {
                teacherGroups.push({
                  id: userGroup.group.id,
                  name: userGroup.group.name,
                  course: userGroup.group.course
                });
              }
            });
          }
          
          // Also check the groups array if it exists
          if (completeTeacherData && completeTeacherData.groups) {
            completeTeacherData.groups.forEach(group => {
              if (group.role === 'TEACHER') {
                teacherGroups.push({
                  id: group.id,
                  name: group.name,
                  course: group.course
                });
              }
            });
          }
          
          console.log(`🔵 [TeachersAdmin] Final groups for teacher ${teacher.id}:`, teacherGroups);
          
          teacherDetails.push({
            ...teacher,
            ...completeTeacherData,
            seances: seances || [],
            groups: teacherGroups,
            email: completeTeacherData?.account?.email || teacher.email || 'N/A'
          });
        }
        
        setTeacherData(teacherDetails);
        console.log("🔵 [TeachersAdmin] Final teacher data with details:", teacherDetails);

      } catch (err) {
        setError("Failed to load teachers");
        console.error("🔴 [TeachersAdmin] Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleTeacherClick = async (teacherId) => {
    if (expandedTeacher === teacherId) {
      setExpandedTeacher(null);
      return;
    }

    setExpandedTeacher(teacherId);
    setLoadingAttendance(true);

    try {
      console.log(`🔵 [TeachersAdmin] Fetching attendance for teacher ${teacherId}`);
      
      const teacher = teacherData.find(t => t.id === teacherId);
      if (!teacher || !teacher.seances) {
        console.log(`🔴 [TeachersAdmin] No teacher or seances found for teacher ${teacherId}`);
        setAttendanceData({});
        setLoadingAttendance(false);
        return;
      }

      const attendanceRecords = [];
      
      for (const seance of teacher.seances) {
        console.log(`🔵 [TeachersAdmin] Fetching attendance for seance ${seance.id}`);
        
        try {
          const attendance = await getAttendanceBySeanceUser({ 
            seanceId: seance.id, 
            userId: teacherId 
          });
          
          console.log(`🔵 [TeachersAdmin] Attendance for seance ${seance.id}:`, attendance);
          
          if (attendance) {
            attendanceRecords.push({
              ...attendance,
              seanceTitle: seance.title,
              seanceStartsAt: seance.startsAt
            });
          }
        } catch (error) {
          console.error(`🔴 [TeachersAdmin] Error fetching attendance for seance ${seance.id}:`, error);
        }
      }

      console.log(`🔵 [TeachersAdmin] Final attendance records for teacher ${teacherId}:`, attendanceRecords);
      setAttendanceData(prev => ({
        ...prev,
        [teacherId]: attendanceRecords
      }));

    } catch (error) {
      console.error(`🔴 [TeachersAdmin] Error fetching attendance data:`, error);
    } finally {
      setLoadingAttendance(false);
    }
  };

  if (loading) return <p>Loading teachers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="teachers-admin-container">
      <h1>Teachers Management</h1>
      
      {loading && <p>Loading teachers...</p>}
      {error && <p className="error">{error}</p>}
      
      {!loading && !error && (
        <table className="teachers-table">
          <thead>
            <tr>
              <th>Teacher Name</th>
              <th>Email</th>
              <th>Groups</th>
              <th>Seances Count</th>
              <th>Upcoming Seances</th>
            </tr>
          </thead>
          <tbody>
            {teacherData.map((teacher) => (
              <>
                <tr 
                  key={teacher.id} 
                  onClick={() => handleTeacherClick(teacher.id)}
                  className={`teacher-row ${expandedTeacher === teacher.id ? 'expanded' : ''}`}
                >
                  <td>{teacher.firstName} {teacher.lastName}</td>
                  <td>{teacher.email || teacher.Email || 'N/A'}</td>
                  <td>
                    {teacher.groups && teacher.groups.length > 0 ? (
                      <div className="groups-list">
                        {teacher.groups.map(group => (
                          <span key={group.id} className="group-badge">
                            {group.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="no-groups">No groups assigned</span>
                    )}
                  </td>
                  <td>{teacher.seances ? teacher.seances.length : 0}</td>
                  <td>
                    {teacher.seances && teacher.seances.length > 0 ? (
                      <div className="seances-list">
                        {teacher.seances.slice(0, 3).map(seance => (
                          <div key={seance.id} className="seance-item">
                            <strong>{seance.title}</strong>
                            <br />
                            <small>{seance.startsAt ? new Date(seance.startsAt).toLocaleDateString() : 'No date'} {seance.startsAt ? new Date(seance.startsAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</small>
                          </div>
                        ))}
                        {teacher.seances.length > 3 && (
                          <small>+{teacher.seances.length - 3} more</small>
                        )}
                      </div>
                    ) : (
                      <span className="no-seances">No seances scheduled</span>
                    )}
                  </td>
                </tr>
                {expandedTeacher === teacher.id && (
                  <tr className="attendance-row">
                    <td colSpan="5">
                      <div className="attendance-container">
                        <h3>Attendance Records for {teacher.firstName} {teacher.lastName}</h3>
                        {loadingAttendance ? (
                          <p>Loading attendance data...</p>
                        ) : attendanceData[teacher.id] && attendanceData[teacher.id].length > 0 ? (
                          <table className="attendance-table">
                            <thead>
                              <tr>
                                <th>Seance Title</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                                <th>Created At</th>
                              </tr>
                            </thead>
                            <tbody>
                              {attendanceData[teacher.id].map((attendance) => (
                                <tr key={`${attendance.seanceId}-${attendance.userId}`}>
                                  <td>{attendance.seanceTitle || attendance.seance?.title || 'N/A'}</td>
                                  <td>
                                    {attendance.seanceStartsAt ? new Date(attendance.seanceStartsAt).toLocaleDateString() : 'N/A'}
                                    <br />
                                    <small>
                                      {attendance.seanceStartsAt ? new Date(attendance.seanceStartsAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                    </small>
                                  </td>
                                  <td>
                                    <span className={`status-badge ${attendance.status?.toLowerCase() || ''}`}>
                                      {attendance.status || 'N/A'}
                                    </span>
                                  </td>
                                  <td>
                                    {attendance.createdAt ? new Date(attendance.createdAt).toLocaleDateString() : 'N/A'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="no-attendance">No attendance records found</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
      
      <style>{`
        .teachers-admin-container {
          padding: 20px;
        }
        
        .teachers-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .teachers-table th,
        .teachers-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        .teachers-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #333;
        }
        
        .teachers-table tr:hover {
          background-color: #f5f5f5;
        }
        
        .teacher-row {
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .teacher-row:hover {
          background-color: #e3f2fd !important;
        }
        
        .teacher-row.expanded {
          background-color: #bbdefb !important;
          border-bottom: 2px solid #2196f3;
        }
        
        .attendance-row {
          background-color: #f8f9fa;
        }
        
        .attendance-container {
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin: 10px 0;
        }
        
        .attendance-container h3 {
          margin-top: 0;
          color: #333;
          border-bottom: 2px solid #2196f3;
          padding-bottom: 10px;
        }
        
        .attendance-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
          background: white;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #ddd;
        }
        
        .attendance-table th,
        .attendance-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        .attendance-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #ddd;
        }
        
        .attendance-table tr:hover {
          background-color: #f5f5f5;
        }
        
        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-badge.present {
          background-color: #d4edda;
          color: #155724;
        }
        
        .status-badge.absent {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .status-badge.late {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .no-attendance {
          color: #666;
          font-style: italic;
          text-align: center;
          padding: 20px;
        }
        
        .groups-list {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        
        .group-badge {
          background-color: #007bff;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
        
        .no-groups,
        .no-seances {
          color: #666;
          font-style: italic;
        }
        
        .seances-list {
          max-height: 100px;
          overflow-y: auto;
        }
        
        .seance-item {
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid #eee;
        }
        
        .seance-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .error {
          color: #dc3545;
          background-color: #f8d7da;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #f5c6cb;
        }
      `}</style>
    </div>
  );
}
