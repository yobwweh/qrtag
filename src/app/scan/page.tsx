"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { QRCodeScanner } from "@/features/scanner/views/QRCodeScanner";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserMenu } from "@/components/UserMenu";

export default function ScanPage() {
    const router = useRouter();

    const handleScan = (decodedText: string) => {
        // Supposons que le QR code contient l'URL complète ou juste l'ID
        // On essaie d'extraire l'ID. 
        // Format attendu : "https://domain.com/scan/ID" ou juste "ID"

        let id = decodedText;

        try {
            const url = new URL(decodedText);
            // Si c'est une URL valide, on regarde si elle correspond à notre structure
            if (url.pathname.startsWith('/scan/')) {
                const parts = url.pathname.split('/');
                id = parts[parts.length - 1];
            } else {
                // Si c'est une autre URL, on prend peut-être le dernier segment ?
                // Pour l'instant, faisons simple : si c'est une URL, on navigue vers celle-ci si elle est interne, sinon on extrait le dernier bout.
                const parts = url.pathname.split('/').filter(Boolean);
                if (parts.length > 0) id = parts[parts.length - 1];
            }
        } catch (e) {
            // Ce n'est pas une URL, on suppose que c'est l'ID brut
        }

        console.log("Scanned ID:", id);
        router.push(`/scan/${id}`);
    };

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative">
                <Link href="/dashboard" className="absolute top-6 left-6 w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all z-10">
                    ←
                </Link>

                <div className="absolute top-6 right-6 z-10">
                    <UserMenu />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2">SCANNER</h1>
                    <p className="text-slate-400 text-sm font-medium">Visez le QR Code du tag</p>
                </div>

                <div className="w-full">
                    <QRCodeScanner onScanSuccess={handleScan} />
                </div>
            </main>
        </ProtectedRoute>
    );
}
