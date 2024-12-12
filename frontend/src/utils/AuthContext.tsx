'use client';
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                setIsLoggedIn(false);
                return;
            }

            try {
                const response = await fetch('https://frozen-eliminate-cheap-video.trycloudflare.com/validate-token', {
                    method: 'POST',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setIsLoggedIn(true);
                } else {
                    localStorage.removeItem('auth-token');
                    setIsLoggedIn(false);
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error validating token:', error);
                setIsLoggedIn(false);
                router.push('/login');
            }
        };

        validateToken();
    }, [router]);

    const login = (token: string) => {
        localStorage.setItem('auth-token', token);
        setIsLoggedIn(true);
        router.push('/');
    };

    const logout = () => {
        localStorage.removeItem('auth-token');
        setIsLoggedIn(false);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
