"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Brain, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Question {
    id: number;
    domain: string;
    question: string;
    type: 'choice' | 'text';
    options?: string[];
    correct?: string;
}

const QUESTION_TIME = 30;

export default function Assessment() {
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
    const [loading, setLoading] = useState(true);

    // Load questions from API on mount
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch('/api/questions');
                if (!res.ok) throw new Error('Failed to load questions');
                const data = await res.json();
                setQuestions(data.filter((q: Question) => q.type === 'choice'));
            } catch {
                // Fallback: load from JSON directly (shouldn't be needed if API works)
                setQuestions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    // Timer — resets on question change
    useEffect(() => {
        setTimeLeft(QUESTION_TIME);
    }, [currentIdx]);

    // Countdown
    useEffect(() => {
        if (loading || questions.length === 0) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Auto-advance on timer expiry
                    handleNext();
                    return QUESTION_TIME;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, questions, currentIdx]);

    const handleNext = useCallback(() => {
        if (questions.length === 0) return;
        const q = questions[currentIdx];
        if (selectedOption) {
            setAnswers(prev => ({ ...prev, [q.id]: selectedOption }));
        }
        setSelectedOption(null);
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
        } else {
            // Store answers in sessionStorage and navigate to dashboard
            const results = { ...answers, [q.id]: selectedOption || '' };
            sessionStorage.setItem('assessment_answers', JSON.stringify(results));
            router.push('/dashboard');
        }
    }, [currentIdx, questions, selectedOption, answers, router]);

    // Keyboard navigation — placed after handleNext is defined
    useEffect(() => {
        if (questions.length === 0) return;
        const currentQ = questions[currentIdx];
        const handleKey = (e: KeyboardEvent) => {
            if (!currentQ) return;
            const idx = parseInt(e.key) - 1;
            if (idx >= 0 && idx < (currentQ.options?.length ?? 0)) {
                setSelectedOption(currentQ.options![idx]);
            }
            if (e.key === 'Enter' && selectedOption) handleNext();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOption, currentIdx, questions, handleNext]);

    const handlePrev = () => {
        if (currentIdx > 0) {
            setCurrentIdx(prev => prev - 1);
            setSelectedOption(answers[questions[currentIdx - 1]?.id] || null);
        }
    };

    // Timer color logic
    const timerColor = timeLeft <= 5
        ? 'text-red-500'
        : timeLeft <= 10
            ? 'text-amber-400'
            : 'text-white';

    const timerBorder = timeLeft <= 5
        ? 'border-red-500/50 bg-red-500/10'
        : timeLeft <= 10
            ? 'border-amber-400/50 bg-amber-400/10'
            : 'border-white/10 bg-[#1A142E]';

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#8B0000]/20 border-t-[#8B0000] animate-spin mx-auto mb-4" />
                    <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Loading Assessment...</p>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white/60 mb-6">Could not load questions. Please try again.</p>
                    <Link href="/screening" className="bg-[#8B0000] text-white px-8 py-3 font-bold">Go Back</Link>
                </div>
            </div>
        );
    }

    const q = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-[#8B0000] selection:text-white relative overflow-hidden">
            {/* Background radial gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8B0000]/10 filter blur-[150px] opacity-20 pointer-events-none" />

            {/* HEADER */}
            <header className="flex justify-between items-center px-8 py-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#8B0000] flex items-center justify-center">
                        <Brain size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-wide">Invento Assessment</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 border flex items-center gap-2 text-sm font-bold transition-all ${timerBorder} ${timeLeft <= 5 ? 'animate-pulse' : ''}`}>
                        <span className={`text-xs font-black uppercase tracking-widest ${timerColor}`}>
                            {String(Math.floor(timeLeft / 60)).padStart(2, '0')} : {String(timeLeft % 60).padStart(2, '0')}
                        </span>
                    </div>
                </div>
            </header>

            {/* PROGRESS BAR */}
            <div className="w-full h-0.5 bg-white/5 relative z-10">
                <motion.div
                    className="h-full bg-[#8B0000]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-4xl bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 p-10 md:p-14 shadow-2xl relative">
                    {/* Question Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-[#8B0000] text-xs font-bold uppercase tracking-widest mb-1">
                                Question {currentIdx + 1} of {questions.length}
                            </h2>
                            <p className="text-gray-400 text-sm">{q.domain}</p>
                        </div>
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-[#1A142E]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                                <path className="text-[#8B0000]" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                            </svg>
                            <span className="absolute text-[9px] font-bold">{Math.round(progress)}%</span>
                        </div>
                    </div>

                    {/* Timer hint */}
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-6 transition-colors ${timerColor}`}>
                        {timeLeft <= 5 ? '⚠️ Time almost up!' : timeLeft <= 10 ? '⏱ Less than 10 seconds remaining' : 'Time remaining for this question'}
                    </p>

                    {/* Question Text */}
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={currentIdx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-2xl md:text-3xl font-bold text-center mb-12 leading-tight"
                        >
                            {q.question}
                        </motion.h1>
                    </AnimatePresence>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {q.options?.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedOption(opt)}
                                className={`p-4 border-2 text-left font-medium transition-all duration-200 flex items-center gap-3 ${selectedOption === opt
                                    ? 'bg-[#8B0000]/10 border-[#8B0000] shadow-[0_0_20px_rgba(139,0,0,0.3)]'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-300'
                                    }`}
                            >
                                <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold border shrink-0 ${selectedOption === opt ? 'border-[#8B0000] text-[#8B0000] bg-[#8B0000]/10' : 'border-white/10 text-gray-500'
                                    }`}>
                                    {selectedOption === opt ? <CheckCircle2 size={14} /> : String.fromCharCode(65 + i)}
                                </span>
                                {opt}
                            </button>
                        ))}
                    </div>

                    {/* Keyboard hint */}
                    <p className="text-center text-[10px] text-white/20 font-medium mb-8">
                        Tip: Press 1–4 to select, Enter to confirm
                    </p>

                    {/* Footer Navigation */}
                    <div className="flex justify-between items-center border-t border-white/5 pt-8">
                        <button
                            onClick={handlePrev}
                            disabled={currentIdx === 0}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ArrowLeft size={16} /> Previous
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!selectedOption}
                            className={`px-8 py-3 font-bold shadow-lg transition-all ${selectedOption
                                ? 'bg-[#8B0000] text-white hover:bg-red-700 hover:scale-105 active:scale-95 shadow-red-900/25'
                                : 'bg-[#8B0000]/20 text-white/30 cursor-not-allowed'
                                }`}
                        >
                            {currentIdx === questions.length - 1 ? 'Submit Assessment' : 'Next Question →'}
                        </button>
                    </div>
                </div>
            </main>

            {/* FOOTER HINT */}
            <footer className="py-6 text-center relative z-10">
                <div className="flex items-center justify-center gap-2">
                    {questions.map((_, i) => (
                        <div
                            key={i}
                            className={`transition-all duration-300 ${i === currentIdx ? 'w-4 h-1.5 bg-[#8B0000]' : i < currentIdx ? 'w-1.5 h-1.5 bg-white/40' : 'w-1.5 h-1.5 bg-white/10'
                                }`}
                        />
                    ))}
                </div>
            </footer>
        </div>
    );
}
