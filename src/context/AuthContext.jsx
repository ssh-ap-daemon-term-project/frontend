import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(() => {
        const storedAuthState = localStorage.getItem('authState');

        if (storedAuthState) {
            // Parse stored data
            const parsedData = JSON.parse(storedAuthState);

            // Manually extract fields with fallbacks if any field is missing
            return {
                userId: parsedData.userId || null,
                userName: parsedData.userName || '',
                email: parsedData.email || '',
                phone: parsedData.phone || '',
                userType: parsedData.userType || '',
                isAuthenticated: !!parsedData.userId  // If we have stored data and userId is not null, user is authenticated
            };
        } else {
            // Default values if nothing in localStorage
            return {
                userId: null,
                userName: '',
                email: '',
                phone: '',
                userType: '',
                isAuthenticated: false
            };
        }
    });
    
    const contextSignin = (userId, userName, email, phone, userType) => {
        setAuthState({
            userId: userId,
            userName: userName,
            email: email,
            phone: phone,
            userType: userType,
            isAuthenticated: true
        });
    };

    const contextSignout = () => {
        setAuthState({
            userId: null,
            userName: '',
            email: '',
            phone: '',
            userType: '',
            isAuthenticated: false
        });
    };

    useEffect(() => {
        localStorage.setItem('authState', JSON.stringify(authState));
    }, [authState]);
    
    return (
        <AuthContext.Provider value={{
            isAuthenticated: authState.isAuthenticated,
            userId: authState.userId,
            userName: authState.userName,
            email: authState.email,
            phone: authState.phone,
            userType: authState.userType,
            contextSignin,
            contextSignout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
