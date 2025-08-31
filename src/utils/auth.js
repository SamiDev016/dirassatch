

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

export const updateUserProfile = async (id, data) => {
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/user/edit-profile/${id}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Failed to update user profile");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        return null;
    }
};

export const isLoggedIn = () => {
    const token = getToken();
    return !!token;
};


export const logout = () => {
    localStorage.removeItem("token");
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
        body: JSON.stringify({ userId }) // ✅ pass userId, not email
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

        // Expected example response:
        // [
        //   { academyId: 1, academyName: "Optilens", roles: ["manager"] },
        //   { academyId: 2, academyName: "Wedad", roles: ["manager"] }
        // ]
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


export const resolveDashboardRoute = async () => {
    const { globalRoles, academies } = await getUserRoles();

    if (globalRoles.includes("superAdmin")) {
        return "/dashboard/super-admin";
    }

    if (academies.length === 1) {
        const academy = academies[0];

        if (academy.roles.includes("owner")) {
            const route = `/dashboard/academy/${academy.academyId}/admin`;
            return route;
        }

        const route = `/dashboard/academy/${academy.academyId}`;
        return route;
    }

    if (academies.length > 1) {
        return "/dashboard";
    }
    return "/dashboard";
};

