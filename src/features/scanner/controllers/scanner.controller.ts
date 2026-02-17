"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ScannerState, ScannerCapabilities, ScannerOptions } from "../models/scanner.model";
import { ScannerService } from "../services/scanner.service";

export const useScannerController = (onScanSuccess: (text: string) => void) => {
    const [state, setState] = useState<ScannerState>({
        isScanning: false,
        scanResult: null,
        error: null,
        torchOn: false,
        zoomValue: 1,
        isGalleryLoading: false,
    });

    const [capabilities, setCapabilities] = useState<ScannerCapabilities>({
        hasTorch: false,
        zoom: null,
    });

    const [options, setOptions] = useState<ScannerOptions>({
        useAudio: true,
        useVibration: true,
        useOverlay: true,
        useContinuousMode: false,
    });

    const scannerRef = useRef<Html5Qrcode | null>(null);
    const lastScanTimeRef = useRef<number>(0);
    const SCAN_DELAY = 3000; // Délai de 3 secondes en mode continu

    const startScanner = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, error: null }));
            const html5QrCode = new Html5Qrcode("reader");
            scannerRef.current = html5QrCode;

            await html5QrCode.start(
                { facingMode: "environment" },
                { fps: 15, qrbox: { width: 250, height: 250 } },
                async (decodedText) => {
                    const now = Date.now();
                    if (options.useContinuousMode && now - lastScanTimeRef.current < SCAN_DELAY) {
                        return; // Ignorer si trop récent
                    }

                    lastScanTimeRef.current = now;
                    setState(prev => ({ ...prev, scanResult: decodedText }));
                    ScannerService.playBeep(options.useAudio);
                    ScannerService.triggerVibration(options.useVibration);

                    if (!options.useContinuousMode) {
                        await ScannerService.toggleTorch(scannerRef.current, true); // Force off
                        html5QrCode.stop().then(() => onScanSuccess(decodedText));
                    } else {
                        onScanSuccess(decodedText);
                        // Reset visuel après 1.5s en mode continu
                        setTimeout(() => {
                            setState(prev => ({ ...prev, scanResult: null }));
                        }, 1500);
                    }
                },
                () => { }
            );

            const caps = html5QrCode.getRunningTrackCapabilities();
            setCapabilities({
                hasTorch: !!(caps as any)?.torch,
                zoom: (caps as any)?.zoom || null,
            });
            setState(prev => ({ ...prev, isScanning: true, zoomValue: (caps as any)?.zoom?.min || 1 }));

        } catch (err: any) {
            setState(prev => ({ ...prev, error: `Erreur: ${err.message || "Caméra inaccessible"}` }));
        }
    }, [onScanSuccess, options.useAudio, options.useVibration, options.useContinuousMode]);

    useEffect(() => {
        startScanner();
        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch(console.warn);
            }
        };
    }, [startScanner]);

    const toggleTorch = async () => {
        const newState = await ScannerService.toggleTorch(scannerRef.current, state.torchOn);
        setState(prev => ({ ...prev, torchOn: newState }));
    };

    const handleZoomChange = async (value: number) => {
        await ScannerService.applyZoom(scannerRef.current, value);
        setState(prev => ({ ...prev, zoomValue: value }));
    };

    const toggleFullscreen = async () => {
        await ScannerService.toggleFullscreen("scanner-container");
    };

    const handleFileScan = async (file: File) => {
        if (!scannerRef.current) return;
        setState(prev => ({ ...prev, isGalleryLoading: true }));
        try {
            const decodedText = await scannerRef.current.scanFile(file, true);
            setState(prev => ({ ...prev, scanResult: decodedText }));
            ScannerService.playBeep(options.useAudio);
            ScannerService.triggerVibration(options.useVibration);
            setTimeout(() => onScanSuccess(decodedText), 500);
        } catch (err) {
            setState(prev => ({ ...prev, error: "Aucun QR Code détecté." }));
        } finally {
            setState(prev => ({ ...prev, isGalleryLoading: false }));
        }
    };

    return {
        state,
        capabilities,
        options,
        setOptions,
        toggleTorch,
        handleZoomChange,
        handleFileScan,
        toggleFullscreen,
    };
};
