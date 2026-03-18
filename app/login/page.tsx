"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { Brain, ArrowRight, Mail, Phone, Lock, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [method, setMethod] = useState<'email' | 'phone' | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'input' | 'verify'>('input');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const res = await signIn('email', {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError(authMode === 'login' ? 'Invalid credentials. Please try again.' : 'Failed to create account. Please try again.');
            setIsLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    const handlePhoneAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (step === 'input') {
            if (phoneNumber.length < 10) {
                setError('Please enter a valid phone number');
                return;
            }
            setIsLoading(true);
            setTimeout(() => {
                setStep('verify');
                setIsLoading(false);
            }, 1500);
        } else {
            if (otp.length < 4) {
                setError('Please enter the 4-digit OTP');
                return;
            }
            setIsLoading(true);
            const res = await signIn('phone', {
                phone: phoneNumber,
                otp: otp,
                redirect: false,
            });

            if (res?.error) {
                setError('Invalid OTP. Please try again.');
                setIsLoading(false);
            } else {
                router.push('/dashboard');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F1EE] text-[#1A1A1A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative center light glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white opacity-40 blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white border border-[#1A1A1A]/5 shadow-2xl p-10 relative z-10"
            >
                <Link href="/" className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Brain size={24} className="text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase">Invento</span>
                </Link>

                <h1 className="text-4xl font-black mb-2 tracking-tight">
                    {authMode === 'login' ? 'Access Your Data' : 'Create Your Account'}
                </h1>
                <p className="text-[#1A1A1A]/50 font-medium mb-10">
                    {authMode === 'login'
                        ? 'Use your email or phone number to securely access your cognitive reports.'
                        : 'Sign up to start tracking your cognitive health and unlock personalized insights.'}
                </p>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2"
                    >
                        <AlertCircle size={16} />
                        {error}
                    </motion.div>
                )}

                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        {!method ? (
                            <motion.div
                                key="options"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <button
                                    onClick={() => setMethod('email')}
                                    className="w-full py-4 border border-[#1A1A1A]/10 font-bold flex items-center justify-center gap-3 hover:bg-[#1A1A1A]/5 transition-all text-[#1A1A1A]"
                                >
                                    <Mail size={20} />
                                    Continue with Email
                                </button>
                                <button
                                    onClick={() => setMethod('phone')}
                                    className="w-full py-4 bg-[#1A1A1A] text-white font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg"
                                >
                                    <Phone size={20} />
                                    Continue with Phone
                                </button>
                            </motion.div>
                        ) : method === 'email' ? (
                            <motion.form
                                key="email-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={handleEmailAuth}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/40 mb-2 block">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/20" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full pl-12 pr-4 py-4 border border-[#1A1A1A]/10 font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/40 mb-2 block">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/20" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-4 border border-[#1A1A1A]/10 font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setMethod(null)}
                                        className="px-6 py-4 border border-[#1A1A1A]/10 font-bold text-[#1A1A1A]/50 hover:bg-[#1A1A1A]/5 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-4 bg-[#1A1A1A] text-white font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (authMode === 'login' ? 'Login' : 'Create Account')}
                                        {!isLoading && <ArrowRight size={20} />}
                                    </button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="phone-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={handlePhoneAuth}
                                className="space-y-4"
                            >
                                {step === 'input' ? (
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/40 mb-2 block">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="+91 00000 00000"
                                            className="w-full p-4 border border-[#1A1A1A]/10 font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/40 mb-2 block">Enter 4-Digit OTP</label>
                                        <input
                                            type="text"
                                            maxLength={4}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="• • • •"
                                            className="w-full p-4 border border-[#1A1A1A]/10 font-bold text-center text-3xl tracking-[1em] focus:outline-none focus:border-indigo-500 transition-colors"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { setMethod(null); setStep('input'); }}
                                        className="px-6 py-4 border border-[#1A1A1A]/10 font-bold text-[#1A1A1A]/50 hover:bg-[#1A1A1A]/5 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-4 bg-[#1A1A1A] text-white font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (step === 'input' ? 'Get OTP' : (authMode === 'login' ? 'Verify & Login' : 'Verify & Create'))}
                                        {step === 'input' && !isLoading && <ArrowRight size={20} />}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-10 pt-6 border-t border-[#1A1A1A]/5 flex flex-col items-center gap-4">
                    <button
                        onClick={() => {
                            setAuthMode(authMode === 'login' ? 'signup' : 'login');
                            setError('');
                        }}
                        className="text-sm font-bold text-[#8B0000] hover:underline uppercase tracking-widest"
                    >
                        {authMode === 'login' ? "Create a new account" : "Already have an account? Login"}
                    </button>
                    {authMode === 'login' && (
                        <p className="text-[10px] text-[#1A1A1A]/30 font-medium italic text-center px-4">
                            One-tap secure access. If you don't have an account, one will be created instantly.
                        </p>
                    )}
                </div>

                <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/30">
                    No external dependencies — Local authentication active
                </p>
            </motion.div>

            {/* Decorative background elements */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
        </div>
    );
}
