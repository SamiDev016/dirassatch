
// Retrieves the profile of the currently authenticated user. Requires a valid JWT token in the Authorization header.

// Parameters
// Cancel
// Name	Description
// Authorization *
// string
// (header)
// JWT token

// Bearer your-jwt-token-here
// Execute
// Responses
// Code	Description	Links
// 200	
// Successfully retrieved user profile

// Media type

// application/json
// Controls Accept header.
// Example Value
// Schema
// {
//   "id": 1,
//   "email": "user@example.com",
//   "firstName": "John",
//   "lastName": "Doe",
//   "profilePhoto": "https://example.com/profile.jpg",
//   "isSuperAdmin": false,
//   "createdAt": "2025-01-01T00:00:00.000Z",
//   "updatedAt": "2025-01-01T00:00:00.000Z"
// Users


// GET
// /user/me
// Get current user profile


// GET
// /user/by-email/{email}
// Get user by email


// GET
// /user/{id}
// Get user by ID



// POST
// /user/edit-profile/{id}
// Update user profile



// POST
// /user/change-profilePhoto/{id}
// Change user profile photo



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
    return decodedToken.id;
};

export const getUserProfile = async () => {
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    try {
        const response = await fetch(`${API_BASE}/user/me`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};

export const setIsSuperAdmin = (isSuperAdmin) => {
    localStorage.setItem("isSuperAdmin", isSuperAdmin);
    console.log("IsSuperAdmin set successfully ::: " + isSuperAdmin)
}
export const getIsSuperAdmin = () => {
    return localStorage.getItem("isSuperAdmin");
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

