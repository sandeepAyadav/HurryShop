import React, { createContext } from 'react';


export const AuthDataContext = createContext();

const AuthContextProvider = ({ children }) => {
    const serverUrl = import.meta.env.VITE_API_BASE_URL;

    const value = {
        serverUrl
    };

    return (
        <AuthDataContext.Provider value={value}>
            {children}
        </AuthDataContext.Provider>
    );
};

export default AuthContextProvider;