"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Cpu, Timer, CheckCircle2,
    ArrowLeft, ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- UTILS ---
const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

const ScreeningPage = () => {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [startTime, setStartTime] = useState(Date.now());
    const [responseTime, setResponseTime] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [loading, setLoading] = useState(true);

    const analysisMessages = [
        "Analyzing cognitive response patterns...",
        "Evaluating memory performance metrics...",
        "Processing attention and focus patterns...",
        "Generating final cognitive health report..."
    ];

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch('/api/questions');
                const allQuestions = await res.json();

                // Distribution Logic: Memory 6, Attention 6, Executive 6, Orientation 7
                const memoryQ = shuffleArray(allQuestions.filter(q => q.domain.toLowerCase() === 'memory')).slice(0, 6);
                const attentionQ = shuffleArray(allQuestions.filter(q => q.domain.toLowerCase() === 'attention')).slice(0, 6);
                const executiveQ = shuffleArray(allQuestions.filter(q => q.domain.toLowerCase().includes('executive'))).slice(0, 6);
                const orientationQ = shuffleArray(allQuestions.filter(q => q.domain.toLowerCase() === 'orientation')).slice(0, 7);

                const selected = shuffleArray([...memoryQ, ...attentionQ, ...executiveQ, ...orientationQ]);
                setQuestions(selected);
                setLoading(false);
                setStartTime(Date.now());
            } catch (err) {
                console.error("Failed to load questions", err);
            }
        };

        fetchQuestions();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isAnalyzing && !loading) {
                setResponseTime(Number(((Date.now() - startTime) / 1000).toFixed(1)));
            }
        }, 100);
        return () => clearInterval(interval);
    }, [startTime, isAnalyzing, loading]);

    const handleOptionSelect = (option) => {
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
        const domainScores = {};
        answers.forEach(ans => {
            const domain = ans.domain;
            if (!domainScores[domain]) domainScores[domain] = { correct: 0, total: 0, time: 0 };
            domainScores[domain].total += 1;
            domainScores[domain].time += ans.time;
            if (ans.selected === ans.correct) domainScores[domain].correct += 1;
        });

        const reportData = {
            timestamp: Date.now(),
            answers,
            domainScores
        };

        localStorage.setItem('screening_report', JSON.stringify(reportData));
        router.push('/report');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
                    <p className="text-pink-500 font-bold uppercase tracking-widest text-[10px]">Booting AI Systems...</p>
                </div>
            </div>
        );
    }

    if (isAnalyzing) {
        return (
            <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center p-6 text-white text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-48 border-4 border-pink-500/20 border-t-pink-500 rounded-full flex items-center justify-center mb-12"
                >
                    <Cpu size={64} className="text-pink-500 animate-pulse" />
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={analysisStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <h2 className="text-2xl font-black italic mb-2">AI Analysis Engine</h2>
                        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">
                            {analysisMessages[analysisStep] || "Finalizing report..."}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    const q = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-6 relative">
            <div className="max-w-2xl w-full relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 mb-1">AI Screening Active</span>
                        <h2 className="text-2xl font-black italic text-[#1A1A1A]">Question {currentIdx + 1} <span className="text-[#1A1A1A]/20">/ {questions.length}</span></h2>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-black/5 shadow-sm">
                        <Timer size={18} className="text-pink-500" />
                        <span className="font-black italic text-[#1A1A1A]">{responseTime}s</span>
                    </div>
                </div>

                <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden mb-12">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-pink-500 to-orange-500"
                    />
                </div>

                <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-10 md:p-14 rounded-[48px] shadow-3xl border border-white"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 text-pink-500 text-[10px] font-black uppercase tracking-widest mb-8">{q.domain}</span>
                    <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter text-[#1A1A1A] leading-tight mb-12">{q.question}</h3>

                    <div className="grid gap-4">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleOptionSelect(opt)}
                                className="w-full text-left p-6 md:p-8 rounded-[32px] bg-white border border-black/5 hover:border-pink-500/20 hover:shadow-xl transition-all group flex justify-between items-center"
                            >
                                <span className="font-bold text-lg md:text-xl text-[#1A1A1A]">{opt}</span>
                                <div className="w-6 h-6 rounded-full border-2 border-black/5 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="mt-12 flex justify-center items-center gap-3 text-[#1A1A1A]/20 uppercase font-black text-[9px] tracking-[0.4em]">
                    <ShieldCheck size={14} /> Encrypted Neural Telemetry Secured
                </div>
            </div>
        </div>
    );
};

export default ScreeningPage;
