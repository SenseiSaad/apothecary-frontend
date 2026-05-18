'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input, Button } from '@/components/ui';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Static - just show success message
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#fef3e8] via-[#f5e6d3] to-white">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-6">
                            <div className="text-3xl font-bold">
                                <span className="text-[#4a3428]">THINK</span>
                                <span className="text-[#E67E3C]"> WELL+</span>
                            </div>
                        </Link>

                        {!submitted ? (
                            <>
                                <div className="w-20 h-20 bg-[#E67E3C] rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6">
                                    🔑
                                </div>
                                <h2 className="text-3xl font-bold text-[#4a3428] mb-3">
                                    Forgot Password?
                                </h2>
                                <p className="text-gray-600">
                                    No worries! Enter your email and we'll send you reset instructions.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6">
                                    ✓
                                </div>
                                <h2 className="text-3xl font-bold text-[#4a3428] mb-3">
                                    Check Your Email
                                </h2>
                                <p className="text-gray-600">
                                    We've sent password reset instructions to <strong>{email}</strong>
                                </p>
                            </>
                        )}
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                label="Email Address"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />

                            <Button type="submit" fullWidth size="lg" className="rounded-full">
                                Send Reset Link
                            </Button>

                            <div className="text-center">
                                <Link href="/auth/login" className="text-sm text-[#E67E3C] hover:text-[#d16b2a] font-medium">
                                    ← Back to Login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-[#fef3e8] rounded-lg p-4 text-sm text-gray-700">
                                <p className="mb-2">Didn't receive the email?</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li>Check your spam folder</li>
                                    <li>Make sure the email address is correct</li>
                                    <li>Wait a few minutes and try again</li>
                                </ul>
                            </div>

                            <Button
                                onClick={() => setSubmitted(false)}
                                fullWidth
                                size="lg"
                                className="rounded-full"
                            >
                                Try Another Email
                            </Button>

                            <div className="text-center">
                                <Link href="/auth/login" className="text-sm text-[#E67E3C] hover:text-[#d16b2a] font-medium">
                                    ← Back to Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
