import { Html5Qrcode } from "html5-qrcode";

export const ScannerService = {
    playBeep(useAudio: boolean) {
        if (!useAudio) return;
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
            setTimeout(() => context.close(), 200);
        } catch (e) {
            console.error("Audio error", e);
        }
    },

    triggerVibration(useVibration: boolean) {
        if (!useVibration || !navigator.vibrate) return;
        try {
            navigator.vibrate(80);
        } catch (e) {
            console.error("Vibration error", e);
        }
    },

    async toggleTorch(scanner: Html5Qrcode | null, currentState: boolean): Promise<boolean> {
        if (!scanner) return currentState;
        try {
            const nextState = !currentState;
            await scanner.applyVideoConstraints({
                advanced: [{ torch: nextState }] as any
            });
            return nextState;
        } catch (err) {
            console.error("Torch error:", err);
            return currentState;
        }
    },

    async applyZoom(scanner: Html5Qrcode | null, value: number) {
        if (!scanner) return;
        try {
            await scanner.applyVideoConstraints({
                advanced: [{ zoom: value }] as any
            });
        } catch (err) {
            console.warn("Zoom error:", err);
        }
    },

    async toggleFullscreen(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (!document.fullscreenElement) {
            await element.requestFullscreen().catch(err => {
                console.warn(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
};
