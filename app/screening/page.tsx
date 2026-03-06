"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Brain, CheckCircle2,
    ShieldCheck, Clock, Cpu, Activity, Timer
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import questionsData from '../../data/questions.json';

// --- UTILS ---
const shuffleArray = (array: any[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

const ScreeningPage = () => {
    const router = useRouter();
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<any[]>([]);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [responseTime, setResponseTime] = useState<number>(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);

    const analysisMessages = [
        "Analyzing cognitive response patterns...",
        "Evaluating neural latency metrics...",
        "Processing memory recall consistency...",
        "Benchmarking executive decision paths...",
        "Generating final cognitive health report..."
    ];

    // Initialize 10 random questions
    useEffect(() => {
        const shuffled = shuffleArray(questionsData);
        const selected = shuffled.slice(0, 10);
        setQuestions(selected);
        setStartTime(Date.now());
    }, []);

    // Timer for current response time
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isAnalyzing) {
                setResponseTime(Number(((Date.now() - startTime) / 1000).toFixed(1)));
            }
        }, 100);
        return () => clearInterval(interval);
    }, [startTime, isAnalyzing]);

    const handleOptionSelect = (option: string) => {
        const duration = (Date.now() - startTime) / 1000;
        const newAnswers = [...answers];
        newAnswers[currentIdx] = {
            questionId: questions[currentIdx].id,
            domain: questions[currentIdx].domain,
            selected: option,
            correct: questions[currentIdx].correct,
            time: duration
        };
        setAnswers(newAnswers);

        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setStartTime(Date.now());
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

    const finishTest = () => {
        // Calculate final stats to pass to report
        const domainScores: any = {};
        answers.forEach(ans => {
            if (!domainScores[ans.domain]) domainScores[ans.domain] = { correct: 0, total: 0, time: 0 };
            domainScores[ans.domain].total += 1;
            domainScores[ans.domain].time += ans.time;
            if (ans.selected === ans.correct) domainScores[ans.domain].correct += 1;
        });

        const reportData = {
            timestamp: Date.now(),
            answers,
            domainScores
        };

        localStorage.setItem('screening_report', JSON.stringify(reportData));
        router.push('/report');
    };

    if (questions.length === 0) return null;

    if (isAnalyzing) {
        return (
            <div className="min-h-screen bg-[#3D2C2E] flex flex-col items-center justify-center p-6 text-white">
                <div className="relative w-48 h-48 mb-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-[#D61B7D]/20 border-t-[#D61B7D] rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-4 bg-pink-500/10 rounded-full flex items-center justify-center"
                    >
                        <Cpu size={64} className="text-[#D61B7D]" />
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={analysisStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center"
                    >
                        <h2 className="text-2xl font-black italic mb-2">AI Analysis in Progress</h2>
                        <p className="text-white/40 font-medium uppercase tracking-[0.2em] text-xs">
                            {analysisMessages[analysisStep] || "Finalizing report..."}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-20 w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(analysisStep / analysisMessages.length) * 100}%` }}
                        className="h-full bg-[#D61B7D]"
                    />
                </div>
            </div>
        );
    }

    const q = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full" />

            <div className="max-w-2xl w-full relative z-10">
                <div className="flex justify-between items-center mb-10 px-4">
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-[0.3em] text-[#3D2C2E]/30 mb-1">AI Cognitive Screening</h1>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-black italic text-[#3D2C2E]">Question {currentIdx + 1}</span>
                            <span className="text-lg text-[#3D2C2E]/20 font-bold">/ {questions.length}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-black/5">
                        <Timer size={18} className="text-[#D61B7D]" />
                        <span className="font-black italic text-[#3D2C2E] tabular-nums">{responseTime}s</span>
                    </div>
                </div>

                <div className="w-full h-2 bg-white rounded-full overflow-hidden mb-12 shadow-inner border border-black/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-[#D61B7D] to-[#F58220]"
                    />
                </div>

                <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-10 md:p-14 rounded-[48px] shadow-3xl border-2 border-white"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 text-pink-500 text-[10px] font-black uppercase tracking-widest mb-8">
                        {q.domain}
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight mb-12 text-[#3D2C2E] italic">
                        {q.question}
                    </h2>

                    <div className="grid gap-4">
                        {q.options.map((opt: string, i: number) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.02, x: 8 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleOptionSelect(opt)}
                                className="w-full text-left p-6 md:p-8 rounded-[32px] bg-white border border-black/5 shadow-sm hover:shadow-xl hover:border-[#D61B7D]/20 transition-all group flex justify-between items-center"
                            >
                                <span className="font-bold text-lg md:text-xl text-[#3D2C2E] group-hover:text-[#D61B7D] transition-colors">{opt}</span>
                                <div className="w-6 h-6 rounded-full border-2 border-black/5 group-hover:border-[#D61B7D]/40 flex items-center justify-center transition-all">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#D61B7D] opacity-0 group-hover:opacity-10 transition-opacity" />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                <div className="mt-12 flex items-center justify-center gap-3 text-[#3D2C2E]/20 uppercase font-black text-[9px] tracking-[0.4em]">
                    <ShieldCheck size={14} /> Secure Neural Telemetry Active
                </div>
            </div>
        </div>
    );
};

export default ScreeningPage;
