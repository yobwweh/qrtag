"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

interface QRCodeScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure?: (error: any) => void;
}

export const QRCodeScanner = ({ onScanSuccess, onScanFailure }: QRCodeScannerProps) => {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let scanner: Html5QrcodeScanner | null = null;

        try {
            scanner = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
        /* verbose= */ false
            );

            scanner.render(
                (decodedText) => {
                    if (scanner) {
                        scanner.clear().catch(console.error);
                    }
                    setScanResult(decodedText);
                    onScanSuccess(decodedText);
                },
                (errorMessage) => {
                    // Ignore les erreurs répétées de scan (normales)
                    if (!errorMessage.includes("NotFoundException")) {
                        console.warn("Erreur scan:", errorMessage);
                    }
                }
            );
        } catch (err: any) {
            console.error("Erreur initialisation scanner:", err);
            setError("Impossible d'initialiser le scanner. Vérifiez les permissions de la caméra.");
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode scanner. ", error);
                });
            }
        };
    }, [onScanSuccess]);

    return (
        <div className="w-full max-w-md mx-auto">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                    <p className="font-bold">Erreur</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <div id="reader" className="rounded-3xl overflow-hidden"></div>

            {scanResult && (
                <p className="text-center mt-4 font-bold text-green-400">
                    Code détecté ! Redirection...
                </p>
            )}

            {!error && !scanResult && (
                <p className="text-center mt-4 text-slate-400 text-sm">
                    Autoriser l'accès à la caméra si demandé
                </p>
            )}
        </div>
    );
};
