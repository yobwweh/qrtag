"use client";

import { useScannerController } from "../controllers/scanner.controller";

interface QRCodeScannerProps {
    onScanSuccess: (decodedText: string) => void;
}

export const QRCodeScanner = ({ onScanSuccess }: QRCodeScannerProps) => {
    const {
        state,
        capabilities,
        options,
        setOptions,
        toggleTorch,
        handleZoomChange,
        handleFileScan,
        toggleFullscreen
    } = useScannerController(onScanSuccess);

    return (
        <div id="scanner-container" className="w-full max-w-md mx-auto space-y-4 bg-inherit p-2 rounded-3xl">
            {state.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-4 text-sm font-medium">
                    <p>{state.error}</p>
                </div>
            )}

            <div className="relative group">
                <div
                    id="reader"
                    className="rounded-3xl overflow-hidden bg-black min-h-[300px] border-4 border-white shadow-2xl relative"
                ></div>

                {/* OVERLAY LASER & CADRE */}
                {state.isScanning && !state.scanResult && options.useOverlay && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-[250px] h-[250px] border-2 border-blue-500/50 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-600 rounded-tl-lg"></div>
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-600 rounded-tr-lg"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-600 rounded-bl-lg"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-600 rounded-br-lg"></div>
                            <div className="absolute w-full h-[2px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan-laser"></div>
                        </div>
                        <div className="absolute bottom-10 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider">
                            ALIGNEZ LE QR CODE
                        </div>
                    </div>
                )}

                {/* BOUTONS ACTIONS (TORCHE & GALERIE) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {capabilities.hasTorch && state.isScanning && !state.scanResult && (
                        <button
                            onClick={toggleTorch}
                            type="button"
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${state.torchOn ? 'bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'bg-black/40 text-white backdrop-blur-md'}`}
                        >
                            <svg className="w-6 h-6" fill={state.torchOn ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9l-.707.707M12 18c-3.313 0-6-2.687-6-6s2.687-6 6-6 6 2.687 6 6-2.687 6-6 6z" />
                            </svg>
                        </button>
                    )}

                    {/* BOUTON PLEIN ÉCRAN */}
                    {state.isScanning && !state.scanResult && (
                        <button
                            onClick={toggleFullscreen}
                            type="button"
                            className="w-12 h-12 rounded-2xl bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </button>
                    )}

                    {state.isScanning && !state.scanResult && (
                        <label className="w-12 h-12 rounded-2xl bg-black/40 text-white backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-black/60 transition-all relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => e.target.files?.[0] && handleFileScan(e.target.files[0])}
                                disabled={state.isGalleryLoading}
                            />
                            {state.isGalleryLoading ? (
                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            )}
                        </label>
                    )}
                </div>

                {/* ZOOM SLIDER */}
                {capabilities.zoom && state.isScanning && !state.scanResult && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/10 h-[200px]">
                        <span className="text-white text-[10px] font-bold">Zoom</span>
                        <input
                            type="range"
                            min={capabilities.zoom.min}
                            max={capabilities.zoom.max}
                            step={capabilities.zoom.step}
                            value={state.zoomValue}
                            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                            className="flex-1 w-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-blue-500"
                            style={{ writingMode: 'vertical-lr' } as any}
                        />
                        <span className="text-white text-[10px] font-bold">{Math.round(state.zoomValue)}x</span>
                    </div>
                )}
            </div>

            {/* OPTIONS PANEL */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-4 gap-2">
                <OptionButton
                    active={options.useAudio}
                    onClick={() => setOptions({ ...options, useAudio: !options.useAudio })}
                    label="Audio"
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />}
                />
                <OptionButton
                    active={options.useVibration}
                    onClick={() => setOptions({ ...options, useVibration: !options.useVibration })}
                    label="Vib"
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />}
                />
                <OptionButton
                    active={options.useOverlay}
                    onClick={() => setOptions({ ...options, useOverlay: !options.useOverlay })}
                    label="Viseur"
                    icon={<><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>}
                />
                <OptionButton
                    active={options.useContinuousMode}
                    onClick={() => setOptions({ ...options, useContinuousMode: !options.useContinuousMode })}
                    label="Rafale"
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />}
                />
            </div>

            {state.scanResult && (
                <p className="text-center font-black text-blue-600 animate-bounce uppercase tracking-widest bg-blue-50 py-3 rounded-2xl">
                    🎯 Code Détecté !
                </p>
            )}

            <style jsx global>{`
                @keyframes scan-laser { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
                .animate-scan-laser { animation: scan-laser 2s linear infinite; }
            `}</style>
        </div>
    );
};

const OptionButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
    <button
        onClick={onClick}
        type="button"
        className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${active ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}
    >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
        <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </button>
);
