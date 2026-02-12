"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

interface QRCodeScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure?: (error: any) => void;
}

export const QRCodeScanner = ({ onScanSuccess, onScanFailure }: QRCodeScannerProps) => {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        const startScanner = async () => {
            try {
                setError(null);
                console.log("Initialisation du scanner...");

                const html5QrCode = new Html5Qrcode("reader");
                scannerRef.current = html5QrCode;

                console.log("Demande d'accès à la caméra...");

                await html5QrCode.start(
                    { facingMode: "environment" }, // Caméra arrière sur mobile
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 }
                    },
                    (decodedText) => {
                        console.log("QR Code détecté:", decodedText);
                        setScanResult(decodedText);
                        html5QrCode.stop().then(() => {
                            onScanSuccess(decodedText);
                        });
                    },
                    (errorMessage) => {
                        // Ignore les erreurs répétées (normales)
                    }
                );

                setIsScanning(true);
                console.log("Scanner démarré avec succès !");
            } catch (err: any) {
                console.error("Erreur démarrage scanner:", err);
                setError(`Erreur: ${err.message || "Impossible d'accéder à la caméra"}`);
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current && isScanning) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, [onScanSuccess]);

    return (
        <div className="w-full max-w-md mx-auto">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                    <p className="font-bold">Erreur</p>
                    <p className="text-sm">{error}</p>
                    <p className="text-xs mt-2">Assurez-vous d'autoriser l'accès à la caméra.</p>
                </div>
            )}

            <div
                id="reader"
                className="rounded-2xl overflow-hidden bg-black min-h-[300px]"
            ></div>

            {scanResult && (
                <p className="text-center mt-4 font-bold text-green-400 animate-pulse">
                    ✓ Code détecté ! Redirection...
                </p>
            )}

            {!error && !scanResult && !isScanning && (
                <div className="text-center mt-4">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-slate-400 text-sm">Initialisation de la caméra...</p>
                </div>
            )}

            {isScanning && !scanResult && (
                <p className="text-center mt-4 text-green-400 text-sm">
                    📷 Caméra active - Visez le QR code
                </p>
            )}
        </div>
    );
};
