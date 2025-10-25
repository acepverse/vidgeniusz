import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// Fix: Import AuthenticatedUser instead of User for better security.
import { authenticateUser, AuthenticatedUser, createUser, getOrCreateGoogleUser } from '../services/database';

interface AuthContextType {
    // Fix: Use AuthenticatedUser type which does not contain the password hash.
    user: AuthenticatedUser | null;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
    login: (username: string, pass: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
    register: (username: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Fix: Use AuthenticatedUser type for the user state.
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        // Check for a logged-in user in localStorage on initial load
        const storedUser = localStorage.getItem('vidgenius_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const login = async (username: string, pass: string) => {
        const authenticatedUser = authenticateUser(username, pass);
        if (authenticatedUser) {
            setUser(authenticatedUser);
            localStorage.setItem('vidgenius_user', JSON.stringify(authenticatedUser));
            closeLoginModal(); // Close modal on successful login
        } else {
            throw new Error('Invalid username or password');
        }
    };
    
    const loginWithGoogle = async () => {
        const googleUser = getOrCreateGoogleUser();
        setUser(googleUser);
        localStorage.setItem('vidgenius_user', JSON.stringify(googleUser));
        closeLoginModal();
    };


    const register = async (username: string, pass: string) => {
        // This will throw an error if registration fails (e.g., username exists),
        // which will be caught and handled by the UI component.
        createUser(username, pass);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('vidgenius_user');
    };

    return (
        <AuthContext.Provider value={{ user, isLoginModalOpen, openLoginModal, closeLoginModal, login, loginWithGoogle, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};