export interface ScannerCapabilities {
    hasTorch: boolean;
    zoom: {
        min: number;
        max: number;
        step: number;
    } | null;
}

export interface ScannerState {
    isScanning: boolean;
    scanResult: string | null;
    error: string | null;
    torchOn: boolean;
    zoomValue: number;
    isGalleryLoading: boolean;
}

export interface ScannerOptions {
    useAudio: boolean;
    useVibration: boolean;
    useOverlay: boolean;
    useContinuousMode: boolean; // Préparation pour le mode continu
}
