'use client';
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isLoggedIn: boolean | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
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
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                    },
                });

                if (response.ok) {
                    setIsLoggedIn(true);
                } else {
                    localStorage.removeItem('auth-token');
                    setIsLoggedIn(false);
                    router.push('/');
                }
            } catch (error) {
                console.error('Error validating token:', error);
                setIsLoggedIn(false);
                router.push('/');
            }
        };

        validateToken();
    }, []);

    const login = (token: string) => {
        localStorage.setItem('auth-token', token);
        setIsLoggedIn(true);
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('auth-token');
        setIsLoggedIn(false);
        router.push('/');
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
