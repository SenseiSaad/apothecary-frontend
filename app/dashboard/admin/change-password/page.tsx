'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { hasRole } from '@/lib/auth';
import { Button, Input } from '@/components/ui';

export default function AdminChangePassword() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!hasRole('admin')) {
            router.push('/auth/login');
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const validatePassword = (password: string) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number';
        }
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }

        const passwordError = validatePassword(formData.newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError('New password must be different from current password');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setSuccess(true);
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/dashboard/admin');
            }, 2000);
        }, 1500);
    };

    return (
        <DashboardLayout role="admin">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-[#4a3428]">Change Password</h2>
                    <p className="text-gray-600">Update your account password securely</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden">
                    {/* Icon Header */}
                    <div className="bg-gradient-to-br from-[#fef3e8] to-[#f5e6d3] border-b-2 border-[#E67E3C]/20 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#E67E3C] to-[#d16b2a] rounded-2xl flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#4a3428]">🔐 Security Settings</h3>
                                <p className="text-gray-600 text-sm">Keep your account secure with a strong password</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {success ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">✅ Password Changed Successfully!</h3>
                                <p className="text-gray-600 mb-4">Your password has been updated securely</p>
                                <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm flex items-start gap-3">
                                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-medium">{error}</span>
                                    </div>
                                )}

                                {/* Current Password */}
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    label="🔒 Current Password"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Enter your current password"
                                    required
                                />

                                {/* New Password */}
                                <div>
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        label="🔑 New Password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter your new password"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-2 flex items-start gap-2">
                                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Must be at least 8 characters with uppercase, lowercase, and numbers</span>
                                    </p>
                                </div>

                                {/* Confirm Password */}
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    label="✅ Confirm New Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter your new password"
                                    required
                                />

                                {/* Password Strength Tips */}
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4">
                                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Password Security Tips
                                    </h4>
                                    <ul className="space-y-1 text-sm text-blue-700">
                                        <li className="flex items-center gap-2">
                                            <span className="text-blue-500">•</span> Use a mix of letters, numbers, and symbols
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-blue-500">•</span> Avoid common words or personal information
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-blue-500">•</span> Make it unique - don't reuse passwords
                                        </li>
                                    </ul>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-200">
                                    <Button
                                        type="submit"
                                        isLoading={isLoading}
                                        className="flex-1 rounded-full"
                                    >
                                        {isLoading ? '🔄 Updating...' : '🔐 Update Password'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => router.back()}
                                        className="flex-1 rounded-full"
                                    >
                                        ← Cancel
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
