"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu, Timer, CheckCircle2,
    ArrowRight, Mic, Activity, Shield, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSpeechToText } from '../../hooks/useSpeechToText';

const ScreeningPage = () => {
    const router = useRouter();
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isShowingInstruction, setIsShowingInstruction] = useState(false);
    const [answers, setAnswers] = useState<any[]>([]);
    const [startTime, setStartTime] = useState(Date.now());
    const [responseTime, setResponseTime] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [textInput, setTextInput] = useState("");
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

    const {
        isListening,
        transcript,
        error: speechError,
        startListening,
        stopListening,
        resetTranscript
    } = useSpeechToText();

    // Unified Transcript Handler
    useEffect(() => {
        if (transcript) {
            const currentQ = questions[currentIdx];
            if (!currentQ || isShowingInstruction) return;

            if (currentQ.type === 'choice') {
                // Auto-match transcript to options
                const match = currentQ.options.find((opt: string) => 
                    transcript.toLowerCase().includes(opt.toLowerCase()) || 
                    opt.toLowerCase().includes(transcript.toLowerCase())
                );
                if (match) {
                    setSelectedChoice(match);
                    // Explicitly click confirm for them if user said it? 
                    // No, let them see it selected first for a split second or auto-record if very confident.
                    // User requested "ans get selected", lets auto-advance on high confidence
                    setTimeout(() => recordAnswer(match), 500);
                    stopListening();
                }
            } else {
                setTextInput(transcript);
            }
        }
    }, [transcript]);

    const analysisMessages = [
        "Analyzing cognitive response patterns...",
        "Evaluating neural latency metrics...",
        "Processing memory recall consistency...",
        "Benchmarking executive decision paths...",
        "Generating final cognitive health report..."
    ];

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch('/api/questions');
                
                if (!res.ok) {
                    const text = await res.text();
                    console.error("API error response:", text);
                    throw new Error(`Server error (${res.status})`);
                }

                const selected = await res.json();
                console.log("Fetched questions count:", selected.length);
                
                if (selected.length > 0) {
                    setQuestions(selected);
                    setLoading(false);
                    setStartTime(Date.now());
                    
                    const firstQ = selected[0];
                    // Check if it'S an instruction
                    const isInst = firstQ.question.toLowerCase().startsWith('instruction') || 
                                   firstQ.subType === 'instruction' ||
                                   firstQ.question.toLowerCase().includes('remember');
                    
                    setIsShowingInstruction(isInst);
                } else {
                    throw new Error("No questions returned from API");
                }
            } catch (err: any) {
                console.error("Failed to load questions", err);
                setLoading(false);
                setQuestions([{ 
                    id: 0, 
                    domain: 'Connection Error', 
                    question: `Clinical Link Interrupted: ${err.message}. Please restart the application or check your network connection.`,
                    type: 'choice',
                    options: ['Retry Connection'],
                    correct: 'Retry Connection'
                }]);
            }
        };

        fetchQuestions();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isAnalyzing && !loading && !isShowingInstruction) {
                setResponseTime(Number(((Date.now() - startTime) / 1000).toFixed(1)));
            }
        }, 100);
        return () => clearInterval(interval);
    }, [startTime, isAnalyzing, loading, isShowingInstruction]);

    const handleNext = () => {
        if (isShowingInstruction) {
            setIsShowingInstruction(false);
            setStartTime(Date.now());
            return;
        }
        
        const q = questions[currentIdx];
        if (q.type === 'choice') {
            if (selectedChoice) recordAnswer(selectedChoice);
        } else {
            recordAnswer(textInput);
        }
    };

    const recordAnswer = (val: string) => {
        const duration = (Date.now() - startTime) / 1000;
        const currentQ = questions[currentIdx];

        const isCorrect = currentQ.type === 'text'
            ? val.toLowerCase().trim().includes(String(currentQ.correct).toLowerCase().split(',')[0].trim())
            : val === currentQ.correct;

        const newAnswers = [...answers];
        newAnswers[currentIdx] = {
            questionId: currentQ.id,
            domain: currentQ.domain,
            selected: val,
            correct: currentQ.correct,
            time: duration,
            isCorrect: isCorrect
        };
        setAnswers(newAnswers);
        setTextInput("");
        setSelectedChoice(null);
        
        if (isListening) {
            stopListening();
        }
        resetTranscript();

        if (currentIdx < questions.length - 1) {
            const nextQ = questions[currentIdx + 1];
            setCurrentIdx(currentIdx + 1);
            if (nextQ.question.toLowerCase().startsWith('instruction') || nextQ.subType === 'instruction') {
                setIsShowingInstruction(true);
            } else {
                setStartTime(Date.now());
            }
        } else {
            startAnalysis();
        }
    };

    const startAnalysis = () => {
        setIsAnalyzing(true);
        let step = 0;
        const interval = setInterval(() => {
            step++;
            setAnalysisStep(step);
            if (step >= analysisMessages.length) {
                clearInterval(interval);
                finishTest();
            }
        }, 1000);
    };

    const finishTest = async () => {
        const payload = {
            sessionId: `session_${Date.now()}`,
            questions: answers.map(a => ({
                questionId: a.questionId,
                domain: a.domain.includes('Executive') ? 'Executive' : a.domain,
                responseText: a.selected,
                latencyMs: a.time * 1000,
                totalTimeMs: a.time * 1000,
                hesitationFlags: a.time > 10
            })),
            scores: {
                accuracy: (answers.filter(a => a.isCorrect).length / answers.length) * 100,
                overallRisk: 'Low' 
            }
        };

        try {
            const res = await fetch('/api/assessments/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            
            // Persist locally for immediate dashboard sync
            const reportData = { 
                ...payload, 
                aiAnalysis: result.aiAnalysis,
                timestamp: new Date().toISOString(),
                success: true
            };
            localStorage.setItem('latest_assessment', JSON.stringify(reportData));
            localStorage.setItem('screening_report', JSON.stringify(reportData));
            
            router.push('/dashboard');
        } catch (err) {
            console.error("Submission failed", err);
            // Even if DB fails, allow local results to update dashboard for testing
            const localData = { 
                ...payload, 
                timestamp: new Date().toISOString(),
                success: true,
                isLocalOnly: true 
            };
            localStorage.setItem('latest_assessment', JSON.stringify(localData));
            router.push('/dashboard');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="ambient-bg" />
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">Initializing Neural Assessment</p>
                </div>
            </div>
        );
    }

    if (isAnalyzing) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white text-center">
                <div className="ambient-bg" />
                <motion.div
                    animate={{ 
                        rotate: 360,
                        scale: [1, 1.1, 1],
                        boxShadow: ["0 0 20px rgba(99,102,241,0.2)", "0 0 60px rgba(99,102,241,0.4)", "0 0 20px rgba(99,102,241,0.2)"]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-48 border-2 border-indigo-500/30 rounded-full flex items-center justify-center mb-16 relative"
                >
                    <div className="absolute inset-0 rounded-full bg-indigo-500/5 animate-pulse" />
                    <Cpu size={80} className="text-indigo-400" />
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={analysisStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-md"
                    >
                        <h2 className="text-3xl font-black mb-4 gradient-text tracking-tighter italic">Clinical Sync...</h2>
                        <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs leading-loose">
                            {analysisMessages[analysisStep] || "Finalizing report..."}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    const q = questions[currentIdx];
    if (!q) return null;
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
        <div className="h-screen bg-black flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
            <div className="ambient-bg" />
            
            <div className="max-w-5xl w-full h-full max-h-[900px] flex flex-col relative z-10">
                {/* HEADER - Compact */}
                <div className="flex justify-between items-center mb-6 md:mb-8 shrink-0">
                    <div className="flex items-center gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 status-pill mb-1">
                                <Activity size={10} className="text-indigo-400" />
                                <span className="text-indigo-400 text-[10px]">Live Stream</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white">Task {currentIdx + 1}</h2>
                                <span className="text-sm text-white/20 font-bold">/ {questions.length}</span>
                            </div>
                        </div>
                    </div>
                    
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4 shrink-0">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-pink-500"
                    />
                </div>

                {/* CONTENT AREA - Scrollable if needed, but height optimized */}
                <div className="flex-1 min-h-0 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isShowingInstruction ? `inst_${currentIdx}` : `q_${currentIdx}`}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.02, y: -10 }}
                            className="h-full flex flex-col"
                        >
                            <div className="glass-2 p-6 md:p-8 rounded-[40px] border-white/5 flex flex-col h-full overflow-hidden relative">
                                {/* HEADER: QUESTION (Q) & TIMER (T) */}
                                <div className="flex justify-between items-start gap-6 mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight text-white text-left">
                                            {(() => {
                                                const fullText = q.question.replace(/Instruction:?\s*/i, '');
                                                // Clinical Split Logic: Look for the first question mark as the divider
                                                if (fullText.includes('?') && fullText.toLowerCase().includes('remember')) {
                                                    const parts = fullText.split(/(?<=\.)\s+(?=What|How|Which|Recall)/i);
                                                    if (parts.length > 1) {
                                                        return isShowingInstruction ? parts[0] : parts[1];
                                                    }
                                                    // Fallback split on first question mark
                                                    const qIndex = fullText.indexOf('?');
                                                    if (qIndex > 0) {
                                                        const instructionPart = fullText.substring(0, qIndex).split('.').slice(0, -1).join('.') + '.';
                                                        const questionPart = fullText.substring(instructionPart.length).trim();
                                                        return isShowingInstruction ? instructionPart : questionPart;
                                                    }
                                                }
                                                return fullText;
                                            })()}
                                        </h3>
                                    </div>

                                    {!isShowingInstruction && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 glass-1 px-4 py-2.5 border-white/10 rounded-2xl shadow-xl">
                                                <Timer size={16} className="text-indigo-400" />
                                                <span className="text-lg font-black italic text-white tabular-nums">{responseTime}s</span>
                                            </div>
                                            <button
                                                onClick={isListening ? stopListening : startListening}
                                                className={`p-3 rounded-2xl transition-all border ${isListening ? 'bg-indigo-500 border-indigo-400 text-white animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-white/5 border-white/10 text-indigo-400 hover:bg-white/10'}`}
                                            >
                                                <Mic size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* OPTIONS (A) / INSTRUCTION CONTENT */}
                                <div className="flex-1 flex flex-col mt-4 overflow-y-auto px-2">
                                    {isShowingInstruction ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-full border border-indigo-500/20 flex items-center justify-center animate-pulse">
                                                    <Activity size={40} className="text-indigo-400/40" />
                                                </div>
                                                <motion.div 
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                                    className="absolute -inset-2 border-t-2 border-indigo-500/30 rounded-full" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-indigo-400/60 font-black uppercase tracking-[0.2em] text-[10px]">Neural Protocol Observation</p>
                                                <p className="text-white/40 max-w-sm text-sm font-medium leading-relaxed italic">
                                                    "Please focus on the information displayed above. You will be asked to recall these details in the next phase."
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full max-w-4xl mx-auto">
                                            {q.type === 'choice' ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                                                    {q.options.map((opt: any, i: number) => (
                                                        <motion.button
                                                            key={i}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => setSelectedChoice(opt)}
                                                            className={`text-left p-5 md:p-6 rounded-3xl transition-all border flex justify-between items-center group
                                                                ${selectedChoice === opt 
                                                                    ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-lg' 
                                                                    : 'bg-white/[0.03] border-white/5 text-white/60 hover:border-white/10 hover:bg-white/[0.05]'
                                                                }`}
                                                        >
                                                            <span className="font-bold text-lg md:text-xl uppercase tracking-tight">{opt}</span>
                                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all
                                                                ${selectedChoice === opt ? 'border-indigo-400 bg-indigo-500' : 'border-white/10 group-hover:border-white/20'}`}>
                                                                {selectedChoice === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                                                            </div>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="space-y-4 pb-4">
                                                    <textarea
                                                        autoFocus
                                                        value={textInput}
                                                        onChange={(e) => setTextInput(e.target.value)}
                                                        placeholder={isListening ? "Processing Neural Voice..." : "Type response..."}
                                                        className={`w-full p-6 rounded-3xl bg-black/40 border border-white/10 text-xl font-bold text-white min-h-[140px] focus:outline-none focus:border-indigo-500/50 transition-all ${isListening ? 'ring-4 ring-indigo-500/20' : ''}`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* NEXT BUTTON (N) - ALIGNED RIGHT */}
                                <div className="mt-4 pt-6 border-t border-white/5 flex justify-end">
                                    <button
                                        disabled={!isShowingInstruction && (q.type === 'choice' ? !selectedChoice : !textInput.trim())}
                                        onClick={handleNext}
                                        className="yobe-btn-premium text-lg px-12 py-5 rounded-[20px] disabled:opacity-20 disabled:grayscale transition-all flex items-center justify-center gap-3 w-fit"
                                    >
                                        {isShowingInstruction ? 'Start Task' : (currentIdx === questions.length - 1 ? 'Finish' : 'Next Step')}
                                        {currentIdx === questions.length - 1 ? <CheckCircle2 size={24} /> : <ArrowRight size={24} />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-6 md:mt-8 text-center shrink-0">
                    <p className="text-white/10 font-bold uppercase tracking-[0.4em] text-[9px]">Neural Clinical Integration v2.4</p>
                </div>
            </div>
        </div>
    );
};

export default ScreeningPage;
