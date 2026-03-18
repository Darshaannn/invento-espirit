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
                    <p className="text-[#8B0000] font-bold uppercase tracking-widest text-xs mb-4">
                        Memorize these words — {timeLeft}s
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        {words.map(w => (
                            <div key={w} className="bg-[#1A1A1A] text-white font-bold py-4 text-center text-lg">{w}</div>
                        ))}
                    </div>
                </div>
            )}
            {phase === 'recall' && (
                <div>
                    <p className="text-[#1A1A1A]/60 text-sm font-bold mb-4 uppercase tracking-widest">Type the words you remember:</p>
                    <div className="grid grid-cols-2 gap-3">
                        {inputs.map((val, i) => (
                            <input
                                key={i}
                                value={val}
                                onChange={e => {
                                    const n = [...inputs];
                                    n[i] = e.target.value;
                                    setInputs(n);
                                }}
                                placeholder={`Word ${i + 1}`}
                                className="border border-[#1A1A1A]/10 px-4 py-3 font-bold bg-white focus:outline-none focus:border-[#8B0000]"
                            />
                        ))}
                    </div>
                    <button onClick={submit} className="mt-6 w-full bg-[#1A1A1A] text-white py-4 font-black uppercase tracking-widest hover:bg-black transition-all">
                        Submit
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
                    <p className="text-[#8B0000] font-bold uppercase tracking-widest text-xs mb-6">Watch the sequence</p>
                    <div className="flex justify-center gap-4">
                        {sequence.map((n, i) => (
                            <div key={i} className={`w-14 h-14 flex items-center justify-center text-3xl font-black border-2 transition-all duration-200
                ${i === showing ? 'bg-[#8B0000] text-white border-[#8B0000] scale-110' : 'bg-white text-transparent border-[#1A1A1A]/10'}`}>
                                {i <= showing ? n : '?'}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {phase === 'input' && (
                <div>
                    <p className="text-[#1A1A1A]/60 text-sm font-bold mb-4 uppercase tracking-widest">Type the sequence:</p>
                    <input
                        autoFocus
                        value={userInput}
                        onChange={e => setUserInput(e.target.value.replace(/\D/g, '').slice(0, sequence.length))}
                        placeholder="e.g. 3729"
                        className="text-center text-3xl font-black border-2 border-[#1A1A1A]/10 px-6 py-4 w-full focus:outline-none focus:border-[#8B0000]"
                    />
                    <button onClick={check} disabled={userInput.length !== sequence.length}
                        className="mt-4 w-full bg-[#1A1A1A] text-white py-4 font-black disabled:opacity-30 transition-all hover:bg-black">
                        Confirm
                    </button>
                    <p className="text-xs text-[#1A1A1A]/30 mt-3 font-bold">Round {rounds + 1} of 4 · Length: {sequence.length}</p>
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
        <div className="space-y-6">
            <p className="text-[#8B0000] font-bold uppercase tracking-widest text-xs">Question {idx + 1} of {ODD_SETS.length} — Which doesn&apos;t belong?</p>
            <div className="grid grid-cols-2 gap-3">
                {set.words.map(w => (
                    <button
                        key={w}
                        onClick={() => pick(w)}
                        className={`py-5 text-lg font-bold border-2 transition-all ${!revealed ? 'border-[#1A1A1A]/10 bg-white hover:border-[#8B0000] hover:bg-[#8B0000]/5'
                                : w === set.answer ? 'border-green-500 bg-green-50 text-green-700'
                                    : w === selected ? 'border-red-400 bg-red-50 text-red-600'
                                        : 'border-[#1A1A1A]/5 bg-[#F5F1EE]/50 text-[#1A1A1A]/30'
                            }`}
                    >
                        {w}
                        {revealed && w === set.answer && <CheckCircle2 className="inline ml-2" size={16} />}
                        {revealed && w !== set.answer && w === selected && <XCircle className="inline ml-2" size={16} />}
                    </button>
                ))}
            </div>
            {revealed && (
                <div className="bg-[#1A1A1A]/5 p-4 text-sm font-medium text-[#1A1A1A]/60">
                    <strong className="text-[#8B0000]">{set.answer}</strong> — {set.reason}
                </div>
            )}
            {revealed && (
                <button onClick={next} className="w-full bg-[#1A1A1A] text-white py-4 font-black uppercase tracking-widest hover:bg-black transition-all">
                    {idx >= ODD_SETS.length - 1 ? 'See Results' : 'Next Question →'}
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
        <div className="min-h-screen bg-[#F5F1EE] font-sans p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#8B0000] flex items-center justify-center">
                            <Brain size={20} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-[#1A1A1A] tracking-tight">Brain Games</h1>
                    </div>
                    <p className="text-[#1A1A1A]/50 font-medium">Short cognitive exercises to keep your mind sharp. Play at least once a day.</p>
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
                                    className="bg-white border border-[#1A1A1A]/5 p-8 shadow-sm hover:shadow-lg transition-all group cursor-pointer"
                                    onClick={() => setActiveGame(g.key)}
                                >
                                    {scores[g.key] !== undefined && (
                                        <div className="flex items-center gap-2 mb-4 text-green-600">
                                            <Trophy size={14} />
                                            <span className="text-xs font-black uppercase tracking-widest">Score: {scores[g.key]}%</span>
                                        </div>
                                    )}
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#8B0000]/60 mb-3 block">{g.domain}</span>
                                    <h2 className="text-xl font-black text-[#1A1A1A] mb-3 group-hover:text-[#8B0000] transition-colors">{g.title}</h2>
                                    <p className="text-sm text-[#1A1A1A]/50 font-medium leading-relaxed">{g.description}</p>
                                    <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/30 group-hover:text-[#8B0000] transition-colors">
                                        {scores[g.key] !== undefined ? <><RefreshCw size={12} /> Play Again</> : 'Start Game →'}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div key="game" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="bg-white border border-[#1A1A1A]/5 p-8 md:p-12 shadow-lg">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-black text-[#1A1A1A]">
                                        {GAMES.find(g => g.key === activeGame)?.title}
                                    </h2>
                                    <button onClick={() => setActiveGame(null)}
                                        className="text-sm font-bold text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors">
                                        ← Back
                                    </button>
                                </div>
                                {activeGame === 'word-recall' && <WordRecall onComplete={s => handleComplete('word-recall', s)} />}
                                {activeGame === 'number-span' && <NumberSpan onComplete={s => handleComplete('number-span', s)} />}
                                {activeGame === 'odd-one-out' && <OddOneOut onComplete={s => handleComplete('odd-one-out', s)} />}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Overall score summary */}
                {Object.keys(scores).length === 3 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-8 bg-[#1A1A1A] text-white p-8 flex justify-between items-center">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Games Session Score</p>
                            <p className="text-5xl font-black italic">
                                {Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 3)}
                                <span className="text-2xl opacity-40">%</span>
                            </p>
                        </div>
                        <button onClick={() => setScores({})}
                            className="flex items-center gap-2 px-6 py-3 border border-white/20 text-sm font-bold hover:bg-white hover:text-[#1A1A1A] transition-all">
                            <RefreshCw size={14} /> Play Again
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
