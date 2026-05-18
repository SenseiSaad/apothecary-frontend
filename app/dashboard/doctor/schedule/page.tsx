'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { hasRole } from '@/lib/auth';
import {
    appointmentsData,
    getAppointmentsByDate,
    getUpcomingAppointments,
    getTodayAppointments,
    formatDisplayDate,
    formatTime,
    getWeekDates,
    formatDate,
    type Appointment,
} from '@/data/schedule';

export default function Assistantschedule() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        if (!hasRole('doctor')) {
            router.push('/auth/login');
        }
    }, [router]);

    const todayAppointments = getTodayAppointments();
    const upcomingAppointments = getUpcomingAppointments();
    const weekDates = getWeekDates(selectedDate);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-blue-100 text-blue-700';
            case 'Completed':
                return 'bg-green-100 text-green-700';
            case 'Cancelled':
                return 'bg-red-100 text-red-700';
            case 'No Show':
                return 'bg-gray-100 text-gray-700';
            case 'Rescheduled':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Initial Consultation':
                return 'bg-purple-100 text-purple-700';
            case 'Follow-up':
                return 'bg-blue-100 text-blue-700';
            case 'Consultation':
                return 'bg-[#fef3e8] text-[#E67E3C]';
            case 'Check-in':
                return 'bg-green-100 text-green-700';
            case 'Emergency':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handleViewDetails = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setShowDetailsModal(true);
    };

    const goToPreviousWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 7);
        setSelectedDate(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 7);
        setSelectedDate(newDate);
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    return (
        <DashboardLayout role="doctor">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#4a3428]">Schedule Management</h2>
                        <p className="text-gray-600">Manage your appointments and availability</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-[#E67E3C] text-white rounded-lg font-medium hover:bg-[#d16b2a] transition-colors">
                            + New Appointment
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                            Set Availability
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-gray-600 text-sm mb-1">Today's Sessions</p>
                        <p className="text-3xl font-bold text-[#4a3428]">{todayAppointments.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-gray-600 text-sm mb-1">Upcoming</p>
                        <p className="text-3xl font-bold text-blue-600">{upcomingAppointments.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-gray-600 text-sm mb-1">This Week</p>
                        <p className="text-3xl font-bold text-[#E67E3C]">
                            {appointmentsData.filter(apt => {
                                const aptDate = new Date(apt.date);
                                const weekStart = new Date(selectedDate);
                                weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
                                const weekEnd = new Date(weekStart);
                                weekEnd.setDate(weekStart.getDate() + 6);
                                return aptDate >= weekStart && aptDate <= weekEnd;
                            }).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-gray-600 text-sm mb-1">Completion Rate</p>
                        <p className="text-3xl font-bold text-green-600">96%</p>
                    </div>
                </div>

                {/* Calendar Navigation */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={goToPreviousWeek}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                ←
                            </button>
                            <h3 className="text-xl font-bold text-[#4a3428]">
                                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button
                                onClick={goToNextWeek}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                →
                            </button>
                            <button
                                onClick={goToToday}
                                className="px-4 py-2 bg-[#fef3e8] text-[#E67E3C] rounded-lg font-medium hover:bg-[#f5e6d3] transition-colors"
                            >
                                Today
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('day')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'day'
                                        ? 'bg-[#E67E3C] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Day
                            </button>
                            <button
                                onClick={() => setViewMode('week')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'week'
                                        ? 'bg-[#E67E3C] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setViewMode('month')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'month'
                                        ? 'bg-[#E67E3C] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Month
                            </button>
                        </div>
                    </div>

                    {/* Week View */}
                    {viewMode === 'week' && (
                        <div className="grid grid-cols-7 gap-2">
                            {weekDates.map((date, index) => {
                                const dateString = formatDate(date);
                                const dayAppointments = getAppointmentsByDate(dateString);
                                const isToday = formatDate(new Date()) === dateString;

                                return (
                                    <div
                                        key={index}
                                        className={`border rounded-lg p-3 min-h-[200px] ${isToday ? 'border-[#E67E3C] bg-[#fef3e8]' : 'border-gray-200 bg-white'
                                            }`}
                                    >
                                        <div className="text-center mb-3">
                                            <p className="text-xs text-gray-500">
                                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                            </p>
                                            <p
                                                className={`text-lg font-bold ${isToday ? 'text-[#E67E3C]' : 'text-gray-700'
                                                    }`}
                                            >
                                                {date.getDate()}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            {dayAppointments.map((apt) => (
                                                <div
                                                    key={apt.id}
                                                    onClick={() => handleViewDetails(apt)}
                                                    className="bg-[#E67E3C] text-white p-2 rounded-lg text-xs cursor-pointer hover:bg-[#d16b2a] transition-colors"
                                                >
                                                    <p className="font-medium">{formatTime(apt.startTime)}</p>
                                                    <p className="truncate">{apt.patientName}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Upcoming Appointments List */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-[#4a3428] mb-4">Upcoming Appointments</h3>
                    <div className="space-y-3">
                        {upcomingAppointments.slice(0, 5).map((apt) => (
                            <div
                                key={apt.id}
                                className="flex items-center justify-between p-4 bg-[#fef3e8] rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleViewDetails(apt)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="text-center min-w-[60px]">
                                        <p className="text-sm font-bold text-[#E67E3C]">{formatTime(apt.startTime)}</p>
                                        <p className="text-xs text-gray-600">{formatDisplayDate(apt.date)}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-[#E67E3C] rounded-full flex items-center justify-center text-white font-bold">
                                        {apt.patientName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#4a3428]">{apt.patientName}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(apt.type)}`}>
                                                {apt.type}
                                            </span>
                                            <span className="text-xs text-gray-600">• {apt.mode}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="bg-[#E67E3C] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#d16b2a] transition-colors">
                                    Start Session
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Appointment Details Modal */}
            {showDetailsModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-[#4a3428]">Appointment Details</h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Patient Info */}
                            <div className="flex items-center space-x-4 p-4 bg-[#fef3e8] rounded-2xl">
                                <div className="w-16 h-16 bg-[#E67E3C] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {selectedAppointment.patientName.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-[#4a3428]">{selectedAppointment.patientName}</h4>
                                    <p className="text-gray-600">Patient ID: #{selectedAppointment.patientId}</p>
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                                    <p className="font-semibold text-gray-700">{formatDisplayDate(selectedAppointment.date)}</p>
                                    <p className="text-sm text-gray-600">
                                        {formatTime(selectedAppointment.startTime)} - {formatTime(selectedAppointment.endTime)}
                                    </p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                                    <p className="font-semibold text-gray-700">{selectedAppointment.duration} minutes</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Type</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(selectedAppointment.type)}`}>
                                        {selectedAppointment.type}
                                    </span>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Mode</p>
                                    <p className="font-semibold text-gray-700">{selectedAppointment.mode}</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl p-4 col-span-2">
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedAppointment.status)}`}>
                                        {selectedAppointment.status}
                                    </span>
                                </div>
                            </div>

                            {/* Concerns */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-4">
                                <p className="text-xs text-gray-500 mb-2">Primary Concerns</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedAppointment.concerns.map((concern, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-[#fef3e8] text-[#6b4423] rounded-full text-sm font-medium"
                                        >
                                            {concern}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-4">
                                <p className="text-xs text-gray-500 mb-2">Session Notes</p>
                                <p className="text-sm text-gray-700">{selectedAppointment.notes}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {selectedAppointment.status === 'Scheduled' && (
                                    <>
                                        <button className="flex-1 bg-[#E67E3C] text-white py-3 rounded-full font-medium hover:bg-[#d16b2a] transition-colors">
                                            Start Session
                                        </button>
                                        <button className="flex-1 border-2 border-[#E67E3C] text-[#E67E3C] py-3 rounded-full font-medium hover:bg-[#E67E3C] hover:text-white transition-colors">
                                            Reschedule
                                        </button>
                                        <button className="px-6 border-2 border-red-300 text-red-600 py-3 rounded-full font-medium hover:bg-red-50 transition-colors">
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {selectedAppointment.status === 'Completed' && (
                                    <button className="flex-1 bg-[#E67E3C] text-white py-3 rounded-full font-medium hover:bg-[#d16b2a] transition-colors">
                                        View Session Notes
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
