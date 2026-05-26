'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Clock, RefreshCcw, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui';
import { getSession, hasRole } from '@/lib/auth';
import { apiRequest } from '@/lib/api';

type SlotStatus = 'available' | 'requested' | 'pending' | 'confirmed' | 'cancelled' | 'completed';

interface SessionBooking {
    _id: string;
    doctor_id: string;
    patient_id?: { _id: string; full_name: string };
    scheduled_at: string;
    duration_mins: number;
    status: SlotStatus;
    mode: 'video' | 'text' | 'either';
}

type TimeBlock = {
    start: string;
    end: string;
};

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function toDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDaysInMonth(year: number, month: number) {
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const cells: Array<Date | null> = Array.from({ length: firstDay }, () => null);

    for (let day = 1; day <= days; day += 1) {
        cells.push(new Date(year, month, day));
    }

    return cells;
}

function getStatusColor(status: SlotStatus) {
    switch (status) {
        case 'available':
            return 'bg-blue-100 text-blue-700';
        case 'requested':
            return 'bg-yellow-100 text-yellow-700';
        case 'pending':
            return 'bg-orange-100 text-orange-700';
        case 'confirmed':
            return 'bg-green-100 text-green-700';
        case 'completed':
            return 'bg-gray-100 text-gray-700';
        default:
            return 'bg-red-100 text-red-700';
    }
}

export default function DoctorSchedule() {
    const router = useRouter();
    const today = new Date();
    const [displayYear, setDisplayYear] = useState(today.getFullYear());
    const [displayMonth, setDisplayMonth] = useState(today.getMonth());
    const [selectedDates, setSelectedDates] = useState<string[]>([toDateKey(today)]);
    const [slots, setSlots] = useState<SessionBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([{ start: '09:00', end: '17:00' }]);
    const [mode, setMode] = useState<'video' | 'text' | 'either'>('video');
    const [isGenerating, setIsGenerating] = useState(false);

    const token = typeof window !== 'undefined' ? getSession()?.access_token : undefined;

    useEffect(() => {
        setMounted(true);
        if (!hasRole('doctor')) {
            router.push('/auth/login');
            return;
        }

        void fetchSlots();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    const monthStart = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-01`;
    const monthEnd = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(new Date(displayYear, displayMonth + 1, 0).getDate()).padStart(2, '0')}`;

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const data = await apiRequest<SessionBooking[]>(`/doctor/slots?start_date=${monthStart}&end_date=${monthEnd}`, { token });
            if (data.success) {
                setSlots(data.data || []);
            }
        } catch (error) {
            setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to fetch slots.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mounted) {
            void fetchSlots();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayMonth, displayYear]);

    const slotsByDate = useMemo(() => {
        return slots.reduce((acc, slot) => {
            const dateKey = toDateKey(new Date(slot.scheduled_at));
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(slot);
            return acc;
        }, {} as Record<string, SessionBooking[]>);
    }, [slots]);

    const selectedSlots = selectedDates.flatMap(date => slotsByDate[date] || []);
    const calendarCells = getDaysInMonth(displayYear, displayMonth);

    const toggleDate = (date: Date) => {
        const key = toDateKey(date);
        setSelectedDates(current => (
            current.includes(key)
                ? current.filter(item => item !== key)
                : [...current, key].sort()
        ));
    };

    const selectWeekdays = () => {
        const weekdays = calendarCells
            .filter((date): date is Date => Boolean(date))
            .filter(date => date.getDay() >= 1 && date.getDay() <= 5)
            .map(toDateKey);
        setSelectedDates(weekdays);
    };

    const handleGenerateSlots = async () => {
        const session = getSession();
        if (!session) {
            router.push('/auth/login');
            return;
        }

        if (selectedDates.length === 0) {
            setNotice({ type: 'error', message: 'Select at least one date.' });
            return;
        }

        setIsGenerating(true);
        setNotice(null);

        try {
            const results = await Promise.all(timeBlocks.map(block =>
                apiRequest<{ generated_slots: number; results: Record<string, number> }>('/doctor/slots/generate', {
                    method: 'POST',
                    token: session.access_token,
                    body: JSON.stringify({
                        dates: selectedDates,
                        start_time: block.start,
                        end_time: block.end,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
                        mode
                    })
                })
            ));

            const generated = results.reduce((sum, result) => sum + (result.data?.generated_slots || 0), 0);
            setNotice({ type: 'success', message: `Generated ${generated} available slot${generated === 1 ? '' : 's'}. Existing overlaps were skipped.` });
            await fetchSlots();
        } catch (error) {
            setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to generate slots. Please check your dates and time ranges.' });
        } finally {
            setIsGenerating(false);
        }
    };

    const updateTimeBlock = (index: number, field: keyof TimeBlock, value: string) => {
        setTimeBlocks(current => current.map((block, itemIndex) => (
            itemIndex === index ? { ...block, [field]: value } : block
        )));
    };

    if (!mounted) {
        return (
            <DashboardLayout role="doctor">
                <div className="p-8 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
                    <div className="h-64 bg-gray-100 rounded-2xl" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="doctor">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#4a3428]">Availability Slots</h2>
                        <p className="text-gray-600">Select future dates and publish available session times in advance.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchSlots} leftIcon={<RefreshCcw className="h-4 w-4" />}>
                        Refresh
                    </Button>
                </div>

                {notice && (
                    <div className={`rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {notice.message}
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-wrap items-center gap-3">
                                <select
                                    value={displayMonth}
                                    onChange={event => setDisplayMonth(Number(event.target.value))}
                                    className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-[#E67E3C]"
                                >
                                    {monthNames.map((name, index) => (
                                        <option key={name} value={index}>{name}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    min={today.getFullYear()}
                                    max={today.getFullYear() + 3}
                                    value={displayYear}
                                    onChange={event => setDisplayYear(Number(event.target.value))}
                                    className="w-28 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-[#E67E3C]"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button type="button" size="sm" variant="ghost" onClick={selectWeekdays}>Select Weekdays</Button>
                                <Button type="button" size="sm" variant="ghost" onClick={() => setSelectedDates([])}>Clear</Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-2 text-center text-sm font-semibold text-gray-500">{day}</div>
                            ))}
                            {calendarCells.map((date, index) => {
                                if (!date) {
                                    return <div key={`empty-${index}`} className="min-h-[112px] rounded-lg bg-gray-50" />;
                                }

                                const key = toDateKey(date);
                                const daySlots = slotsByDate[key] || [];
                                const availableCount = daySlots.filter(slot => slot.status === 'available').length;
                                const bookedCount = daySlots.filter(slot => ['requested', 'pending', 'confirmed'].includes(slot.status)).length;
                                const isSelected = selectedDates.includes(key);
                                const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        disabled={isPast}
                                        onClick={() => toggleDate(date)}
                                        className={`min-h-[112px] rounded-lg border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${isSelected ? 'border-[#E67E3C] bg-[#fef3e8]' : 'border-gray-200 bg-white hover:border-[#E67E3C]'}`}
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className={`text-sm font-bold ${isSelected ? 'text-[#E67E3C]' : 'text-gray-700'}`}>{date.getDate()}</span>
                                            {isSelected && <span className="rounded-full bg-[#E67E3C] px-2 py-0.5 text-xs font-semibold text-white">Selected</span>}
                                        </div>
                                        <div className="space-y-1">
                                            {availableCount > 0 && <p className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">{availableCount} available</p>}
                                            {bookedCount > 0 && <p className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">{bookedCount} requested/booked</p>}
                                            {availableCount === 0 && bookedCount === 0 && <p className="pt-3 text-center text-xs text-gray-400">No slots</p>}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-[#E67E3C]" />
                                <h3 className="text-lg font-bold text-[#4a3428]">Generate Slots</h3>
                            </div>
                            <p className="mb-4 text-sm text-gray-600">{selectedDates.length} date{selectedDates.length === 1 ? '' : 's'} selected.</p>

                            <div className="mb-4 max-h-24 overflow-y-auto rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                                {selectedDates.length ? selectedDates.join(', ') : 'No dates selected'}
                            </div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">Session Mode</label>
                            <select
                                value={mode}
                                onChange={event => setMode(event.target.value as 'video' | 'text' | 'either')}
                                className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-[#E67E3C]"
                            >
                                <option value="video">Video</option>
                                <option value="text">Text</option>
                                <option value="either">Either</option>
                            </select>

                            <div className="space-y-3">
                                {timeBlocks.map((block, index) => (
                                    <div key={index} className="rounded-lg border border-gray-200 p-3">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-sm font-semibold text-[#4a3428]">
                                                <Clock className="h-4 w-4 text-[#E67E3C]" />
                                                Time Block {index + 1}
                                            </span>
                                            {timeBlocks.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setTimeBlocks(current => current.filter((_, itemIndex) => itemIndex !== index))}
                                                    className="rounded p-1 text-red-500 hover:bg-red-50"
                                                    aria-label="Remove time block"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-gray-500">Start</label>
                                                <input
                                                    type="time"
                                                    value={block.start}
                                                    onChange={event => updateTimeBlock(index, 'start', event.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#E67E3C]"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-gray-500">End</label>
                                                <input
                                                    type="time"
                                                    value={block.end}
                                                    onChange={event => updateTimeBlock(index, 'end', event.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#E67E3C]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex flex-col gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setTimeBlocks(current => [...current, { start: '13:00', end: '17:00' }])}
                                >
                                    Add Time Block
                                </Button>
                                <Button
                                    type="button"
                                    isLoading={isGenerating}
                                    disabled={selectedDates.length === 0}
                                    onClick={handleGenerateSlots}
                                >
                                    Generate Availability
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-bold text-[#4a3428]">Selected Date Slots</h3>
                            {loading ? (
                                <p className="text-sm text-gray-500">Loading slots...</p>
                            ) : selectedSlots.length === 0 ? (
                                <p className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">No slots on selected dates.</p>
                            ) : (
                                <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                                    {selectedSlots.map(slot => (
                                        <div key={slot._id} className="rounded-lg border border-gray-200 p-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-[#4a3428]">
                                                        {new Date(slot.scheduled_at).toLocaleString([], {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: 'numeric',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{slot.duration_mins} minutes - {slot.mode}</p>
                                                </div>
                                                <span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${getStatusColor(slot.status)}`}>{slot.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
