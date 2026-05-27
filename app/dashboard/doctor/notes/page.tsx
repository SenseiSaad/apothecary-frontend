'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { hasRole } from '@/lib/auth';
import {
    sessionNotesData,
    noteTemplates,
    getMoodColor,
    type SessionNote,
    type NoteTemplate,
} from '@/data/sessionNotes';
import { Button, Badge, Avatar, Modal, Input, Select, StatCard, Checkbox } from '@/components/ui';

export default function SessionNotes() {
    const router = useRouter();
    const [notes, setNotes] = useState<SessionNote[]>(sessionNotesData);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNote, setSelectedNote] = useState<SessionNote | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<NoteTemplate | null>(null);

    useEffect(() => {
        if (!hasRole('doctor')) {
            router.push('/auth/login');
        }
    }, [router]);

    // Filter notes based on search
    useEffect(() => {
        if (searchQuery) {
            const filtered = sessionNotesData.filter(note =>
                note.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.presentingIssues.some(issue => issue.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setNotes(filtered);
        } else {
            setNotes(sessionNotesData);
        }
    }, [searchQuery]);

    const handleViewNote = (note: SessionNote) => {
        setSelectedNote(note);
        setShowDetailsModal(true);
    };

    const handleCreateNote = () => {
        setShowCreateModal(true);
    };

    const handleSelectTemplate = (template: NoteTemplate) => {
        setSelectedTemplate(template);
        setShowCreateModal(false);
        // In real app, this would open the note editor with template
        alert(`Creating note with template: ${template.name}`);
    };

    return (
        <DashboardLayout role="doctor">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Session Notes</h2>
                        <p className="text-gray-600">Manage clinical documentation and session records</p>
                    </div>
                    <Button onClick={handleCreateNote} className="rounded-full">
                        + New Note
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Total Notes"
                        value={sessionNotesData.length.toString()}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        }
                        color="from-primary to-primary-dark"
                        bgColor="bg-orange-50"
                        showProgress
                        progressValue={75}
                    />
                    <StatCard
                        label="This Week"
                        value={sessionNotesData.filter(note => {
                            const noteDate = new Date(note.date);
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return noteDate >= weekAgo;
                        }).length.toString()}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        }
                        color="from-blue-500 to-blue-600"
                        bgColor="bg-blue-50"
                        showProgress
                        progressValue={60}
                    />
                    <StatCard
                        label="Avg Progress"
                        value={`${Math.round(sessionNotesData.reduce((sum, note) => sum + note.progressRating, 0) / sessionNotesData.length)}/10`}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        }
                        color="from-green-500 to-green-600"
                        bgColor="bg-green-50"
                        showProgress
                        progressValue={Math.round(sessionNotesData.reduce((sum, note) => sum + note.progressRating, 0) / sessionNotesData.length * 10)}
                    />
                    <StatCard
                        label="Templates"
                        value={noteTemplates.length.toString()}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                        }
                        color="from-purple-500 to-purple-600"
                        bgColor="bg-purple-50"
                        showProgress
                        progressValue={85}
                    />
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                        <Input
                            type="text"
                            placeholder="🔍 Search by patient name or issue..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-96"
                        />
                        <div className="flex flex-wrap gap-2">
                            <Select
                                options={[
                                    { value: 'all', label: 'All Types' },
                                    { value: 'initial', label: 'Initial Consultation' },
                                    { value: 'Clinical Care', label: 'Consultation' },
                                    { value: 'followup', label: 'Follow-up' },
                                    { value: 'checkin', label: 'Check-in' },
                                ]}
                                className="min-w-[150px]"
                            />
                            <Button variant="outline">
                                📥 Export All
                            </Button>
                        </div>
                    </div>

                    {/* Notes List */}
                    <div className="space-y-4">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                onClick={() => handleViewNote(note)}
                                className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center space-x-4">
                                        <Avatar name={note.patientName} size="lg" />
                                        <div>
                                            <h3 className="font-bold text-foreground text-lg">{note.patientName}</h3>
                                            <p className="text-sm text-gray-600">
                                                📅 {note.date} • 🕐 {note.startTime} - {note.endTime} ({note.duration} min)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMoodColor(note.mood)}`}>
                                            {note.mood}
                                        </span>
                                        <Badge variant="default" className="bg-accent text-primary border-primary/20">
                                            {note.sessionType}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-2">Presenting Issues:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {note.presentingIssues.map((issue, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                            >
                                                {issue}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Subjective Report</p>
                                        <p className="text-sm text-gray-700 line-clamp-2">{note.subjectiveReport}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Assessment</p>
                                        <p className="text-sm text-gray-700 line-clamp-2">{note.assessment}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                        <span className="font-medium">📊 Progress: {note.progressRating}/10</span>
                                        <span>•</span>
                                        <span>💡 {note.interventionsUsed.length} interventions</span>
                                        {note.attachments.length > 0 && (
                                            <>
                                                <span>•</span>
                                                <span>📎 {note.attachments.length} files</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                alert('Edit note');
                                            }}
                                        >
                                            ✏️ Edit
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                alert('Export note');
                                            }}
                                        >
                                            📥 Export
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {notes.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg font-medium">No notes found</p>
                            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Note Details Modal */}
            <Modal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                title="Session Note Details"
                size="xl"
            >
                {selectedNote && (
                    <div className="p-6 space-y-6">
                        {/* Patient & Session Info */}
                        <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--secondary)] rounded-2xl p-6 border border-primary/20">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center space-x-4">
                                    <Avatar name={selectedNote.patientName} size="xl" />
                                    <div>
                                        <h4 className="text-xl font-bold text-foreground">{selectedNote.patientName}</h4>
                                        <p className="text-gray-600">
                                            📅 {selectedNote.date} • 🕐 {selectedNote.startTime} - {selectedNote.endTime}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getMoodColor(selectedNote.mood)}`}>
                                        😊 Mood: {selectedNote.mood}
                                    </span>
                                    <p className="text-sm text-gray-600 mt-2">📊 Progress: {selectedNote.progressRating}/10</p>
                                </div>
                            </div>
                        </div>

                        {/* Presenting Issues */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                            <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <span>🎯</span> Presenting Issues
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {selectedNote.presentingIssues.map((issue, index) => (
                                    <Badge key={index} variant="default" className="bg-primary text-white">
                                        {issue}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* SOAP Format */}
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
                                <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <span>💬</span> Subjective Report
                                </h5>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedNote.subjectiveReport}</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6">
                                <h5 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                    <span>👁️</span> Objective Observations
                                </h5>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedNote.objectiveObservations}</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6">
                                <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                    <span>📋</span> Assessment
                                </h5>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedNote.assessment}</p>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6">
                                <h5 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                                    <span>📝</span> Plan
                                </h5>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedNote.plan}</p>
                            </div>
                        </div>

                        {/* Interventions */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                            <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <span>💡</span> Interventions Used
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {selectedNote.interventionsUsed.map((intervention, index) => (
                                    <Badge key={index} variant="default" className="bg-accent text-brown border-primary/20">
                                        {intervention}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Homework */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                            <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <span>📚</span> Homework Assigned
                            </h5>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedNote.homework}</p>
                        </div>

                        {/* Risk Assessment */}
                        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6">
                            <h5 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                                <span>⚠️</span> Risk Assessment
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <Checkbox
                                    id="suicidal"
                                    label="Suicidal Ideation"
                                    checked={selectedNote.riskAssessment.suicidalIdeation}
                                    disabled
                                />
                                <Checkbox
                                    id="selfharm"
                                    label="Self-Harm"
                                    checked={selectedNote.riskAssessment.selfHarm}
                                    disabled
                                />
                                <Checkbox
                                    id="homicidal"
                                    label="Homicidal Ideation"
                                    checked={selectedNote.riskAssessment.homicidalIdeation}
                                    disabled
                                />
                                <Checkbox
                                    id="substance"
                                    label="Substance Abuse"
                                    checked={selectedNote.riskAssessment.substanceAbuse}
                                    disabled
                                />
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{selectedNote.riskAssessment.notes}</p>
                        </div>

                        {/* Next Session Goals */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                            <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <span>🎯</span> Next Session Goals
                            </h5>
                            <ul className="space-y-2">
                                {selectedNote.nextSessionGoals.map((goal, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-primary font-bold">•</span>
                                        <span>{goal}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Private Notes */}
                        {selectedNote.privateNotes && (
                            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-2xl p-6">
                                <h5 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                                    <span>🔒</span> Private Notes (Doctor Only)
                                </h5>
                                <p className="text-sm text-gray-700 leading-relaxed">{selectedNote.privateNotes}</p>
                            </div>
                        )}

                        {/* Attachments */}
                        {selectedNote.attachments.length > 0 && (
                            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                                <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <span>📎</span> Attachments
                                </h5>
                                <div className="space-y-2">
                                    {selectedNote.attachments.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <span className="text-sm text-gray-700">📄 {file}</span>
                                            <Button variant="outline" size="sm">
                                                📥 Download
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-gray-200">
                            <Button className="flex-1 min-w-[150px] rounded-full">
                                ✏️ Edit Note
                            </Button>
                            <Button variant="outline" className="flex-1 min-w-[150px] rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white">
                                📥 Export PDF
                            </Button>
                            <Button variant="secondary" className="rounded-full">
                                🖨️ Print
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Create Note Modal - Template Selection */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Select Note Template"
                size="lg"
            >
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {noteTemplates.map((template) => (
                            <div
                                key={template.id}
                                onClick={() => handleSelectTemplate(template)}
                                className="border-2 border-gray-200 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer group"
                            >
                                <h4 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                                    {template.name}
                                </h4>
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{template.description}</p>
                                <div className="space-y-1">
                                    {template.sections.map((section, index) => (
                                        <p key={index} className="text-xs text-gray-500 flex items-center gap-2">
                                            <span className="text-primary">✓</span> {section.name}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center pt-4 border-t-2 border-gray-200">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowCreateModal(false);
                                alert('Creating blank note');
                            }}
                            className="rounded-full"
                        >
                            📝 Or start with a blank note →
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
