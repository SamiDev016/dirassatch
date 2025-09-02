

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

    const academies = (userData.roles || []).reduce((acc, r) => {
        let academy = acc.find(a => a.academyId === r.academyId);

        if (!academy) {
            academy = {
                academyId: r.academyId,
                academyName: r.academyName,
                roles: new Set()
            };
            acc.push(academy);
        }

        academy.roles.add(r.role.name); 
        return acc;
    }, []).map(a => ({
        ...a,
        roles: Array.from(a.roles) 
    }));

    return {
        globalRoles: getGlobalRoles(),
        academies,
        user: userData
    };
};


export const resolveDashboardRoute = async (choosenAcademyId) => {
    const { globalRoles, academies } = await getUserRoles();

    if (globalRoles.includes("superAdmin")) {
        return "/dashboard/super-admin";
    }

    if (academies.length === 1) {
        const academy = academies[0];

        if (academy.roles.includes("manager")) {
            const route = `/dashboard/academy/${academy.academyId}/admin`;
            return route;
        }

        const route = `/dashboard/academy/${academy.academyId}`;
        return route;
    }

    if (academies.length > 1) {
        const academy = academies.find(a => a.academyId === choosenAcademyId);
        if (academy.roles.includes("manager")) {
            const route = `/dashboard/academy/${academy.academyId}/admin`;
            return route;
        }
        const route = `/dashboard/academy/${academy.academyId}/admin`;
        return route;
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


export async function getChaptersByCourse({id}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/chapters/course/${id}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to get chapters by course");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error getting chapters by course:", error);
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
  }) {
    const API_BASE = import.meta.env.PROD
      ? import.meta.env.VITE_API_URL
      : "/api";
  
    try {
      // Debug: log the payload before sending
      const payload = {
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
      };
      console.log("🚀 createCourse payload:", payload);
  
      const response = await fetch(`${API_BASE}/course/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      // Debug: log the raw response
      console.log("🚀 createCourse raw response:", response);
  
      const resultText = await response.text(); // get raw text first
      console.log("🚀 createCourse response text:", resultText);
  
      // Try parsing JSON
      let result;
      try {
        result = JSON.parse(resultText);
      } catch (parseError) {
        console.warn("⚠️ Failed to parse JSON response:", parseError);
        result = resultText; // fallback to raw text
      }
  
      if (!response.ok) {
        throw new Error(
          `Failed to create course. Status: ${response.status}, Response: ${resultText}`
        );
      }
  
      return result;
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
export async function getGroupsByAcademy({academyId}){
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/groups/academy/${academyId}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        if (!response.ok) throw new Error("Failed to fetch groups");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching groups:", error);
        return null;
    }
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

export async function addMemberToGroup({userId,groupId,role}){ //STUDENT
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
            body: JSON.stringify({ userId,role })
        });
        if (!response.ok) throw new Error("Failed to add user to group");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error adding user to group:", error);
        return null;
    }
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
    
