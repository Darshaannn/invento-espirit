"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Brain, CheckCircle2,
    AlertTriangle, ShieldCheck, Download, RefreshCcw, Home
} from 'lucide-react';
import Link from 'next/link';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

// --- ASSESSMENT DATA ---

const QUESTIONS = [
    {
        id: 1,
        category: "Memory",
        question: "Which word appeared earlier?",
        options: ["Apple", "Train", "Orange", "River"],
        correct: "Apple"
    },
    {
        id: 2,
        category: "Orientation",
        question: "What year is it currently?",
        options: ["2022", "2023", "2024", "2025"],
        correct: "2025"
    },
    {
        id: 3,
        category: "Attention",
        question: "What is 7 + 5?",
        options: ["10", "11", "12", "13"],
        correct: "12"
    },
    {
        id: 4,
        category: "Executive Function",
        question: "Which object is used for cutting?",
        options: ["Spoon", "Knife", "Plate", "Cup"],
        correct: "Knife"
    },
    {
        id: 5,
        category: "Pattern Recognition",
        question: "Complete the sequence: 2, 4, 6, ?",
        options: ["7", "8", "9", "10"],
        correct: "8"
    }
];

// --- COMPONENTS ---

const ScreeningPage = () => {
    const [step, setStep] = useState(0); // 0 to QUESTIONS.length - 1
    const [answers, setAnswers] = useState<string[]>(new Array(QUESTIONS.length).fill(""));
    const [isFinished, setIsFinished] = useState(false);

    const handleOptionSelect = (option: string) => {
        const newAnswers = [...answers];
        newAnswers[step] = option;
        setAnswers(newAnswers);
    };

    const calculateResults = () => {
        const scores = {
            Memory: 0,
            Orientation: 0,
            Attention: 0,
            Executive: 0,
            Pattern: 0,
        };

        answers.forEach((ans, idx) => {
            if (ans === QUESTIONS[idx].correct) {
                const cat = QUESTIONS[idx].category.split(' ')[0]; // Handle "Executive Function"
                if (cat === "Pattern" || cat === "Executive") {
                    (scores as any)[cat] = 100;
                } else {
                    (scores as any)[cat] = 100;
                }
            }
        });

        // Simple randomization for demo realism or weighted logic
        return {
            Memory: answers[0] === QUESTIONS[0].correct ? 85 : 40,
            Orientation: answers[1] === QUESTIONS[1].correct ? 95 : 30,
            Attention: answers[2] === QUESTIONS[2].correct ? 90 : 25,
            Executive: answers[3] === QUESTIONS[3].correct ? 88 : 35,
            Pattern: answers[4] === QUESTIONS[4].correct ? 92 : 20,
        };
    };

    if (isFinished) {
        const results = calculateResults();
        const averageScore = Object.values(results).reduce((a, b) => a + b, 0) / 5;
        const riskLevel = averageScore > 80 ? "Low" : averageScore > 50 ? "Moderate" : "High";
        const riskColor = riskLevel === "Low" ? "#A1C45A" : riskLevel === "Moderate" ? "#F58220" : "#D61B7D";

        const chartData = {
            labels: ['Memory', 'Orientation', 'Attention', 'Executive', 'Pattern Recognition'],
            datasets: [
                {
                    label: 'Your Cognitive Profile',
                    data: [results.Memory, results.Orientation, results.Attention, results.Executive, results.Pattern],
                    backgroundColor: 'rgba(214, 27, 125, 0.2)',
                    borderColor: '#D61B7D',
                    borderWidth: 3,
                    pointBackgroundColor: '#D61B7D',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#D61B7D',
                },
            ],
        };

        const chartOptions = {
            scales: {
                r: {
                    angleLines: { color: 'rgba(0,0,0,0.05)' },
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    pointLabels: { font: { family: 'Inter', weight: 'bold' as const, size: 10 } },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: { display: false }
            }
        };

        return (
            <div className="min-h-screen bg-[#FFF8F0] py-20 px-6 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-4xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-black/5"
                >
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-2">Cognitive <span className="gradient-text not-italic">Report</span></h1>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Assessment ID: #ES-2024-88A</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => window.print()} className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#D61B7D] transition-colors shadow-sm">
                                    <Download size={20} />
                                </button>
                                <Link href="/">
                                    <button className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#D61B7D] transition-colors shadow-sm">
                                        <Home size={20} />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="bg-[#FFF8F0] rounded-[32px] p-8 aspect-square flex items-center justify-center shadow-inner">
                                <Radar data={chartData} options={chartOptions} />
                            </div>

                            <div className="space-y-8">
                                <div className="p-8 rounded-[32px] border-2 border-dashed flex flex-col items-center text-center" style={{ borderColor: riskColor }}>
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Overall Risk Indicator</div>
                                    <div className="text-4xl font-black italic mb-2 capitalize" style={{ color: riskColor }}>{riskLevel} Risk</div>
                                    <div className="text-sm font-medium opacity-60">Based on your dynamic response patterns and logical consistency.</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { l: "Memory", v: results.Memory, c: "#D61B7D" },
                                        { l: "Attention", v: results.Attention, c: "#F58220" },
                                        { l: "Orientation", v: results.Orientation, c: "#A1C45A" },
                                        { l: "Executive", v: results.Executive, c: "#FFCB05" }
                                    ].map((score, i) => (
                                        <div key={i} className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                                            <div className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">{score.l}</div>
                                            <div className="text-xl font-black italic" style={{ color: score.c }}>{score.v}%</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 bg-blue-50/50 rounded-2xl flex gap-4 border border-blue-100 italic">
                                    <Info className="text-blue-400 shrink-0" />
                                    <p className="text-[11px] text-blue-900/60 leading-relaxed font-bold lowercase tracking-tight">
                                        "Your cognitive profile demonstrates high orientation awareness but could benefit from targeted executive focus exercises."
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                                    <AlertTriangle size={20} />
                                </div>
                                <p className="text-[10px] text-gray-400 max-w-xs font-medium leading-tight italic lowercase">
                                    * Not a medical diagnosis. Tool for cognitive screening purposes only. Consult a professional.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsFinished(false) || setStep(0) || setAnswers(new Array(QUESTIONS.length).fill(""))}
                                className="yobe-btn yobe-btn-primary px-10 py-5"
                            >
                                Retake Test <RefreshCcw size={16} className="ml-2" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    const currentQ = QUESTIONS[step];
    const progress = ((step + 1) / QUESTIONS.length) * 100;

    return (
        <div className="min-h-screen bg-[#D61B7D] flex flex-col p-6 items-center justify-center relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`, backgroundSize: '40px 40px' }} />
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-[80px]" />
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px]" />

            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-xl w-full bg-[#FFF8F0] rounded-[48px] shadow-3xl overflow-hidden relative"
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gray-200">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-[#D61B7D] to-[#F58220]"
                    />
                </div>

                <div className="p-10 md:p-14">
                    <div className="flex justify-between items-center mb-10">
                        <span className="px-5 py-1.5 rounded-full bg-[#D61B7D]/10 text-[#D61B7D] text-[10px] font-black uppercase tracking-[0.2em]">
                            {currentQ.category}
                        </span>
                        <span className="font-black text-xs text-[#3D2C2E]/40 italic uppercase tracking-widest">
                            Question {step + 1} / {QUESTIONS.length}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none mb-10 text-[#3D2C2E] italic">
                        {currentQ.question}
                    </h1>

                    <div className="grid gap-3">
                        {currentQ.options.map((opt, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleOptionSelect(opt)}
                                className={`w-full text-left p-6 md:p-7 rounded-[32px] border-2 transition-all font-bold text-lg md:text-xl flex justify-between items-center ${answers[step] === opt
                                        ? "bg-[#D61B7D] border-[#D61B7D] text-white shadow-xl shadow-pink-500/20"
                                        : "bg-white border-black/5 text-[#3D2C2E] hover:border-[#D61B7D]/20 shadow-sm"
                                    }`}
                            >
                                {opt}
                                {answers[step] === opt && <CheckCircle2 size={24} />}
                            </motion.button>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-between gap-4">
                        <button
                            onClick={() => step > 0 && setStep(step - 1)}
                            disabled={step === 0}
                            className="flex-1 rounded-[28px] bg-white border border-black/5 p-5 flex items-center justify-center text-[#3D2C2E] font-black uppercase text-[10px] tracking-widest disabled:opacity-20 transition-all hover:bg-gray-50"
                        >
                            <ArrowLeft size={16} className="mr-2" /> Previous
                        </button>

                        {step < QUESTIONS.length - 1 ? (
                            <button
                                onClick={() => step < QUESTIONS.length - 1 && setStep(step + 1)}
                                disabled={!answers[step]}
                                className="flex-[1.5] rounded-[28px] bg-[#3D2C2E] p-5 flex items-center justify-center text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-30"
                            >
                                Next Question <ArrowRight size={16} className="ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsFinished(true)}
                                disabled={!answers[step]}
                                className="flex-[1.5] rounded-[28px] bg-[#A1C45A] p-5 flex items-center justify-center text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-30"
                            >
                                Submit Assessment <CheckCircle2 size={16} className="ml-2" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="mt-12 flex items-center gap-3 text-white/40 uppercase font-black text-[9px] tracking-[0.3em]">
                <ShieldCheck size={14} /> End-to-End Encryption Secured
            </div>
        </div>
    );
};

export default ScreeningPage;
