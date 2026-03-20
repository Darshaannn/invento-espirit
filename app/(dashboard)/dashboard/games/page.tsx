"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, RefreshCw, CheckCircle2, XCircle, Trophy } from 'lucide-react';

// ─── Game 1: Word Recall ─────────────────────────────────────────────────────
const WORD_SETS = [
    ['River', 'Lamp', 'Tiger', 'Crown', 'Pencil', 'Window'],
    ['Piano', 'Ocean', 'Marble', 'Feather', 'Lantern', 'Compass'],
    ['Anchor', 'Whistle', 'Castle', 'Mirror', 'Pebble', 'Ribbon'],
];

function WordRecall({ onComplete }: { onComplete: (score: number) => void }) {
    const [phase, setPhase] = useState<'memorize' | 'recall' | 'result'>('memorize');
    const [words] = useState(WORD_SETS[Math.floor(Math.random() * WORD_SETS.length)]);
    const [inputs, setInputs] = useState<string[]>(Array(6).fill(''));
    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        if (phase !== 'memorize') return;
        const t = setInterval(() => {
            setTimeLeft(p => {
                if (p <= 1) { clearInterval(t); setPhase('recall'); return 0; }
                return p - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [phase]);

    const submit = () => {
        const correct = inputs.filter(i =>
            words.some(w => w.toLowerCase() === i.trim().toLowerCase())
        ).length;
        onComplete(Math.round((correct / words.length) * 100));
        setPhase('result');
    };

    return (
        <div className="space-y-6">
            {phase === 'memorize' && (
                <div className="text-center">
                    <p className="text-[#ff4444] font-black uppercase tracking-[0.4em] text-[10px] mb-8 animate-pulse">
                        ENCODING NEURAL MARKERS — {timeLeft}S
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {words.map(w => (
                            <div key={w} className="bg-white/5 border border-white/5 text-white/90 font-black py-8 text-center text-xl uppercase italic tracking-tighter">{w}</div>
                        ))}
                    </div>
                </div>
            )}
            {phase === 'recall' && (
                <div>
                    <p className="text-white/30 text-[10px] font-black mb-6 uppercase tracking-[0.3em]">MANUAL RETRIEVAL REQUIRED:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {inputs.map((val, i) => (
                            <input
                                key={i}
                                value={val}
                                onChange={e => {
                                    const n = [...inputs];
                                    n[i] = e.target.value;
                                    setInputs(n);
                                }}
                                placeholder={`MARKER ${i + 1}`}
                                className="border border-white/10 px-6 py-4 font-black bg-white/5 text-white focus:outline-none focus:border-[#8B0000] uppercase text-xs tracking-widest placeholder:text-white/10"
                            />
                        ))}
                    </div>
                    <button onClick={submit} className="mt-10 w-full bg-[#8B0000] text-white py-6 font-black uppercase tracking-[0.5em] hover:bg-red-700 transition-all shadow-[0_20px_40px_-10px_rgba(139,0,0,0.3)] text-[11px]">
                        CALIBRATE DATA
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Game 2: Number Forward Span ─────────────────────────────────────────────
function NumberSpan({ onComplete }: { onComplete: (score: number) => void }) {
    const [phase, setPhase] = useState<'showing' | 'input' | 'result'>('showing');
    const [length, setLength] = useState(4);
    const [sequence, setSequence] = useState<number[]>([]);
    const [showing, setShowing] = useState(-1);
    const [userInput, setUserInput] = useState('');
    const [rounds, setRounds] = useState(0);
    const [correct, setCorrect] = useState(0);

    const generateRound = useCallback((len: number) => {
        const seq = Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1);
        setSequence(seq);
        setPhase('showing');
        setShowing(0);
        setUserInput('');
    }, []);

    useEffect(() => { generateRound(4); }, [generateRound]);

    useEffect(() => {
        if (phase !== 'showing' || showing < 0) return;
        if (showing >= sequence.length) {
            setTimeout(() => setPhase('input'), 500);
            return;
        }
        const t = setTimeout(() => setShowing(p => p + 1), 700);
        return () => clearTimeout(t);
    }, [phase, showing, sequence]);

    const check = () => {
        const expected = sequence.join('');
        const isCorrect = userInput === expected;
        const newRounds = rounds + 1;
        const newCorrect = correct + (isCorrect ? 1 : 0);
        setRounds(newRounds);
        setCorrect(newCorrect);

        if (newRounds >= 4) {
            onComplete(Math.round((newCorrect / newRounds) * 100));
            setPhase('result');
        } else {
            generateRound(isCorrect ? length + 1 : Math.max(4, length - 1));
            if (isCorrect) setLength(l => l + 1);
        }
    };

    return (
        <div className="text-center space-y-6">
            {phase === 'showing' && (
                <div>
                    <p className="text-[#ff4444] font-black uppercase tracking-[0.4em] text-[10px] mb-8 animate-pulse text-center">SEQUENTIAL LOGGING ACTIVE</p>
                    <div className="flex justify-center gap-4">
                        {sequence.map((n, i) => (
                            <div key={i} className={`w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center text-3xl sm:text-5xl font-black border transition-all duration-300
                ${i === showing ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-[0_0_20px_rgba(139,0,0,0.5)] scale-110' : 'bg-white/5 text-transparent border-white/5'}`}>
                                {i <= showing ? n : '?'}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {phase === 'input' && (
                <div>
                    <p className="text-white/30 text-[10px] font-black mb-8 uppercase tracking-[0.3em] text-center">RECONSTRUCT SEQUENCE:</p>
                    <input
                        autoFocus
                        value={userInput}
                        onChange={e => setUserInput(e.target.value.replace(/\D/g, '').slice(0, sequence.length))}
                        placeholder="VERIFY..."
                        className="text-center text-5xl font-black border border-white/10 px-6 py-8 w-full bg-white/5 text-white focus:outline-none focus:border-[#8B0000] tracking-[0.2em] italic"
                    />
                    <button onClick={check} disabled={userInput.length !== sequence.length}
                        className="mt-8 w-full bg-[#8B0000] text-white py-6 font-black uppercase tracking-[0.5em] disabled:opacity-10 transition-all hover:bg-red-700 shadow-[0_20px_40px_-10px_rgba(139,0,0,0.3)] text-[11px]">
                        VALIDATE STRING
                    </button>
                    <p className="text-[9px] text-white/20 mt-6 font-black uppercase tracking-widest text-center">ITERATION {rounds + 1} OF 4 • DEPTH: {sequence.length}</p>
                </div>
            )}
        </div>
    );
}

// ─── Game 3: Odd One Out ──────────────────────────────────────────────────────
const ODD_SETS = [
    { words: ['Monday', 'Tuesday', 'January', 'Friday'], answer: 'January', reason: 'Month, not a day' },
    { words: ['Apple', 'Banana', 'Potato', 'Orange'], answer: 'Potato', reason: 'Vegetable, not a fruit' },
    { words: ['Violin', 'Flute', 'Piano', 'Painting'], answer: 'Painting', reason: 'Art, not a musical instrument' },
    { words: ['Dog', 'Cat', 'Eagle', 'Fish'], answer: 'Eagle', reason: 'Bird, not a mammal or fish' },
    { words: ['Red', 'Blue', 'Circle', 'Green'], answer: 'Circle', reason: 'Shape, not a colour' },
];

function OddOneOut({ onComplete }: { onComplete: (score: number) => void }) {
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [correct, setCorrect] = useState(0);
    const [revealed, setRevealed] = useState(false);

    const set = ODD_SETS[idx];

    const pick = (word: string) => {
        if (revealed) return;
        setSelected(word);
        setRevealed(true);
        if (word === set.answer) setCorrect(c => c + 1);
    };

    const next = () => {
        if (idx >= ODD_SETS.length - 1) {
            onComplete(Math.round((correct + (selected === set.answer ? 0 : 0)) / ODD_SETS.length * 100));
            return;
        }
        setIdx(i => i + 1);
        setSelected(null);
        setRevealed(false);
    };

    return (
        <div className="space-y-10">
            <p className="text-[#ff4444] font-black uppercase tracking-[0.4em] text-[10px] mb-8 italic">ANOMALY DETECTION ACTIVE — CASE {idx + 1}/{ODD_SETS.length}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {set.words.map(w => (
                    <button
                        key={w}
                        onClick={() => pick(w)}
                        className={`py-8 text-xl font-black border transition-all uppercase italic tracking-tighter ${!revealed ? 'border-white/10 bg-white/5 hover:border-[#8B0000] hover:bg-[#8B0000]/10 text-white/90'
                            : w === set.answer ? 'border-green-500 bg-green-500/20 text-green-400'
                                : w === selected ? 'border-red-500 bg-red-500/20 text-red-500'
                                    : 'border-white/5 bg-white/5 text-white/10'
                            }`}
                    >
                        {w}
                        {revealed && w === set.answer && <CheckCircle2 className="inline ml-3" size={18} />}
                        {revealed && w !== set.answer && w === selected && <XCircle className="inline ml-3" size={18} />}
                    </button>
                ))}
            </div>
            {revealed && (
                <div className="bg-[#8B0000]/5 border-l-2 border-[#8B0000] p-6">
                    <p className="text-[10px] font-black text-[#8B0000] uppercase tracking-widest mb-2">Diagnostic Result:</p>
                    <p className="text-sm font-medium text-white/70 italic leading-relaxed">
                        <strong className="text-white font-black uppercase tracking-tight mr-2">{set.answer}</strong> — {set.reason}
                    </p>
                </div>
            )}
            {revealed && (
                <button onClick={next} className="w-full bg-[#8B0000] text-white py-6 font-black uppercase tracking-[0.5em] hover:bg-red-700 transition-all shadow-[0_20px_40px_-10px_rgba(139,0,0,0.3)] text-[11px]">
                    {idx >= ODD_SETS.length - 1 ? 'FETCH AGGREGATE' : 'NEXT CASE SEQUENCE →'}
                </button>
            )}
        </div>
    );
}

// ─── Main Games Page ──────────────────────────────────────────────────────────
type GameKey = 'word-recall' | 'number-span' | 'odd-one-out';

interface GameConfig {
    key: GameKey;
    title: string;
    description: string;
    domain: string;
}

const GAMES: GameConfig[] = [
    { key: 'word-recall', title: 'Word Recall', description: 'Memorize 6 words in 5 seconds, then recall as many as you can.', domain: 'Memory' },
    { key: 'number-span', title: 'Number Span', description: 'Remember a growing sequence of digits and type them back.', domain: 'Attention' },
    { key: 'odd-one-out', title: 'Odd One Out', description: '5 rapid-fire rounds: find the word that doesn\'t belong.', domain: 'Executive' },
];

export default function GamesPage() {
    const [activeGame, setActiveGame] = useState<GameKey | null>(null);
    const [scores, setScores] = useState<Partial<Record<GameKey, number>>>({});

    const handleComplete = (game: GameKey, score: number) => {
        setScores(prev => ({ ...prev, [game]: score }));
        setActiveGame(null);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] font-sans p-6 md:p-12 text-white/90">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#8B0000] flex items-center justify-center shadow-[0_0_15px_rgba(139,0,0,0.3)]">
                            <Brain size={20} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-white/90 tracking-tighter uppercase italic">Brain Games</h1>
                    </div>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Short cognitive exercises to keep your mind sharp. Play at least once a day.</p>
                </div>

                {/* Game Cards */}
                <AnimatePresence mode="wait">
                    {!activeGame ? (
                        <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {GAMES.map((g, i) => (
                                <motion.div
                                    key={g.key}
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                    className="bg-white/5 border border-white/10 p-8 shadow-2xl hover:border-[#8B0000]/40 transition-all group cursor-pointer backdrop-blur-md overflow-hidden relative"
                                    onClick={() => setActiveGame(g.key)}
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B0000]/5 blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                    {scores[g.key] !== undefined && (
                                        <div className="flex items-center gap-2 mb-4 text-green-500">
                                            <Trophy size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Score: {scores[g.key]}%</span>
                                        </div>
                                    )}
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B0000]/80 mb-3 block">{g.domain}</span>
                                    <h2 className="text-xl font-black text-white/90 mb-3 group-hover:text-white transition-colors tracking-tight uppercase italic">{g.title}</h2>
                                    <p className="text-[11px] text-white/30 font-bold uppercase tracking-widest leading-relaxed mb-6">{g.description}</p>
                                    <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#8B0000]/60 group-hover:text-[#8B0000] transition-colors">
                                        {scores[g.key] !== undefined ? <><RefreshCw size={12} className="animate-spin-slow" /> Play Again</> : 'Start Session →'}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div key="game" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="bg-white/5 border border-white/10 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
                                <div className="flex justify-between items-center mb-12">
                                    <h2 className="text-2xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                                        {GAMES.find(g => g.key === activeGame)?.title}
                                    </h2>
                                    <button onClick={() => setActiveGame(null)}
                                        className="text-[10px] font-black text-white/30 hover:text-white uppercase tracking-[0.3em] transition-all flex items-center gap-2">
                                        ← ARCHIVE
                                    </button>
                                </div>
                                <div className="text-white/90">
                                    {activeGame === 'word-recall' && <WordRecall onComplete={s => handleComplete('word-recall', s)} />}
                                    {activeGame === 'number-span' && <NumberSpan onComplete={s => handleComplete('number-span', s)} />}
                                    {activeGame === 'odd-one-out' && <OddOneOut onComplete={s => handleComplete('odd-one-out', s)} />}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Overall score summary */}
                {Object.keys(scores).length === 3 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-8 bg-white/5 border border-white/10 p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl backdrop-blur-md">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B0000] mb-2">Aggregated Session Precision</p>
                            <p className="text-5xl font-black italic tracking-tighter text-white">
                                {Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 3)}
                                <span className="text-2xl opacity-20 ml-1">%</span>
                            </p>
                        </div>
                        <button onClick={() => setScores({})}
                            className="flex items-center gap-3 px-10 py-5 bg-[#8B0000] text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-700 transition-all shadow-[0_0_20px_#8B0000]/20">
                            <RefreshCw size={14} /> RE-INITIALIZE
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
