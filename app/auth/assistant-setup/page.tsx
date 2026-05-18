'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { apiRequest } from '@/lib/api';

type ValidateSetupResponse = {
    email: string;
    role: string;
    status: string;
    message: string;
};

const passwordRules = [
    'At least 12 characters',
    'One uppercase and one lowercase letter',
    'One number',
    'One special character',
];

function getPasswordError(password: string) {
    if (password.length < 12) return 'Password must be at least 12 characters.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character.';
    return null;
}

function AssistantSetupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isValidating, setIsValidating] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setNotice({ type: 'error', message: 'Setup link is missing a token.' });
                setIsValidating(false);
                setTimeout(() => router.push('/auth/login'), 1600);
                return;
            }

            try {
                const response = await apiRequest<ValidateSetupResponse>('/admin/assistant-setup/validate', {
                    method: 'POST',
                    body: JSON.stringify({ token }),
                });
                setEmail(response.data?.email || '');
            } catch (error) {
                setNotice({
                    type: 'error',
                    message: `${error instanceof Error ? error.message : 'This setup link is invalid or expired.'} Redirecting to sign in...`,
                });
                setTimeout(() => router.push('/auth/login'), 1800);
            } finally {
                setIsValidating(false);
            }
        };

        validateToken();
    }, [router, token]);

    const resendOtp = async () => {
        setNotice(null);
        setIsResending(true);

        try {
            await apiRequest('/admin/assistant-setup/resend-otp', {
                method: 'POST',
                body: JSON.stringify({ token }),
            });
            setNotice({ type: 'success', message: 'A fresh setup code was sent to your email.' });
        } catch (error) {
            setNotice({
                type: 'error',
                message: error instanceof Error ? error.message : 'Unable to resend setup code.',
            });
        } finally {
            setIsResending(false);
        }
    };

    const completeSetup = async (event: React.FormEvent) => {
        event.preventDefault();
        setNotice(null);

        const passwordError = getPasswordError(password);
        if (passwordError) {
            setNotice({ type: 'error', message: passwordError });
            return;
        }

        if (password !== confirmPassword) {
            setNotice({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        setIsSubmitting(true);

        try {
            await apiRequest('/admin/assistant-setup/complete', {
                method: 'POST',
                body: JSON.stringify({
                    token,
                    otp,
                    password,
                }),
            });
            setNotice({ type: 'success', message: 'Password set successfully. Redirecting to sign in...' });
            setTimeout(() => router.push('/auth/login'), 1300);
        } catch (error) {
            setNotice({
                type: 'error',
                message: error instanceof Error ? error.message : 'Unable to complete setup.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
                <Link href="/" className="mb-8 flex justify-center">
                    <Image src="/logo.webp" height={80} width={300} alt="Apothecary Logo" className="mx-auto" />
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#4a3428]">Set Up Assistant Access</h1>
                    <p className="mt-2 text-gray-600">
                        Verify your invite and create your password.
                    </p>
                </div>

                {notice && (
                    <div
                        className={`mb-5 rounded-lg border px-4 py-3 text-sm ${notice.type === 'success'
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : 'border-red-200 bg-red-50 text-red-700'
                            }`}
                    >
                        {notice.message}
                    </div>
                )}

                {isValidating ? (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-6 text-center text-gray-600">
                        Checking setup link...
                    </div>
                ) : email ? (
                    <form onSubmit={completeSetup} className="space-y-4">
                        <Input label="Email Address" value={email} disabled />

                        <Input
                            id="otp"
                            name="otp"
                            inputMode="numeric"
                            label="Verification Code"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(event) => setOtp(event.target.value)}
                            placeholder="Enter 6-digit OTP"
                        />

                        <Input
                            id="password"
                            name="password"
                            type="password"
                            label="New Password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Create a secure password"
                        />

                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            label="Confirm Password"
                            required
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            placeholder="Confirm your password"
                        />

                        <div className="rounded-lg bg-[#fef3e8] px-4 py-3 text-sm text-[#4a3428]">
                            {passwordRules.map((rule) => (
                                <p key={rule}>{rule}</p>
                            ))}
                        </div>

                        <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
                            Set Password
                        </Button>

                        <button
                            type="button"
                            onClick={resendOtp}
                            disabled={isResending}
                            className="w-full text-sm font-medium text-[#E67E3C] hover:text-[#d16b2a] disabled:opacity-50"
                        >
                            {isResending ? 'Sending code...' : 'Send a new verification code'}
                        </button>
                    </form>
                ) : (
                    <Link href="/auth/login" className="text-center text-sm font-semibold text-[#E67E3C] hover:text-[#d16b2a]">
                        Back to sign in
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function AssistantSetupPage() {
    return (
        <Suspense fallback={null}>
            <AssistantSetupForm />
        </Suspense>
    );
}
