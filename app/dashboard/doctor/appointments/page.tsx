'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { hasRole } from '@/lib/auth';
import {
    appointmentRequests,
    getPendingRequests,
    getRequestsByStatus,
    getUrgencyColor,
    getStatusColor,
    type AppointmentRequest,
} from '@/data/appointments';
import { appointmentsData } from '@/data/schedule';

export default function AppointmentsManagement() {
    const router = useRouter();
    const [requests, setRequests] = useState<AppointmentRequest[]>(appointmentRequests);
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseAction, setResponseAction] = useState<'approve' | 'decline' | 'reschedule'>('approve');
    const [responseNotes, setResponseNotes] = useState('');
    const [suggestedDate, setSuggestedDate] = useState('');
    const [suggestedTime, setSuggestedTime] = useState('');

    useEffect(() => {
        if (!hasRole('doctor')) {
            router.push('/auth/login');
        }
    }, [router]);

    useEffect(() => {
        setRequests(getRequestsByStatus(statusFilter));
    }, [statusFilter]);

    const pendingCount = getPendingRequests().length;
    const approvedCount = appointmentRequests.filter(r => r.status === 'Approved').length;
    const declinedCount = appointmentRequests.filter(r => r.status === 'Declined').length;

    const handleViewRequest = (request: AppointmentRequest) => {
        setSelectedRequest(request);
        setShowDetailsModal(true);
    };

    const handleRespond = (request: AppointmentRequest, action: 'approve' | 'decline' | 'reschedule') => {
        setSelectedRequest(request);
        setResponseAction(action);
        setShowDetailsModal(false);
        setShowResponseModal(true);
    };

    const handleSubmitResponse = () => {
        if (!selectedRequest) return;

        // In real app, this would call API
        const message = responseAction === 'approve'
            ? 'Appointment approved successfully!'
            : responseAction === 'decline'
                ? 'Appointment declined.'
                : 'Reschedule suggestion sent to patient.';

        alert(message);
        setShowResponseModal(false);
        setResponseNotes('');
        setSuggestedDate('');
        setSuggestedTime('');
    };

    return (
        <DashboardLayout role="doctor">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Appointment Requests</h2>
                        <p className="text-gray-600">Manage patient appointment requests and scheduling</p>
                    </div>
                    <button className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-dark transition-colors">
                        + Create Appointment
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-gray-600 text-sm mb-1">Pending Requests</p>
                        <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-gray-600 text-sm mb-1">Approved</p>
                        <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-gray-600 text-sm mb-1">Declined</p>
                        <p className="text-3xl font-bold text-red-600">{declinedCount}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-gray-600 text-sm mb-1">This Week</p>
                        <p className="text-3xl font-bold text-primary">
                            {appointmentsData.filter(apt => {
                                const aptDate = new Date(apt.date);
                                const weekStart = new Date();
                                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                                const weekEnd = new Date(weekStart);
                                weekEnd.setDate(weekStart.getDate() + 6);
                                return aptDate >= weekStart && aptDate <= weekEnd;
                            }).length}
                        </p>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex gap-2">
                            {['All', 'Pending', 'Approved', 'Declined', 'Rescheduled'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === status
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <select className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                            <option>Sort by: Newest First</option>
                            <option>Sort by: Oldest First</option>
                            <option>Sort by: Urgency</option>
                            <option>Sort by: Date</option>
                        </select>
                    </div>

                    {/* Requests List */}
                    <div className="space-y-4">
                        {requests.map((request) => (
                            <div
                                key={request.id}
                                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                            {request.patientName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground text-lg">{request.patientName}</h3>
                                            <p className="text-sm text-gray-600">{request.patientEmail} • {request.patientPhone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(request.urgency)}`}>
                                            {request.urgency} Priority
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="bg-accent rounded-lg p-4">
                                        <p className="text-xs text-gray-500 mb-1">Requested Date & Time</p>
                                        <p className="font-semibold text-gray-700">{request.requestedDate}</p>
                                        <p className="text-sm text-gray-600">{request.requestedTime} ({request.duration} min)</p>
                                    </div>
                                    <div className="bg-accent rounded-lg p-4">
                                        <p className="text-xs text-gray-500 mb-1">Session Type</p>
                                        <p className="font-semibold text-gray-700">{request.sessionType}</p>
                                        <p className="text-sm text-gray-600">{request.mode}</p>
                                    </div>
                                    <div className="bg-accent rounded-lg p-4">
                                        <p className="text-xs text-gray-500 mb-1">Requested</p>
                                        <p className="text-sm text-gray-700">
                                            {new Date(request.requestedAt).toLocaleDateString()} at{' '}
                                            {new Date(request.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-1">Reason for Appointment</p>
                                    <p className="text-sm text-gray-700">{request.reason}</p>
                                </div>

                                {(request.alternativeDate1 || request.alternativeDate2) && (
                                    <div className="mb-4 bg-blue-50 rounded-lg p-3">
                                        <p className="text-xs text-blue-600 font-medium mb-2">Alternative Times Suggested:</p>
                                        <div className="flex gap-3 text-sm">
                                            {request.alternativeDate1 && (
                                                <span className="text-gray-700">
                                                    {request.alternativeDate1} at {request.alternativeTime1}
                                                </span>
                                            )}
                                            {request.alternativeDate2 && (
                                                <span className="text-gray-700">
                                                    • {request.alternativeDate2} at {request.alternativeTime2}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {request.AssistantNotes && (
                                    <div className="mb-4 bg-yellow-50 rounded-lg p-3">
                                        <p className="text-xs text-yellow-700 font-medium mb-1">Doctor Notes:</p>
                                        <p className="text-sm text-gray-700">{request.AssistantNotes}</p>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => handleViewRequest(request)}
                                        className="flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                    >
                                        View Details
                                    </button>
                                    {request.status === 'Pending' && (
                                        <>
                                            <button
                                                onClick={() => handleRespond(request, 'approve')}
                                                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                                            >
                                                ✓ Approve
                                            </button>
                                            <button
                                                onClick={() => handleRespond(request, 'reschedule')}
                                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                📅 Suggest Time
                                            </button>
                                            <button
                                                onClick={() => handleRespond(request, 'decline')}
                                                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                                            >
                                                ✕ Decline
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {requests.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No appointment requests found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-foreground">Appointment Request Details</h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Patient Info */}
                            <div className="bg-accent rounded-2xl p-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {selectedRequest.patientName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-foreground">{selectedRequest.patientName}</h4>
                                        <p className="text-gray-600">{selectedRequest.patientEmail}</p>
                                        <p className="text-gray-600">{selectedRequest.patientPhone}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(selectedRequest.urgency)}`}>
                                        {selectedRequest.urgency} Priority
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedRequest.status)}`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 mb-1">Requested Date</p>
                                    <p className="font-semibold text-gray-700">{selectedRequest.requestedDate}</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 mb-1">Requested Time</p>
                                    <p className="font-semibold text-gray-700">{selectedRequest.requestedTime}</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                                    <p className="font-semibold text-gray-700">{selectedRequest.duration} minutes</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 mb-1">Mode</p>
                                    <p className="font-semibold text-gray-700">{selectedRequest.mode}</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-4 col-span-2">
                                    <p className="text-xs text-gray-500 mb-1">Session Type</p>
                                    <p className="font-semibold text-gray-700">{selectedRequest.sessionType}</p>
                                </div>
                            </div>

                            {/* Reason */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <p className="text-xs text-gray-500 mb-2">Reason for Appointment</p>
                                <p className="text-sm text-gray-700">{selectedRequest.reason}</p>
                            </div>

                            {/* Alternative Times */}
                            {(selectedRequest.alternativeDate1 || selectedRequest.alternativeDate2) && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-blue-700 mb-2">Alternative Times:</p>
                                    {selectedRequest.alternativeDate1 && (
                                        <p className="text-sm text-gray-700">
                                            Option 1: {selectedRequest.alternativeDate1} at {selectedRequest.alternativeTime1}
                                        </p>
                                    )}
                                    {selectedRequest.alternativeDate2 && (
                                        <p className="text-sm text-gray-700">
                                            Option 2: {selectedRequest.alternativeDate2} at {selectedRequest.alternativeTime2}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            {selectedRequest.status === 'Pending' && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleRespond(selectedRequest, 'approve')}
                                        className="flex-1 bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition-colors"
                                    >
                                        ✓ Approve Request
                                    </button>
                                    <button
                                        onClick={() => handleRespond(selectedRequest, 'reschedule')}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        📅 Suggest Alternative
                                    </button>
                                    <button
                                        onClick={() => handleRespond(selectedRequest, 'decline')}
                                        className="px-6 bg-red-600 text-white py-3 rounded-full font-medium hover:bg-red-700 transition-colors"
                                    >
                                        ✕ Decline
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Response Modal */}
            {showResponseModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8">
                        <h3 className="text-2xl font-bold text-foreground mb-6">
                            {responseAction === 'approve' && 'Approve Appointment'}
                            {responseAction === 'decline' && 'Decline Appointment'}
                            {responseAction === 'reschedule' && 'Suggest Alternative Time'}
                        </h3>

                        <div className="space-y-4">
                            {responseAction === 'reschedule' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Suggested Date</label>
                                        <input
                                            type="date"
                                            value={suggestedDate}
                                            onChange={(e) => setSuggestedDate(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Suggested Time</label>
                                        <input
                                            type="time"
                                            value={suggestedTime}
                                            onChange={(e) => setSuggestedTime(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {responseAction === 'approve' ? 'Confirmation Notes (Optional)' : 'Reason / Notes'}
                                </label>
                                <textarea
                                    value={responseNotes}
                                    onChange={(e) => setResponseNotes(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                                    placeholder={
                                        responseAction === 'approve'
                                            ? 'Add any notes for the patient...'
                                            : responseAction === 'decline'
                                                ? 'Please provide a reason for declining...'
                                                : 'Explain why suggesting alternative time...'
                                    }
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowResponseModal(false)}
                                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitResponse}
                                    className={`flex-1 text-white py-3 rounded-full font-medium transition-colors ${responseAction === 'approve'
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : responseAction === 'decline'
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    {responseAction === 'approve' && 'Confirm Approval'}
                                    {responseAction === 'decline' && 'Confirm Decline'}
                                    {responseAction === 'reschedule' && 'Send Suggestion'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
