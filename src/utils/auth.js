export const setToken = (token) => {
    localStorage.setItem("token", token);
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUserId = () => {
    const token = getToken();
    if (!token) return null;
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.userId;
};

export const getUserData = async () => {
    const token = getToken();
    if (!token) return null;

    const API_BASE = import.meta.env.PROD
        ? import.meta.env.VITE_API_URL
        : "/api";

    try {
        const response = await fetch(`${API_BASE}/user/me`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        return await response.json();
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};

export const setIsSuperAdmin = (isSuperAdmin) => {
    localStorage.setItem("isSuperAdmin", JSON.stringify(isSuperAdmin));
};
export const getIsSuperAdmin = () => {
    return JSON.parse(localStorage.getItem("isSuperAdmin"));
}
    
export const getUserById = async (id) => {
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/user/${id}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });
        if (!response.ok) throw new Error("Failed to fetch user by ID");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
};

export const getUserByEmail = async (email) => {
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/user/by-email/${email}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });
        if (!response.ok) throw new Error("Failed to fetch user by email");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return null;
    }
};

export const updateUserProfile = async (id, firstName, lastName, phone, profilePhoto) => {
    const API_BASE = import.meta.env.PROD
        ? import.meta.env.VITE_API_URL
        : "/api";

    const url = `${API_BASE}/user/edit-profile/${id}`;
    const payload = { id, firstName, lastName, phone, profilePhoto };

    console.log("🔵 [updateUserProfile] URL:", url);
    console.log("🔵 [updateUserProfile] Payload:", payload);
    console.log("🔵 [updateUserProfile] Token:", getToken());

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        console.log("🟡 [updateUserProfile] Response Status:", response.status);

        // Try to parse response text even if not ok
        const responseText = await response.text();
        console.log("🟡 [updateUserProfile] Raw Response Text:", responseText);

        if (!response.ok) {
            throw new Error(`Failed to update user profile. Status: ${response.status}`);
        }

        // Try parsing JSON after checking
        const data = JSON.parse(responseText);
        console.log("🟢 [updateUserProfile] Parsed Response Data:", data);

        return data;
    } catch (error) {
        console.error("🔴 [updateUserProfile] Error:", error);
        return null;
    }
};

export const isLoggedIn = () => {
    const token = getToken();
    return !!token;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedAcademyId");
};

export const getAllAcademies = async () => {
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/academy/all`, {
        });
        if (!response.ok) throw new Error("Failed to fetch academies");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching academies:", error);
        return null;
    }
};    

export const createAcademy = async (data) => {
    const API_BASE = import.meta.env.PROD
        ? import.meta.env.VITE_API_URL
        : "/api";
    try {
        const response = await fetch(`${API_BASE}/academy/create`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            },
            body: data
        });
        if (!response.ok) throw new Error("Failed to create academy");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error creating academy:", error);
        return null;
    }
};

export const getOwnersOfAcademy = async (id) => {
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/academy/${id}/owners`, {
           
        });
        if (!response.ok) throw new Error("Failed to fetch owners of academy");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching owners of academy:", error);
        return null;
    }
}

export const getAcademyDetails = async (id) => {
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try{
        const res = await fetch(`${API_BASE}/academy/${id}`);
        if(!res.ok) throw new Error("Failed to fetch academy details");
        const data = await res.json();
        return data;
    }catch(error){
        console.error("Error fetching academy details:", error);
        return null;
    }
}

export const addOwnerToAcademy = async (academyId, userId) => {
    const API_BASE = import.meta.env.PROD
      ? import.meta.env.VITE_API_URL
      : "/api";
  
    try {
      const response = await fetch(`${API_BASE}/academy/${academyId}/add-owner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ userId }) 
      });
  
      if (!response.ok) throw new Error("Failed to add owner");
  
      return await response.json();
    } catch (error) {
      console.error("Error adding owner:", error);
      throw error;
    }
  };
  
export const getTeachersByAcademy = async ({academyId}) =>
{
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/academy/${academyId}`, {
           
        });
        if (!response.ok) throw new Error("Failed to fetch teachers of academy");
        const data = await response.json();
        //we need only teachers
        const teachers = data.teachers;
        return teachers;
    } catch (error) {
        console.error("Error fetching teachers of academy:", error);
        return null;
    }
}

export const getStudentsByAcademy = async ({academyId}) =>
    {
        const API_BASE = import.meta.env.PROD
        ? import.meta.env.VITE_API_URL
        : "/api";
        try {
            const response = await fetch(`${API_BASE}/academy/${academyId}`, {
            });
            if (!response.ok) throw new Error("Failed to fetch students of academy");
            const data = await response.json();
            //we need only students
            const students = data.students;
            return students;
        } catch (error) {
            console.error("Error fetching teachers of academy:", error);
            return null;
        }
    }

// AI FUNCTIONS

export const getUserAcademyRoles = async (userId) => {
    const API_BASE = import.meta.env.PROD
        ? import.meta.env.VITE_API_URL
        : "/api";

    try {
        const response = await fetch(`${API_BASE}/academy/user/${userId}`, {
            headers: { "Authorization": `Bearer ${getToken()}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user academy roles");

        return await response.json();
    } catch (error) {
        console.error("Error fetching user academy roles:", error);
        return [];
    }
};


export const getGlobalRoles = () => {
    return getIsSuperAdmin() ? ["superAdmin"] : [];
};

export const getUserRoles = async () => {
    const userId = getUserId();
    if (!userId) return { globalRoles: [], academies: [], user: null };

    const userData = await getUserData();
    if (!userData) {
        return { globalRoles: [], academies: [], user: null };
    }

    const academies = [];

    // Handle academyLinks (owner / manager)
    (userData.academyLinks || []).forEach(link => {
        let academy = academies.find(a => a.academyId === link.academyId);

        if (!academy) {
            academy = {
                academyId: link.academyId,
                academyName: link.academy?.name || "",
                roles: new Set()
            };
            academies.push(academy);
        }

        if (link.role?.name) {
            academy.roles.add(link.role.name.toLowerCase()); // e.g. "owner"
        }
    });

    // Handle groups (STUDENT / TEACHER)
    (userData.groups || []).forEach(group => {
        const academyId = group.course?.academy?.id;
        if (!academyId) return;

        let academy = academies.find(a => a.academyId === academyId);

        if (!academy) {
            academy = {
                academyId,
                academyName: group.course?.academy?.name || "",
                roles: new Set()
            };
            academies.push(academy);
        }

        if (group.role) {
            academy.roles.add(group.role.toLowerCase()); // "student" / "teacher"
        }
    });

    return {
        globalRoles: getGlobalRoles(),
        academies: academies.map(a => ({
            ...a,
            roles: Array.from(a.roles)
        })),
        user: userData
    };
};


export const resolveDashboardRoute = async (choosenAcademyId, choosenRole) => {
    const { globalRoles, academies } = await getUserRoles();

    if (globalRoles.includes("superAdmin")) {
        return "/dashboard/super-admin";
    }

    if (academies.length === 1) {
        const academy = academies[0];
        console.log("🔵 [resolveDashboardRoute]     choosenRole********:", choosenRole);
        if (choosenRole === "manager" || choosenRole === "owner") {
            return `/dashboard/academy/${academy.academyId}/admin`;
        }

        if (choosenRole === "teacher") {
            return `/dashboard/academy/${academy.academyId}/teacher`;
        }

        if (choosenRole === "student") {
            return `/dashboard/academy/${academy.academyId}/student`;
        }

        return `/dashboard/academy/${academy.academyId}`;
    }

    if (academies.length > 1) {
        const academy = academies.find(a => a.academyId === choosenAcademyId);
        if (!academy) return "/dashboard";

        if (choosenRole === "manager" || choosenRole === "owner") {
            return `/dashboard/academy/${academy.academyId}/admin`;
        }

        if (choosenRole === "teacher") {
            return `/dashboard/academy/${academy.academyId}/teacher`;
        }

        if (choosenRole === "student") {
            return `/dashboard/academy/${academy.academyId}/student`;
        }

        return `/dashboard/academy/${academy.academyId}/admin`;
    }

    return "/dashboard";
};

//Modules

export async function createModule({name}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/modules/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ name })
        });
        if (!response.ok) throw new Error("Failed to create module");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error creating module:", error);
        return null;
    }
}


export async function updateModule({ id, name }) {
    const API_BASE = import.meta.env.PROD
      ? import.meta.env.VITE_API_URL
      : "/api";
  
    try {
      const response = await fetch(`${API_BASE}/modules/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name }),
      });
  
      if (!response.ok) throw new Error("Failed to update module");
      return await response.json();
    } catch (error) {
      console.error("Error updating module:", error);
      return null;
    }
  }
  


export async function getModuleByID(id){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/modules/${id}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to get module by ID");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error getting module by ID:", error);
        return null;
    }
}

export async function getAllModules(){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/modules/all`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to get all modules");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error getting all modules:", error);
        return null;
    }
}
// Chapters
export async function createChapter({ name, description, order, isPublished, courseId }) {
    const API_BASE = import.meta.env.PROD
        ? import.meta.env.VITE_API_URL
        : "/api";

    try {
        const response = await fetch(`${API_BASE}/chapters`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ name, description, order, isPublished, courseId }),
        });

        // Debugging
        console.log("Response status:", response.status);
        console.log("Response headers:", [...response.headers.entries()]);

        // Clone so we can read body twice (debug + actual)
        const clone = response.clone();
        const text = await clone.text();
        console.log("Raw response body:", text);

        if (!response.ok) throw new Error(`Failed to create chapter: ${response.status}`);

        const result = await response.json();
        console.log("Parsed JSON result:", result);

        return result;
    } catch (error) {
        console.error("Error creating chapter:", error);
        return null;
    }
}


export async function getChaptersByCourse({courseId}){
    console.log('🔍 getChaptersByCourse called with courseId:', courseId);
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        console.log('🔍 Making API call to:', `${API_BASE}/chapters/course/${courseId}`);
        const response = await fetch(`${API_BASE}/chapters/course/${courseId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        console.log('🔍 API response status:', response.status);
        if (!response.ok) {
            console.error('🔴 API response not ok:', response.statusText);
            throw new Error(`Failed to get chapters by course. Status: ${response.status}`);
        }
        const result = await response.json();
        console.log('🟢 API response data:', result);
        return result;
    } catch (error) {
        console.error("🔴 Error getting chapters by course:", error);
        return null;
    }
}

export async function getChapterById({id}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/chapters/${id}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to get chapter by ID");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error getting chapter by ID:", error);
        return null;
    }
}

export async function updateChapter({id,name,description,order,isPublished,courseId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/chapters/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ name,description,order,isPublished,courseId })
        });
        if (!response.ok) throw new Error("Failed to update chapter");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error updating chapter:", error);
        return null;
    }
}

export async function deleteChapter({id}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/chapters/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to delete chapter");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting chapter:", error);
        return null;
    }
}

//Courses
export async function getAllCourses(){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/course/all`, {
        });
        if (!response.ok) throw new Error("Failed to fetch courses");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching courses:", error);
        return null;
    }
}
export async function createCourse({
    cover,
    academyId,
    moduleId,
    name,
    description,
    targetAudience,
    prerequisites,
    whatYouWillLearn,
    whatYouCanDoAfter,
    minAge,
    maxAge,
    price,
    chapters,
    coverFile, // Add file parameter
  }) {
    const API_BASE = import.meta.env.PROD
      ? import.meta.env.VITE_API_URL
      : "/api";
  
    try {
      // If there's a file, use FormData for multipart upload
      if (coverFile) {
        const formData = new FormData();
        
        // Append the file
        formData.append('cover', coverFile);
        
        // Append other fields as strings
        formData.append('academyId', academyId ? String(academyId) : '');
        formData.append('moduleId', moduleId ? String(moduleId) : '');
        formData.append('name', name || '');
        formData.append('description', description || '');
        formData.append('targetAudience', targetAudience || '');
        formData.append('prerequisites', prerequisites || '');
        formData.append('whatYouWillLearn', whatYouWillLearn || '');
        formData.append('whatYouCanDoAfter', whatYouCanDoAfter || '');
        formData.append('minAge', minAge ? String(minAge) : '');
        formData.append('maxAge', maxAge ? String(maxAge) : '');
        formData.append('price', price ? String(price) : '0');
        
        // Append chapters as JSON string
        const chaptersData = JSON.stringify(
          Array.isArray(chapters)
            ? chapters.map((ch, index) => ({
                name: ch.title,
                description: ch.content,
                order: index + 1,
              }))
            : []
        );
        formData.append('chapters', chaptersData);
        
        console.log("🚀 createCourse FormData payload:", Object.fromEntries(formData));
        
        const response = await fetch(`${API_BASE}/course/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            // Don't set Content-Type header when using FormData, browser will set it automatically with boundary
          },
          body: formData,
        });
        
        console.log("🚀 createCourse raw response:", response);
        
        const resultText = await response.text();
        console.log("🚀 createCourse response text:", resultText);
        
        let result;
        try {
          result = JSON.parse(resultText);
        } catch {
          result = resultText;
        }
        
        if (!response.ok) {
          throw new Error(
            `Failed to create course. Status: ${response.status}, Response: ${resultText}`
          );
        }
        
        return result;
      } else {
        // If no file, use the original JSON approach
        const payload = {
          cover: cover || "",
          academyId: academyId ? Number(academyId) : null,
          moduleId: moduleId ? Number(moduleId) : null,
          name: name || "",
          description: description || "",
          targetAudience: targetAudience || "",
          prerequisites: prerequisites || "",
          whatYouWillLearn: whatYouWillLearn || "",
          whatYouCanDoAfter: whatYouCanDoAfter || "",
          minAge: minAge ? Number(minAge) : null,
          maxAge: maxAge ? Number(maxAge) : null,
          price: price ? Number(price) : 0,
          chapters: JSON.stringify(
            Array.isArray(chapters)
              ? chapters.map((ch, index) => ({
                  name: ch.title,
                  description: ch.content,
                  order: index + 1,
                }))
              : []
          ),
        };
        
        console.log("🚀 createCourse final payload:", payload);
        
        const response = await fetch(`${API_BASE}/course/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        
        console.log("🚀 createCourse raw response:", response);
        
        const resultText = await response.text();
        console.log("🚀 createCourse response text:", resultText);
        
        let result;
        try {
          result = JSON.parse(resultText);
        } catch {
          result = resultText;
        }
        
        if (!response.ok) {
          throw new Error(
            `Failed to create course. Status: ${response.status}, Response: ${resultText}`
          );
        }
        
        return result;
      }
    } catch (error) {
      console.error("❌ Error creating course:", error);
      return null;
    }
  }
  
  

export async function getCoursesByAcademy({academyId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/course/academy/${academyId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch courses");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching courses:", error);
        return null;
    }
}
    
export async function getCourseById({id}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/course/${id}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch course");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching course:", error);
        return null;
    }
}

//groups
export async function getGroupsByAcademy({ academyId }) {
    const courses = await getCoursesByAcademy({ academyId }); // ✅ await here
    const groups = [];

    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        const groupsByCourse = await getGroupsByCourse({ courseId: course.id });
        groups.push(...groupsByCourse);
    }

    return groups;
}

export async function createGroup({name,courseId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/groups`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name,courseId })
        });
        if (!response.ok) throw new Error("Failed to create group");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error creating group:", error);
        return null;
    }
}

export async function updateGroup({id,name,courseId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/groups/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name,courseId })
        });
        if (!response.ok) throw new Error("Failed to update group");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error updating group:", error);
        return null;
    }
}

export async function deleteGroup({id}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/groups/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to delete group");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting group:", error);
        return null;
    }
}

export async function getGroupByID({id}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/groups/${id}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch group");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching group:", error);
        return null;
    }
}
export async function addMemberToGroup({ userId, groupId, role }) {
    const API_BASE = import.meta.env.PROD
      ? import.meta.env.VITE_API_URL
      : "/api";
  
    try {
      const response = await fetch(`${API_BASE}/groups/${groupId}/members`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, groupId, role }), 
      });
  
      const text = await response.text();
      console.log("[addMemberToGroup] Raw response:", text);
  
      if (!response.ok) {
        throw new Error(`Failed to add user to group (${response.status})`);
      }
  
      return JSON.parse(text);
    } catch (error) {
      console.error(" Error adding user to group:", error);
      return null;
    }
  }

  export async function getTotalMemebersByAcademy({ $academyId }) {
    const academy = await getAcademyDetails($academyId);
    const teachers = academy.teachers || [];
    const students = academy.students || [];
    const countTeacher = teachers.length;
    const countStudent = students.length;
  
  
    return { countTeacher, countStudent };
  }
  
  


export async function getAllMembersOfGroup({groupId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/groups/${groupId}/members`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch members of group");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching members of group:", error);
        return null;
    }
}
    
export async function removeMemberFromGroup({userId,groupId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/groups/${groupId}/members/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to remove user from group");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error removing user from group:", error);
        return null;
    }
}
    
export async function getGroupsByCourse({courseId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/groups/course/${courseId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch groups by course");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching groups by course:", error);
        return null;
    }
}

export async function getAllTeachers() {
    const academies = await getAllAcademies(); // add const
    let count = 0;

    for (let i = 0; i < academies.length; i++) {
        const academy = academies[i];
        const teachers = await getTeachersByAcademy({ academyId: academy.id || academy.academyId });
        count += teachers.length;
    }
    return count;
}
export async function getAllStudents() {
    const academies = await getAllAcademies(); 
    let count = 0;

    for (let i = 0; i < academies.length; i++) {
        const academy = academies[i];
        const students = await getStudentsByAcademy({ academyId: academy.id || academy.academyId });
        count += students.length;
    }
    return count;
}


//sections
export async function createSection({name,description,order,chapterId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/sections`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name,description,order,chapterId })
        });
        if (!response.ok) throw new Error("Failed to create section");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error creating section:", error);
        return null;
    }
}

export async function getSectionsByChapter({chapterId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/sections/chapter/${chapterId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch sections by chapter");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching sections by chapter:", error);
        return null;
    }
}

export async function getSectionByID({sectionId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/sections/${sectionId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch section by ID");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching section by ID:", error);
        return null;
    }
}

export async function updateSection({sectionId,name,description,order,chapterId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/sections/${sectionId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name,description,order,chapterId })
        });
        if (!response.ok) throw new Error("Failed to update section");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error updating section:", error);
        return null;
    }
}

export async function deleteSection({sectionId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/sections/${sectionId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to delete section");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting section:", error);
        return null;
    }
}


//seances
export async function createSeance({
    title,
    date,
    startTime,
    endTime,
    notes,
    meetingUrl,
    mode,
    groupId,
    teacherId,
    chapterId,
  }) {
    const API_BASE = import.meta.env.PROD
      ? import.meta.env.VITE_API_URL
      : "/api";
  
    const payload = {
      title,
      date,
      startTime,
      endTime,
      notes,
      meetingUrl,
      mode,
      groupId,
      teacherId,
      chapterId,
    };
  
    console.log("[createSeance] API_BASE:", API_BASE);
    console.log("[createSeance] Payload:", payload);
  
    try {
      const response = await fetch(`${API_BASE}/seances`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      console.log("[createSeance] Response status:", response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("[createSeance] Failed response body:", errorText);
        throw new Error(`Failed to create seance. Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("[createSeance] Success:", result);
  
      return result;
    } catch (error) {
      console.error("[createSeance] Error:", error);
      return null;
    }
  }
  

export async function getAllSeance(){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/seances`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch seances");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching seances:", error);
        return null;
    }
}

export async function getSeanceByGroup({groupId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/seances/group/${groupId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch seances by group");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching seances by group:", error);
        return null;
    }
}

export async function getSeanceByTeacher({teacherId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/seances/teacher/${teacherId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch seances by teacher");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching seances by teacher:", error);
        return null;
    }
}

export async function getSeanceById({seanceId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/seances/${seanceId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch seance by ID");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching seance by ID:", error);
        return null;
    }
}

export async function updateSeance({seanceId,title,date,startTime,endTime,notes,meetingUrl,mode,groupId,teacherId,chapterId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/seances/${seanceId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title,date,startTime,endTime,notes,meetingUrl,mode,groupId,teacherId,chapterId })
        });
        if (!response.ok) throw new Error("Failed to update seance");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error updating seance:", error);
        return null;
    }
}

export async function deleteSeance({seanceId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/seances/${seanceId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to delete seance");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting seance:", error);
        return null;
    }
}

//attendance

export async function createAttendance({seanceId,userId,status}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/attendance`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ seanceId,userId,status })
        });
        if (!response.ok) throw new Error("Failed to create attendance");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error creating attendance:", error);
        return null;
    }
}

export async function getAllAttendance(){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/attendance`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch attendance");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return null;
    }
}

export async function getAttendanceBySeanceUser({seanceId,userId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/attendance/seance/${seanceId}/user/${userId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch attendance by seance user");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching attendance by seance user:", error);
        return null;
    }
}

export async function updateAttendanceBySeanceUser({seanceId,userId,status}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/attendance/seance/${seanceId}/user/${userId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error("Failed to update attendance by seance user");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error updating attendance by seance user:", error);
        return null;
    }
}

export async function deleteAttendanceBySeanceUser({seanceId,userId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/attendance/seance/${seanceId}/user/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to delete attendance by seance user");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting attendance by seance user:", error);
        return null;
    }
}

export async function getAttendacesBySeance({seanceId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/attendance/seance/${seanceId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch attendance by seance");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching attendance by seance:", error);
        return null;
    }
}

export async function getAttendacesByUser({userId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/attendance/user/${userId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch attendance by user");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching attendance by user:", error);
        return null;
    }
}


export async function createExam({ name, dateTime, duration, groupId }) {
    const API_BASE = import.meta.env.PROD
      ? import.meta.env.VITE_API_URL
      : "/api";
  
    try {
      const payload = {
        name,
        dateTime,
        duration: Number(duration), // ✅ ensure integer
        groupId: Number(groupId),   // ✅ ensure integer
      };
  
      console.log("📤 Sending Exam Payload:", payload);
  
      const response = await fetch(`${API_BASE}/exams`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      console.log("📥 Raw response status:", response.status);
      const rawBody = await response.text();
      console.log("📥 Raw response body:", rawBody);
  
      if (!response.ok) throw new Error(`Failed to create exam. Status: ${response.status}, Body: ${rawBody}`);
  
      const result = JSON.parse(rawBody);
      console.log("✅ Parsed result:", result);
  
      return result;
    } catch (error) {
      console.error("❌ Error creating exam:", error);
      return null;
    }
}
  
  

export async function getAllExams(){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/exams`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch exams");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching exams:", error);
        return null;
    }
}

export async function getExamById({examId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/exams/${examId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch exam by ID");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching exam by ID:", error);
        return null;
    }
}

export async function updateExam({examId,name,dateTime,duration,groupId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/exams/${examId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name,dateTime,duration,groupId })
        });
        if (!response.ok) throw new Error("Failed to update exam");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error updating exam:", error);
        return null;
    }
}

export async function deleteExam({examId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/exams/${examId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to delete exam");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting exam:", error);
        return null;
    }
}

export async function getExamsByGroup({groupId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/exams/group/${groupId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch exams by group");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching exams by group:", error);
        return null;
    }
}

export async function updateOrCreateGradeForUser({ examId, UserId, grade }) {
    const API_BASE = import.meta.env.PROD
      ? import.meta.env.VITE_API_URL
      : "/api";
  
    try {
      const payload = { grade }; // ✅ include grade value
      console.log("📤 Sending grade payload:", { examId, UserId, payload });
  
      const response = await fetch(`${API_BASE}/exams/${examId}/grade/${UserId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      console.log("📥 Raw response status:", response.status);
      const rawBody = await response.text();
      console.log("📥 Raw response body:", rawBody);
  
      if (!response.ok) {
        throw new Error(`Failed to update/create grade. Status: ${response.status}, Body: ${rawBody}`);
      }
  
      const result = JSON.parse(rawBody);
      console.log("✅ Parsed result:", result);
      return result;
    } catch (error) {
      console.error("❌ Error updating or creating grade for user:", error);
      return null;
    }
}
  

export async function getAllGradsByUser({userId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/exams/user/${userId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch grades by user");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching grades by user:", error);
        return null;
    }
}

export async function getLevelOfUserByModule({userId,moduleId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/exams/module-level/${moduleId}/${userId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch level of user by module");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching level of user by module:", error);
        return null;
    }
}

//enrollment request
export async function getEnrollmentRequestsByCourse({courseId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/enrollment-request/course/${courseId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch enrollment requests by course");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching enrollment requests by course:", error);
        return null;
    }
}

export async function acceptEnrollmentRequest({id}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/enrollment-request/${id}/accept`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to accept enrollment request");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error accepting enrollment request:", error);
        return null;
    }
}

// Enrollment Request API
export async function createEnrollmentRequest({groupId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/enrollment-request`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ groupId })
        });
        if (!response.ok) throw new Error("Failed to create enrollment request");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error creating enrollment request:", error);
        return null;
    }
}


//support 
// title required
// description string
// type required enum (document,video,link,exercise)
// url string
// content string
// isPublished boolean true ,false
// order number required
// sectionId required
// fileDate (upload file type string($binary))
export async function createSupport({title,description,type,url,content,isPublished,order,sectionId ,fileData}){
    console.log('🔍 createSupport called with:', { title, description, type, url, content, isPublished, order, sectionId, hasFileData: !!fileData });
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        // Use FormData for file uploads to avoid payload size issues
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('url', url || '');
        formData.append('content', content || '');
        formData.append('isPublished', isPublished);
        formData.append('order', order);
        formData.append('sectionId', sectionId);
        
        // Only append fileData if it exists and is not too large
        if (fileData) {
            // Check if fileData is a base64 string and extract the actual data
            if (typeof fileData === 'string' && fileData.startsWith('data:')) {
                // Extract the base64 part after the comma
                const base64Data = fileData.split(',')[1];
                if (base64Data && base64Data.length < 1000000) { // Less than 1MB
                    formData.append('fileData', base64Data);
                } else {
                    console.warn('🟡 File too large, skipping file upload');
                }
            } else {
                formData.append('fileData', fileData);
            }
        }
        
        console.log('🔍 Making API call to:', `${API_BASE}/supports`);
        const response = await fetch(`${API_BASE}/supports`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                // Don't set Content-Type when using FormData, browser will set it automatically with boundary
            },
            body: formData
        });
        
        console.log('🔍 API response status:', response.status);
        if (!response.ok) {
            console.error('🔴 API response not ok:', response.statusText);
            throw new Error(`Failed to create support. Status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('🟢 API response data:', result);
        return result;
    } catch (error) {
        console.error("🔴 Error creating support:", error);
        return null;
    }
}


export async function getAllSupportsBySection({sectionId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/supports/section/${sectionId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch supports by section");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching supports by section:", error);
        return null;
    }
}

export async function getSupportById({supportId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/supports/${supportId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch support by id");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching support by id:", error);
        return null;
    }
}

export async function updateSupport({supportId,title,description,type,url,content,isPublished,order,sectionId ,fileData}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/supports/${supportId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title,description,type,url,content,isPublished,order,sectionId ,fileData })
        });
        if (!response.ok) throw new Error("Failed to update support");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error updating support:", error);
        return null;
    }
}

export async function deleteSupport({supportId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/supports/${supportId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to delete support");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting support:", error);
        return null;
    }
}
