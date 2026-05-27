'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { getSession, hasRole } from '@/lib/auth';
import { apiRequest } from '@/lib/api';
import { Input, Button, Checkbox } from '@/components/ui';

export default function PatientProfile() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [originalGender, setOriginalGender] = useState('');
    
    const [formData, setFormData] = useState({
        full_name: '',
        date_of_birth: '',
        phone_number: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        illness_description: '',
        care_status: 'needs_care' as 'needs_care' | 'assigned' | 'in_treatment' | 'treated' | 'inactive',
        gender: '' as 'girl' | 'boy' | '',
        preferences: {
            notifications_enabled: true,
            email_notifications: true,
            push_notifications: false,
            theme: 'light' as 'light' | 'dark' | 'system'
        }
    });

    useEffect(() => {
        if (!hasRole('patient')) {
            router.push('/auth/login');
            return;
        }

        const session = getSession();
        if (!session) {
            router.push('/auth/login');
            return;
        }

        apiRequest<any>('/patient/profile', { token: session.access_token })
            .then((res) => {
                if (res.data?.patient) {
                    const p = res.data.patient;
                    const gender = p.avatar_state?.gender || '';
                    setOriginalGender(gender);
                    setFormData({
                        full_name: p.full_name || '',
                        date_of_birth: p.date_of_birth || '',
                        phone_number: p.phone_number || '',
                        timezone: p.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
                        illness_description: p.illness_description || '',
                        care_status: p.care_status || 'needs_care',
                        gender: gender,
                        preferences: {
                            notifications_enabled: p.preferences?.notifications_enabled ?? true,
                            email_notifications: p.preferences?.email_notifications ?? true,
                            push_notifications: p.preferences?.push_notifications ?? false,
                            theme: p.preferences?.theme || 'light'
                        }
                    });
                }
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : 'Unable to load profile.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (name.startsWith('pref_')) {
            const prefName = name.replace('pref_', '');
            setFormData(prev => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    [prefName]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        setIsSaving(true);

        const session = getSession();
        try {
            // 1. Update Profile
            await apiRequest('/patient/profile', {
                method: 'PATCH',
                body: JSON.stringify({
                    full_name: formData.full_name,
                    date_of_birth: formData.date_of_birth,
                    phone_number: formData.phone_number,
                    timezone: formData.timezone,
                    illness_description: formData.illness_description,
                    preferences: formData.preferences
                }),
                token: session?.access_token
            });

            // 2. Assign Avatar if gender selected and wasn't set before
            if (formData.gender && !originalGender) {
                await apiRequest('/patient/avatar/assign', {
                    method: 'POST',
                    body: JSON.stringify({ gender: formData.gender }),
                    token: session?.access_token
                });
            }

            setSuccess('Profile updated successfully!');
            setTimeout(() => router.push('/dashboard/patient'), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    const updateCareStatus = async (care_status: 'needs_care' | 'treated') => {
        setSuccess('');
        setError('');
        setIsSaving(true);

        const session = getSession();
        try {
            await apiRequest('/patient/care-status', {
                method: 'PATCH',
                body: JSON.stringify({
                    care_status,
                    ...(formData.illness_description.trim() ? { illness_description: formData.illness_description.trim() } : {}),
                }),
                token: session?.access_token
            });

            setFormData(prev => ({ ...prev, care_status }));
            setSuccess(care_status === 'treated' ? 'You are marked as no longer needing treatment.' : 'You are marked as needing treatment again.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update care status.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout role="patient">
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Loading profile...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="patient">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
                    <p className="text-gray-600 mt-1">Complete your profile details and select your avatar gender.</p>
                </div>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                id="full_name"
                                name="full_name"
                                type="text"
                                label="Full Name"
                                required
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="John Doe"
                            />

                            <Input
                                id="date_of_birth"
                                name="date_of_birth"
                                type="text"
                                label="Date of Birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                placeholder="YYYY-MM-DD"
                            />

                            <Input
                                id="phone_number"
                                name="phone_number"
                                type="text"
                                label="Phone Number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                placeholder="+1234567890"
                            />

                            <Input
                                id="timezone"
                                name="timezone"
                                type="text"
                                label="Timezone"
                                value={formData.timezone}
                                onChange={handleChange}
                                placeholder="America/New_York"
                            />

                            <div className="md:col-span-2 flex flex-col gap-2">
                                <label htmlFor="illness_description" className="text-sm font-medium text-gray-700">Illness or Reason for Care</label>
                                <textarea
                                    id="illness_description"
                                    name="illness_description"
                                    rows={4}
                                    value={formData.illness_description}
                                    onChange={handleChange}
                                    placeholder="Briefly describe what you need treatment for."
                                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Gender Selection */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Avatar Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    disabled={!!originalGender}
                                    className={`w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${!!originalGender ? 'bg-gray-50 text-gray-500' : ''}`}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="girl">Girl</option>
                                    <option value="boy">Boy</option>
                                </select>
                                {originalGender && (
                                    <p className="text-xs text-gray-500">Avatar gender cannot be changed after assignment.</p>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="text-lg font-bold text-foreground mb-4">Care Status</h3>
                            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                                <p className="text-sm text-gray-600">
                                    Current status: <span className="font-semibold capitalize text-foreground">{formData.care_status.replace(/_/g, ' ')}</span>
                                </p>
                                <div className="mt-3 flex flex-wrap gap-3">
                                    <Button type="button" size="sm" variant="outline" disabled={isSaving || formData.care_status === 'needs_care'} onClick={() => void updateCareStatus('needs_care')}>
                                        Need Treatment
                                    </Button>
                                    <Button type="button" size="sm" variant="secondary" disabled={isSaving || formData.care_status === 'treated'} onClick={() => void updateCareStatus('treated')}>
                                        No Longer Need Treatment
                                    </Button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-foreground mb-4">Preferences</h3>
                            
                            <div className="space-y-3">
                                <Checkbox
                                    id="pref_notifications_enabled"
                                    name="pref_notifications_enabled"
                                    checked={formData.preferences.notifications_enabled}
                                    onChange={handleChange}
                                    label="Enable Notifications"
                                />

                                <Checkbox
                                    id="pref_email_notifications"
                                    name="pref_email_notifications"
                                    checked={formData.preferences.email_notifications}
                                    onChange={handleChange}
                                    label="Receive Email Notifications"
                                />

                                <Checkbox
                                    id="pref_push_notifications"
                                    name="pref_push_notifications"
                                    checked={formData.preferences.push_notifications}
                                    onChange={handleChange}
                                    label="Receive Push Notifications"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => router.push('/dashboard/patient')}>
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={isSaving}>
                                Save Profile
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
