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