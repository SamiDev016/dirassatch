

export const setToken = (token) => {
    localStorage.setItem("token", token);
    console.log("Token set successfully ::: " + token)
};
export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUserId = () => {
    const token = getToken();
    if (!token) return null;
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.id;
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
    console.log("IsSuperAdmin set successfully ::: " + isSuperAdmin);
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



// {
//     "id": 1,
//     "name": "optilens",
//     "logo": "https://storage.googleapis.com/daracademyfireproject.appspot.com/academy_logo/292356b0-767a-4983-b1c4-05ce4ceeb14c.png",
//     "phone": null,
//     "email": null,
//     "owners": [
//       {
//         "userId": 2,
//         "firstName": "Rayan",
//         "lastName": "Aouf",
//         "profilePhoto": "",
//         "isSuperAdmin": false,
//         "email": "rayanaouf1512@gmail.com"
//       }
//     ]
//   }

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