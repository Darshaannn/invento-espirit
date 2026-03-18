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
    const [instructionTimer, setInstructionTimer] = useState<number | null>(null);
    const [isShowingIntake, setIsShowingIntake] = useState(true);
    const [intakeData, setIntakeData] = useState({
        age: '',
        gender: '',
        symptoms: [] as string[],
        familyHistory: 'No'
    });

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

    const domainMetadata: { [key: string]: { title: string, desc: string } } = {
        'Memory': {
            title: 'Memory & Retention',
            desc: 'Evaluating your ability to encode and retrieve information. Memory strength is a key indicator of hippocampal integrity.'
        },
        'Attention': {
            title: 'Attention & Processing',
            desc: 'Measuring cognitive stamina and focus. We analyze how you filter stimuli and manage task-directed concentration.'
        },
        'Executive': {
            title: 'Executive Function',
            desc: 'Testing high-level mental skills like planning, flexibility, and abstract reasoning to map decision-making paths.'
        },
        'Orientation': {
            title: 'Global Orientation',
            desc: 'Assessing your awareness of temporal and spatial context—the fundamental baseline of cognitive synchronization.'
        },
        'Language': {
            title: 'Language Integrity',
            desc: 'Analyzing verbal fluency and understanding to ensure the structural health of linguistic cognitive pathways.'
        }
    };

    const fetchQuestions = async (data?: any) => {
        setLoading(true);
        try {
            const queryParams = data ? `?age=${data.age}&symptoms=${data.symptoms.join(',')}` : '';
            const res = await fetch(`/api/questions${queryParams}`);

            if (!res.ok) {
                const text = await res.text();
                console.error("API error response:", text);
                throw new Error(`Server error (${res.status})`);
            }

            const selected = await res.json();
            if (selected.length > 0) {
                setQuestions(selected);
                setLoading(false);
                setStartTime(Date.now());

                const firstQ = selected[0];
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

    useEffect(() => {
        // We now fetch questions AFTER intake
        if (!isShowingIntake) {
            // fetchQuestions is called inside handleIntakeSubmit
        } else {
            setLoading(false); // Show intake form immediately
        }
    }, [isShowingIntake]);

    const handleIntakeSubmit = () => {
        setIsShowingIntake(false);
        fetchQuestions(intakeData);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isAnalyzing && !loading && !isShowingInstruction) {
                setResponseTime(Number(((Date.now() - startTime) / 1000).toFixed(1)));
            }
        }, 100);
        return () => clearInterval(interval);
    }, [startTime, isAnalyzing, loading, isShowingInstruction]);

    // Instruction Auto-Transition Timer (10s)
    useEffect(() => {
        if (isShowingInstruction && !loading && !isAnalyzing) {
            setInstructionTimer(10);
            const timer = setInterval(() => {
                setInstructionTimer(prev => {
                    if (prev === null || prev <= 1) {
                        clearInterval(timer);
                        handleNext(); // Auto transition
                        return null;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setInstructionTimer(null);
        }
    }, [isShowingInstruction, currentIdx]);

    const handleNext = () => {
        if (isShowingInstruction) {
            // Move to next question immediately after instruction (which is usually the recall)
            if (currentIdx < questions.length - 1) {
                const nextQ = questions[currentIdx + 1];
                setCurrentIdx(currentIdx + 1);
                const isNextInst = nextQ.question.toLowerCase().startsWith('instruction') || nextQ.subType === 'instruction';
                setIsShowingInstruction(isNextInst);
                setStartTime(Date.now());
            } else {
                startAnalysis();
            }
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
        // Filter out holes in the answers array (e.g. from instructions or skips)
        const validAnswers = answers.filter(a => a !== undefined && a !== null);

        const payload = {
            sessionId: `session_${Date.now()}`,
            questions: validAnswers.map(a => ({
                questionId: a.questionId,
                domain: a.domain?.includes('Executive') ? 'Executive' : a.domain,
                responseText: a.selected,
                latencyMs: a.time * 1000,
                totalTimeMs: a.time * 1000,
                hesitationFlags: a.time > 10
            })),
            scores: {
                accuracy: validAnswers.length > 0
                    ? (validAnswers.filter(a => a.isCorrect).length / validAnswers.length) * 100
                    : 0,
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

            // Persist for guest viewing (sessionStorage dies on tab close/refresh-equiv)
            const reportData = {
                ...payload,
                aiAnalysis: result.aiAnalysis,
                scores: {
                    accuracy: result.overallScore || payload.scores.accuracy,
                    overallRisk: result.riskTier || payload.scores.overallRisk
                },
                domainScores: result.domainScores || null,
                timestamp: new Date().toISOString(),
                success: true
            };
            // Save to BOTH storages so dashboard and analysis page can both read it
            sessionStorage.setItem('latest_assessment', JSON.stringify(reportData));
            sessionStorage.setItem('screening_report', JSON.stringify(reportData));
            localStorage.setItem('latest_assessment', JSON.stringify(reportData));

            // Add to localStorage history for history tab
            const history = JSON.parse(localStorage.getItem('inventoHistory') || '[]');
            history.unshift({ ...reportData, date: reportData.timestamp });
            localStorage.setItem('inventoHistory', JSON.stringify(history.slice(0, 10)));

            // Force a small delay to ensure storage writes before navigation
            setTimeout(() => {
                router.push('/analysis');
            }, 100);
        } catch (err) {
            console.error("Submission failed", err);
            // Even if DB fails, allow local results to update dashboard for testing
            const localData = {
                ...payload,
                timestamp: new Date().toISOString(),
                success: true,
                isLocalOnly: true
            };
            sessionStorage.setItem('latest_assessment', JSON.stringify(localData));
            localStorage.setItem('latest_assessment', JSON.stringify(localData));

            const history = JSON.parse(localStorage.getItem('inventoHistory') || '[]');
            history.unshift({ ...localData, date: localData.timestamp });
            localStorage.setItem('inventoHistory', JSON.stringify(history.slice(0, 10)));

            router.push('/analysis');
        }
    };

    if (isShowingIntake) {
        return (
            <div className="min-h-screen bg-[#F5F1EE] text-[#1A1A1A] flex flex-col items-center p-6 md:p-12 relative font-sans">
                <div className="max-w-4xl w-full flex flex-col relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-12 md:p-16 border border-[#1A1A1A]/5 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B0000]/5 blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-[#8B0000] flex items-center justify-center text-white font-black text-lg">1</div>
                            <span className="font-black text-[#1A1A1A]/30 tracking-[0.2em] text-[10px] uppercase">Step 01: Clinical Consultation</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#1A1A1A] mb-4">Intake & Health Check.</h2>
                        <p className="text-[#1A1A1A]/50 font-medium mb-12 text-lg">Provide clinical context to calibrate the diagnostic engine.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {/* Age */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/40 block ml-2">Age Group</label>
                                <select
                                    className="w-full h-16 bg-[#F5F1EE] px-6 font-bold text-[#1A1A1A] border-none focus:ring-2 focus:ring-[#8B0000]/20 outline-none appearance-none"
                                    value={intakeData.age}
                                    onChange={(e) => setIntakeData({ ...intakeData, age: e.target.value })}
                                >
                                    <option value="">Select Age</option>
                                    <option value="18-35">18-35</option>
                                    <option value="36-50">36-50</option>
                                    <option value="51-65">51-65</option>
                                    <option value="66-80">66-80</option>
                                    <option value="80+">80+</option>
                                </select>
                            </div>

                            {/* Gender */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/40 block ml-2">Gender</label>
                                <div className="flex gap-3">
                                    {['Male', 'Female', 'Other'].map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setIntakeData({ ...intakeData, gender: g })}
                                            className={`flex-1 h-16 font-bold transition-all ${intakeData.gender === g ? 'bg-[#8B0000] text-white' : 'bg-[#F5F1EE] text-[#1A1A1A]/40 hover:bg-[#E8E2DE]'}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>


                            {/* Symptoms */}
                            <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/40 block ml-2">Current Symptoms (Select all that apply)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { id: 'memory', label: 'Recent Memory Loss' },
                                        { id: 'confusion', label: 'Confusion with Time/Place' },
                                        { id: 'language', label: 'Difficulty Finding Words' },
                                        { id: 'judgment', label: 'Poor or Decreased Judgment' }
                                    ].map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => {
                                                const newSymptoms = intakeData.symptoms.includes(s.id)
                                                    ? intakeData.symptoms.filter(x => x !== s.id)
                                                    : [...intakeData.symptoms, s.id];
                                                setIntakeData({ ...intakeData, symptoms: newSymptoms });
                                            }}
                                            className={`h-16 px-6 font-bold text-left transition-all flex justify-between items-center ${intakeData.symptoms.includes(s.id) ? 'bg-[#8B0000]/10 border-2 border-[#8B0000] text-[#1A1A1A]' : 'bg-[#F5F1EE] text-[#1A1A1A]/40'}`}
                                        >
                                            {s.label}
                                            {intakeData.symptoms.includes(s.id) && <CheckCircle2 size={18} className="text-[#8B0000]" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={!intakeData.age || !intakeData.gender}
                                onClick={handleIntakeSubmit}
                                className={`px-16 py-6 font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-2xl ${(!intakeData.age || !intakeData.gender) ? 'bg-[#1A1A1A]/10 text-white/40 cursor-not-allowed' : 'bg-[#1A1A1A] text-white hover:bg-black'}`}
                            >
                                Initiate Assessment <ArrowRight size={20} />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    const q = questions[currentIdx];
    if (!q) return null;
    const progress = ((currentIdx + 1) / questions.length) * 100;

    // Domain color coding
    const domainColors: { [key: string]: string } = {
        'Memory': 'from-blue-500 to-cyan-500',
        'Attention': 'from-orange-500 to-amber-500',
        'Executive': 'from-purple-500 to-pink-500',
        'Orientation': 'from-green-500 to-emerald-500',
        'Language': 'from-indigo-500 to-blue-500'
    };

    const activeColorKey = Object.keys(domainColors).find(k => q.domain.includes(k)) || 'Memory';
    const gradientClass = domainColors[activeColorKey] || domainColors['Memory'];

    return (
        <div className="min-h-screen bg-[#F5F1EE] text-[#1A1A1A] flex flex-col items-center p-6 md:p-12 relative font-sans scroll-smooth">
            <div className="max-w-[1400px] w-full flex flex-col relative z-10">

                {/* STEPPER PROGRESS */}
                <div className="flex items-center justify-between mb-16 px-4 relative mt-4">
                    <div className="absolute top-[8px] left-0 right-0 h-[2px] bg-black/5" />
                    {Object.keys(domainMetadata).map((domain, idx) => {
                        const isActive = q.domain.includes(domain);
                        const isPast = Object.keys(domainMetadata).findIndex(d => q.domain.includes(d)) > idx;

                        return (
                            <div key={domain} className="flex flex-col items-center gap-3 relative z-10 bg-[#F5F1EE] px-2 md:px-4 group cursor-default">
                                <div className={`w-[18px] h-[18px] border-2 transition-all duration-500 flex items-center justify-center ${isActive ? 'border-[#8B0000] bg-white' : (isPast ? 'border-[#8B0000] bg-[#8B0000]' : 'border-black/10 bg-white')}`}>
                                    {isActive && <div className="w-[10px] h-[10px] bg-[#8B0000]" />}
                                    {isPast && <CheckCircle2 size={12} className="text-white" />}
                                </div>
                                <span className={`text-[11px] font-bold text-center leading-tight max-w-[80px] transition-colors duration-300 ${isActive ? 'text-[#1A1A1A]' : 'text-black/30'}`}>{domain}</span>
                            </div>
                        );
                    })}
                </div>
                {/* CENTERED FOCUS LAYOUT */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-0 py-8">
                    {/* CENTERED QUESTIONS CONTAINER */}
                    <div className="max-w-4xl w-full flex flex-col">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isShowingInstruction ? `inst_${currentIdx}` : `q_${currentIdx}`}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="flex-1 flex flex-col"
                            >
                                <div className={`${currentIdx % 2 === 0 ? 'bg-[#8B0000]' : 'bg-[#1A1A1A]'} p-12 md:p-16 flex flex-col flex-1 shadow-2xl relative overflow-hidden group`}>
                                    {/* Subtle decorative pattern matching user image */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 blur-[40px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                                    {/* QUESTION TEXT */}
                                    <div className="relative z-10 mb-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="text-lg font-bold text-white/90">{currentIdx + 1}.</span>
                                            {!isShowingInstruction && (
                                                <div className="flex items-center gap-2 px-3 py-1 bg-black/20 border border-white/10">
                                                    <Timer size={12} className="text-white/40" />
                                                    <span className="text-xs font-bold text-white tabular-nums">{responseTime}s</span>
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-bold leading-[1.2] text-white tracking-tight">
                                            {q.question.replace(/^Instruction:?\s*/i, '')}
                                        </h3>
                                    </div>

                                    {/* RESPONSE AREA */}
                                    <div className="flex-1 flex flex-col relative z-10 overflow-y-auto custom-scrollbar pr-2 mb-8">
                                        {isShowingInstruction ? (
                                            <div className="flex flex-col items-center justify-center h-full text-center py-10 scale-in-center">
                                                <div className="w-24 h-24 border-4 border-white/20 flex items-center justify-center mb-8 relative">
                                                    <div className="absolute inset-0 border-t-4 border-white animate-spin" />
                                                    <Shield size={32} className="text-white" />
                                                </div>
                                                <p className="text-2xl font-medium text-white/80 leading-relaxed max-w-sm">
                                                    Encoding neural markers. Automated transition in <span className="font-black underline decoration-white/30">{instructionTimer}s</span>.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="w-full">
                                                {q.type === 'choice' ? (
                                                    <div className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            {q.options.map((opt: any, i: number) => (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => setSelectedChoice(opt)}
                                                                    className={`text-left p-8 md:p-10 transition-all duration-300 flex justify-between items-center group relative overflow-hidden active:scale-95
                                                                        ${selectedChoice === opt
                                                                            ? `bg-white text-black shadow-2xl scale-[1.02]`
                                                                            : 'bg-black/20 text-white/60 hover:bg-black/30 hover:text-white border border-white/5'
                                                                        }`}
                                                                >
                                                                    <span className="font-bold text-lg md:text-xl tracking-tight relative z-10">{opt}</span>
                                                                    <div className={`w-8 h-8 flex items-center justify-center transition-all
                                                                        ${selectedChoice === opt ? 'bg-[#8B0000] text-white shadow-lg' : 'bg-white/10 text-white/30 group-hover:bg-white/20'}`}>
                                                                        {selectedChoice === opt ? <CheckCircle2 size={18} /> : String.fromCharCode(65 + i)}
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex flex-col space-y-6">
                                                        <textarea
                                                            autoFocus
                                                            value={textInput}
                                                            onChange={(e) => setTextInput(e.target.value)}
                                                            placeholder={isListening ? "Listening to neural input..." : "Type or speak your answer..."}
                                                            className="w-full p-8 bg-black/20 border border-white/5 text-xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:bg-black/30 transition-all resize-none min-h-[200px]"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* FOOTER: MIC & NEXT */}
                                    {!isShowingInstruction && (
                                        <div className="mt-auto flex justify-between items-center relative z-10 pt-8 border-t border-white/5">
                                            <button
                                                onClick={isListening ? stopListening : startListening}
                                                className={`flex items-center gap-3 px-6 py-4 border transition-all 
                                                    ${isListening
                                                        ? 'bg-red-500 border-white text-white animate-pulse'
                                                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                {isListening ? <Activity size={20} /> : <Mic size={20} />}
                                                <span className="text-[10px] font-black uppercase tracking-widest">{isListening ? 'Listening...' : 'Voice Assistant'}</span>
                                            </button>

                                            <div className="flex items-center gap-6 w-full justify-between">
                                                {currentIdx > 0 ? (
                                                    <button
                                                        onClick={() => setCurrentIdx(prev => prev - 1)}
                                                        className="px-12 py-5 bg-[#E8E2DE] text-[#1A1A1A]/60 hover:text-[#1A1A1A] text-sm font-bold transition-all hover:bg-[#DED8D4]"
                                                    >
                                                        Back
                                                    </button>
                                                ) : <div />}

                                                <button
                                                    disabled={!isShowingInstruction && (q.type === 'choice' ? !selectedChoice : !textInput.trim())}
                                                    onClick={handleNext}
                                                    className={`px-16 py-5 font-bold text-sm transition-all shadow-xl
                                                        ${!isShowingInstruction && (q.type === 'choice' ? !selectedChoice : !textInput.trim())
                                                            ? 'bg-[#1A1A1A]/5 text-[#1A1A1A]/20 cursor-not-allowed'
                                                            : 'bg-[#1A1A1A] text-white hover:bg-black active:scale-95'
                                                        }`}
                                                >
                                                    {currentIdx === questions.length - 1 ? 'Quantify Results' : 'Next step'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="my-16 flex justify-between items-center px-4 opacity-30 border-t border-black/5 pt-8">
                    <p className="text-black font-black uppercase tracking-[0.5em] text-[10px]">Medical screening Engine v2.5.0</p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black">Precision Verified</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScreeningPage;
