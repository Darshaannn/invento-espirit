import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechToText = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            const rec = new SpeechRecognition();
            rec.continuous = true;
            rec.interimResults = true;
            rec.lang = 'en-US';

            rec.onresult = (event: any) => {
                let currentTranscript = "";
                for (let i = 0; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };

            rec.onerror = (event: any) => {
                // 'aborted' usually means it was stopped manually or by another instance
                if (event.error === 'aborted') {
                    console.log("Speech recognition session ended.");
                    return;
                }
                console.error("Speech Recognition Error:", event.error);
                setError(event.error);
                setIsListening(false);
            };

            rec.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = rec;
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {}
            }
        };
    }, []);

    const startListening = useCallback(() => {
        if (!recognitionRef.current) {
            setError("Speech recognition not supported or not initialized.");
            return;
        }

        try {
            setError(null);
            setIsListening(true);
            recognitionRef.current.start();
        } catch (err: any) {
            console.error("Failed to start speech recognition:", err);
            // If already started, just ignore
            if (err.name === 'InvalidStateError') {
                setIsListening(true);
            } else {
                setError(err.message);
                setIsListening(false);
            }
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) {
                console.error("Error stopping recognition:", e);
            }
            setIsListening(false);
        }
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript("");
    }, []);

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        resetTranscript
    };
};
