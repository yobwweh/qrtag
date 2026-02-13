import { createClient } from '@supabase/supabase-js';

// On récupère les clés du fichier .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// On crée le client Supabase - Configuration pour Vercel deploy
export const supabase = createClient(supabaseUrl, supabaseAnonKey);