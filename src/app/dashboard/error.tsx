"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA] px-6">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Oups ! Une erreur est survenue</h1>
                <p className="text-gray-500 mb-8">
                    Nous n'avons pas pu charger les données. Cela peut être dû à un problème de connexion ou de serveur.
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                        Réessayer
                    </button>
                    <Link
                        href="/"
                        className="w-full bg-white text-gray-700 py-4 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
