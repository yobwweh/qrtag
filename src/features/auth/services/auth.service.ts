import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export class AuthService {
    /**
     * Connexion avec email et mot de passe
     */
    static async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw error;
        }

        return data;
    }

    /**
     * Inscription d'un nouveau utilisateur
     */
    static async signUp(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            throw error;
        }

        return data;
    }

    /**
     * Déconnexion
     */
    static async signOut() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }
    }

    /**
     * Récupérer l'utilisateur actuel
     */
    static async getCurrentUser(): Promise<User | null> {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }

    /**
     * Écouter les changements d'état d'authentification
     */
    static onAuthStateChange(callback: (user: User | null) => void) {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(session?.user ?? null);
        });
    }
}
