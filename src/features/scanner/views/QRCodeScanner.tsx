"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

interface QRCodeScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure?: (error: any) => void;
}

export const QRCodeScanner = ({ onScanSuccess, onScanFailure }: QRCodeScannerProps) => {
    const [scanResult, setScanResult] = useState<string | null>(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                scanner.clear();
                setScanResult(decodedText);
                onScanSuccess(decodedText);
            },
            (error) => {
                if (onScanFailure) onScanFailure(error);
            }
        );

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5-qrcode scanner. ", error);
            });
        };
    }, [onScanSuccess, onScanFailure]);

    return (
        <div className="w-full max-w-md mx-auto">
            <div id="reader" className="overflow-hidden rounded-3xl shadow-xl border-4 border-slate-900"></div>
            {scanResult && (
                <p className="text-center mt-4 font-bold text-green-600">
                    Code détecté ! Redirection...
                </p>
            )}
        </div>
    );
};
