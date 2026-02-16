"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState, useCallback } from "react";

interface QRCodeScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure?: (error: any) => void;
}

export const QRCodeScanner = ({ onScanSuccess, onScanFailure }: QRCodeScannerProps) => {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [hasTorch, setHasTorch] = useState(false);
    const [torchOn, setTorchOn] = useState(false);

    // États pour l'UI (boutons)
    const [useAudio, setUseAudio] = useState(true);
    const [useVibration, setUseVibration] = useState(true);
    const [useOverlay, setUseOverlay] = useState(true);

    // Refs pour éviter de redémarrer le scanner quand on change les options
    const audioRef = useRef(true);
    const vibrationRef = useRef(true);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const torchRef = useRef(false);

    // Synchronisation des refs avec le state
    useEffect(() => { audioRef.current = useAudio; }, [useAudio]);
    useEffect(() => { vibrationRef.current = useVibration; }, [useVibration]);

    // Fonction pour le retour sonore (Beep)
    const playBeep = useCallback(() => {
        if (!audioRef.current) return;
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(800, context.currentTime);
            oscillator.connect(gain);
            gain.connect(context.destination);
            gain.gain.setValueAtTime(0, context.currentTime);
            gain.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.01);
            gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.1);
            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.1);

            // Fermer le contexte après usage pour libérer les ressources
            setTimeout(() => context.close(), 200);
        } catch (e) {
            console.error("Audio error", e);
        }
    }, []);

    // Fonction pour la vibration
    const triggerVibration = useCallback(() => {
        if (!vibrationRef.current || !navigator.vibrate) return;
        try {
            navigator.vibrate(80); // Un peu plus long pour être mieux senti (80ms)
        } catch (e) {
            console.error("Vibration error", e);
        }
    }, []);

    const stopTorchForcefully = async () => {
        if (scannerRef.current && torchRef.current) {
            try {
                await scannerRef.current.applyVideoConstraints({
                    advanced: [{ torch: false }] as any
                });
                torchRef.current = false;
                setTorchOn(false);
            } catch (e) {
                console.warn("Could not force stop torch", e);
            }
        }
    };

    const toggleTorch = async () => {
        if (!scannerRef.current || !hasTorch) return;
        try {
            const nextState = !torchRef.current;
            await scannerRef.current.applyVideoConstraints({
                advanced: [{ torch: nextState }] as any
            });
            torchRef.current = nextState;
            setTorchOn(nextState);
        } catch (err) {
            console.error("Torch error:", err);
        }
    };

    useEffect(() => {
        let isAlive = true;

        const startScanner = async () => {
            try {
                setError(null);
                const html5QrCode = new Html5Qrcode("reader");
                scannerRef.current = html5QrCode;

                await html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 15,
                        qrbox: { width: 250, height: 250 }
                    },
                    async (decodedText) => {
                        if (!isAlive) return;
                        console.log("QR Code détecté:", decodedText);
                        setScanResult(decodedText);

                        // Feedbacks
                        playBeep();
                        triggerVibration();

                        // Éteindre la lampe avant de stopper
                        await stopTorchForcefully();

                        html5QrCode.stop().then(() => {
                            if (isAlive) onScanSuccess(decodedText);
                        }).catch(err => {
                            console.warn("Stop error during success:", err);
                            if (isAlive) onScanSuccess(decodedText);
                        });
                    },
                    (errorMessage) => { }
                );

                if (isAlive) {
                    setIsScanning(true);

                    // Vérifier si la lampe est disponible
                    try {
                        const capabilities = html5QrCode.getRunningTrackCapabilities();
                        if (capabilities && (capabilities as any).torch) {
                            setHasTorch(true);
                        }
                    } catch (e) {
                        console.warn("Could not get capabilities", e);
                    }
                }

            } catch (err: any) {
                if (isAlive) {
                    console.error("Erreur démarrage scanner:", err);
                    setError(`Erreur: ${err.message || "Impossible d'accéder à la caméra"}`);
                }
            }
        };

        startScanner();

        return () => {
            isAlive = false;
            if (scannerRef.current) {
                // S'assurer d'éteindre la torche
                stopTorchForcefully().finally(() => {
                    if (scannerRef.current?.isScanning) {
                        scannerRef.current.stop().catch(err => console.warn("Clean stop error:", err));
                    }
                });
            }
        };
        // On ne dépend PLUS que de onScanSuccess pour ne pas rafraîchir à cause d'un toggle
    }, [onScanSuccess, playBeep, triggerVibration]);

    return (
        <div className="w-full max-w-md mx-auto space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-4 text-sm font-medium">
                    <p>{error}</p>
                </div>
            )}

            <div className="relative group">
                <div
                    id="reader"
                    className="rounded-3xl overflow-hidden bg-black min-h-[300px] border-4 border-white shadow-2xl relative"
                ></div>

                {/* OVERLAY LASER & CADRE */}
                {isScanning && !scanResult && useOverlay && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-[250px] h-[250px] border-2 border-blue-500/50 rounded-xl relative overflow-hidden">
                            {/* Coins du cadre */}
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-600 rounded-tl-lg"></div>
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-600 rounded-tr-lg"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-600 rounded-bl-lg"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-600 rounded-br-lg"></div>

                            {/* Ligne Laser animée */}
                            <div className="absolute w-full h-[2px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan-laser"></div>
                        </div>
                        {/* Texte de guidage */}
                        <div className="absolute bottom-10 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider">
                            ALIGNEZ LE QR CODE
                        </div>
                    </div>
                )}

                {/* BOUTON TORCHE (Apparaît si dispo) */}
                {hasTorch && isScanning && !scanResult && (
                    <button
                        onClick={toggleTorch}
                        type="button"
                        className={`absolute top-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${torchOn ? 'bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'bg-black/40 text-white backdrop-blur-md'}`}
                    >
                        <svg className="w-6 h-6" fill={torchOn ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9l-.707.707M12 18c-3.313 0-6-2.687-6-6s2.687-6 6-6 6 2.687 6 6-2.687 6-6 6z" />
                        </svg>
                    </button>
                )}
            </div>

            {/* OPTIONS DE SCANNER */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-3 gap-2">
                <button
                    onClick={() => setUseAudio(!useAudio)}
                    type="button"
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${useAudio ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-tight">Audio</span>
                </button>
                <button
                    onClick={() => setUseVibration(!useVibration)}
                    type="button"
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${useVibration ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-tight">Vibrer</span>
                </button>
                <button
                    onClick={() => setUseOverlay(!useOverlay)}
                    type="button"
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${useOverlay ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-tight">Viseur</span>
                </button>
            </div>

            {scanResult && (
                <p className="text-center font-black text-blue-600 animate-bounce uppercase tracking-widest bg-blue-50 py-3 rounded-2xl">
                    🎯 Code Détecté !
                </p>
            )}

            <style jsx global>{`
                @keyframes scan-laser {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
                .animate-scan-laser {
                    animation: scan-laser 2s linear infinite;
                }
            `}</style>
        </div>
    );
};
