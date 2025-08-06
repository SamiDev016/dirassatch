// export const isLoggedIn = () => {
//     const token = localStorage.getItem("token");
//     return !!token;
//   };
  
//   export const logout = () => {
//     localStorage.removeItem("token");
//   };
  
//   export const getToken = () => {
//     return localStorage.getItem("token");
//   };
export const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token;
};

export const storeUserInfo = (userInfo) => {
    if (userInfo.accessToken) localStorage.setItem("token", userInfo.accessToken);
    if (userInfo.userId) localStorage.setItem("userId", userInfo.userId);
    if (userInfo.accountId) localStorage.setItem("accountId", userInfo.accountId);
    if (userInfo.email) localStorage.setItem("email", userInfo.email);
    if (userInfo.firstName) localStorage.setItem("firstName", userInfo.firstName);
    if (userInfo.lastName) localStorage.setItem("lastName", userInfo.lastName);
    if (userInfo.profilePhoto !== undefined) localStorage.setItem("profilePhoto", userInfo.profilePhoto);
    if (userInfo.isSuperAdmin !== undefined) localStorage.setItem("isSuperAdmin", userInfo.isSuperAdmin);
    if (userInfo.ownedAcademies !== undefined) localStorage.setItem("ownedAcademies", userInfo.ownedAcademies);

    console.log("User info stored:", userInfo);
};

export const getUserInfo = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const accountId = localStorage.getItem("accountId");
    const email = localStorage.getItem("email");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const profilePhoto = localStorage.getItem("profilePhoto");
    const isSuperAdmin = localStorage.getItem("isSuperAdmin");
    const ownedAcademies = localStorage.getItem("ownedAcademies");
    return {
        token,
        userId,
        accountId,
        email,
        firstName,
        lastName,
        profilePhoto,
        isSuperAdmin,
        ownedAcademies
    };
};

export const getUserRoles = async (userId, role) => {
    const API_BASE = import.meta.env.PROD
        ? import.meta.env.VITE_API_URL
        : "/api";
    let endpoint = "";

    if (role === "super-admin") {
        endpoint = `${API_BASE}/super-admin/${userId}`;
    } else {
        endpoint = `${API_BASE}/academy/user/${userId}?role=${role}`;
    }
    try {
        const response = await fetch(endpoint);
        if (response.ok) {
            const data = await response.json();
            if (data && (Array.isArray(data) ? data.length > 0 : true)) {
                console.log(data);
                return data;
            }
        }
        return [];
    } catch (error) {
        return [];
    }
};

export const getUserId = () => {
    const id = localStorage.getItem("userId");
    return id ? Number(id) : null;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("accountId");
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("profilePhoto");
    localStorage.removeItem("isSuperAdmin");
    localStorage.removeItem("ownedAcademies");
};

export const getToken = () => {
    return localStorage.getItem("token");
};