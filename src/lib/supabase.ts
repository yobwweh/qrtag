import { createBrowserClient } from '@supabase/ssr';

// On récupère les clés du fichier .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Utilisation de createBrowserClient pour synchroniser la session avec les cookies
// Cela permet au middleware de voir l'utilisateur connecté
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);