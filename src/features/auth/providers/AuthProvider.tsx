"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { AuthContext } from '../context/AuthContext';
import { AuthService } from '../services/auth.service';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Vérifier l'utilisateur au chargement
        AuthService.getCurrentUser().then(user => {
            setUser(user);
            setLoading(false);
        });

        // Écouter les changements d'authentification
        const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        await AuthService.signIn(email, password);
        router.push('/');
    };

    const signOut = async () => {
        await AuthService.signOut();
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
