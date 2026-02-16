import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
    // This `try/catch` block is only here to have the middleware not crash if something goes wrong.
    try {
        // Create an unmodified response
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            request.cookies.set(name, value)
                        );
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        // This will refresh session if expired - required for Server Components
        // https://supabase.com/docs/guides/auth/server-side/nextjs
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Redirection si l'utilisateur n'est pas connecté et essaie d'accéder aux routes protégées
        const protectedRoutes = ["/dashboard", "/scan", "/admin"];
        const isProtectedRoute = protectedRoutes.some((route) =>
            request.nextUrl.pathname.startsWith(route)
        );

        if (isProtectedRoute && !user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Redirection si l'utilisateur est connecté et essaie d'accéder à /login
        if (request.nextUrl.pathname === "/login" && user) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return response;
    } catch (e) {
        // Si une erreur survient (ex: variables d'env manquantes), on laisse Next.js gérer
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
    }
};
