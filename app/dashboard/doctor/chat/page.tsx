'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { hasRole } from '@/lib/auth';

interface Message {
    id: number;
    sender: 'assistant' | 'patient';
    text: string;
    time: string;
    file?: {
        name: string;
        type: 'image' | 'document' | 'pdf';
        size: string;
        url: string;
    };
}

interface Patient {
    id: number;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
}

export default function AssistantChat() {
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [selectedPatient, setSelectedPatient] = useState<number>(1);
    const [messageText, setMessageText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showFilePreview, setShowFilePreview] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: 'patient', text: 'Hi Dr. Anderson, I wanted to talk about my anxiety issues.', time: '10:30 AM' },
        { id: 2, sender: 'assistant', text: 'Hello Sarah! I\'m here to help. Can you tell me more about what you\'re experiencing?', time: '10:32 AM' },
        { id: 3, sender: 'patient', text: 'I\'ve been feeling overwhelmed with work and personal life. It\'s affecting my sleep.', time: '10:35 AM' },
        {
            id: 4,
            sender: 'patient',
            text: 'Here is my mood journal from last week',
            time: '10:36 AM',
            file: {
                name: 'mood-journal-may.pdf',
                type: 'pdf',
                size: '245 KB',
                url: '#'
            }
        },
        { id: 5, sender: 'assistant', text: 'I understand. It\'s common to feel overwhelmed when balancing multiple responsibilities. Let\'s explore some strategies to manage this.', time: '10:38 AM' },
        {
            id: 6,
            sender: 'assistant',
            text: 'Here are some relaxation techniques that might help',
            time: '10:39 AM',
            file: {
                name: 'relaxation-exercises.jpg',
                type: 'image',
                size: '1.2 MB',
                url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400'
            }
        },
        { id: 7, sender: 'patient', text: 'That would be really helpful. I\'ve tried some breathing exercises but they don\'t seem to work.', time: '10:40 AM' },
    ]);

    const [patients] = useState<Patient[]>([
        { id: 1, name: 'Sarah Johnson', lastMessage: 'That would be really helpful...', time: '10:40 AM', unread: 2, online: true },
        { id: 2, name: 'Michael Chen', lastMessage: 'Thank you for the session', time: 'Yesterday', unread: 0, online: false },
        { id: 3, name: 'Emily Rodriguez', lastMessage: 'I have a question about...', time: '2 days ago', unread: 1, online: true },
        { id: 4, name: 'David Kim', lastMessage: 'Feeling much better', time: '3 days ago', unread: 0, online: false },
        { id: 5, name: 'Lisa Wang', lastMessage: 'Can we reschedule?', time: '1 week ago', unread: 0, online: false },
    ]);

    useEffect(() => {
        if (!hasRole('doctor')) {
            router.push('/auth/login');
        }
    }, [router]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageText.trim() || selectedFile) {
            const newMessage: Message = {
                id: messages.length + 1,
                sender: 'assistant',
                text: messageText || (selectedFile ? `Sent a file: ${selectedFile.name}` : ''),
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            };

            // Add file info if file is selected
            if (selectedFile) {
                const fileType = selectedFile.type.startsWith('image/') ? 'image' :
                    selectedFile.type === 'application/pdf' ? 'pdf' : 'document';
                newMessage.file = {
                    name: selectedFile.name,
                    type: fileType,
                    size: formatFileSize(selectedFile.size),
                    url: URL.createObjectURL(selectedFile)
                };
            }

            setMessages([...messages, newMessage]);
            setMessageText('');
            setSelectedFile(null);
            setShowFilePreview(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }
            setSelectedFile(file);
            setShowFilePreview(true);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setShowFilePreview(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'image':
                return (
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'pdf':
                return (
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
            case 'document':
                return (
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                );
        }
    };

    const selectedPatientData = patients.find(p => p.id === selectedPatient);

    return (
        <DashboardLayout role="doctor">
            <div className="h-[calc(100vh-180px)] bg-white rounded-2xl shadow-sm overflow-hidden flex">
                {/* Patients List */}
                <div className="w-80 border-r border-gray-200 flex flex-col">
                    {/* Search */}
                    <div className="p-4 border-b border-gray-200">
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E67E3C] focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Patient List */}
                    <div className="flex-1 overflow-y-auto">
                        {patients.map((patient) => (
                            <div
                                key={patient.id}
                                onClick={() => setSelectedPatient(patient.id)}
                                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedPatient === patient.id ? 'bg-[#fef3e8]' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-[#E67E3C] rounded-full flex items-center justify-center text-white font-bold">
                                            {patient.name.charAt(0)}
                                        </div>
                                        {patient.online && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-[#4a3428] truncate">{patient.name}</p>
                                            {patient.unread > 0 && (
                                                <span className="bg-[#E67E3C] text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    {patient.unread}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{patient.lastMessage}</p>
                                        <p className="text-xs text-gray-400 mt-1">{patient.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-[#E67E3C] rounded-full flex items-center justify-center text-white font-bold">
                                        {selectedPatientData?.name.charAt(0)}
                                    </div>
                                    {selectedPatientData?.online && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-[#4a3428]">{selectedPatientData?.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {selectedPatientData?.online ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 hover:bg-[#fef3e8] rounded-lg transition-all duration-200 group" title="Video Call">
                                    <svg className="w-5 h-5 text-gray-600 group-hover:text-[#E67E3C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                <button className="p-2 hover:bg-[#fef3e8] rounded-lg transition-all duration-200 group" title="Voice Call">
                                    <svg className="w-5 h-5 text-gray-600 group-hover:text-[#E67E3C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </button>
                                <button className="p-2 hover:bg-[#fef3e8] rounded-lg transition-all duration-200 group" title="More Options">
                                    <svg className="w-5 h-5 text-gray-600 group-hover:text-[#E67E3C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white to-[#fef3e8]/20">
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'assistant' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-md ${message.sender === 'assistant' ? 'order-2' : 'order-1'}`}>
                                        <div
                                            className={`rounded-2xl px-4 py-3 ${message.sender === 'assistant'
                                                ? 'bg-[#E67E3C] text-white rounded-br-none'
                                                : 'bg-[#f5e6d3] text-[#4a3428] rounded-bl-none'
                                                }`}
                                        >
                                            {message.text && <p className="text-sm mb-2">{message.text}</p>}

                                            {/* File Attachment */}
                                            {message.file && (
                                                <div className="mt-2">
                                                    {message.file.type === 'image' ? (
                                                        <div className="rounded-lg overflow-hidden">
                                                            <img
                                                                src={message.file.url}
                                                                alt={message.file.name}
                                                                className="max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                                                                onClick={() => window.open(message.file?.url, '_blank')}
                                                            />
                                                            <div className={`text-xs mt-2 ${message.sender === 'assistant' ? 'text-white/80' : 'text-gray-600'}`}>
                                                                {message.file.name} • {message.file.size}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={`flex items-center space-x-3 p-3 rounded-lg ${message.sender === 'assistant' ? 'bg-white/20' : 'bg-white'
                                                            }`}>
                                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                                {getFileIcon(message.file.type)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-sm font-medium truncate ${message.sender === 'assistant' ? 'text-white' : 'text-[#4a3428]'
                                                                    }`}>
                                                                    {message.file.name}
                                                                </p>
                                                                <p className={`text-xs ${message.sender === 'assistant' ? 'text-white/70' : 'text-gray-500'
                                                                    }`}>
                                                                    {message.file.size}
                                                                </p>
                                                            </div>
                                                            <a
                                                                href={message.file.url}
                                                                download={message.file.name}
                                                                className={`p-2 rounded-lg hover:bg-white/20 transition-all duration-200 group ${message.sender === 'assistant' ? 'text-white' : 'text-[#E67E3C]'
                                                                    }`}
                                                                title="Download"
                                                            >
                                                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <p className={`text-xs text-gray-500 mt-1 ${message.sender === 'assistant' ? 'text-right' : 'text-left'}`}>
                                            {message.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        {/* File Preview */}
                        {showFilePreview && selectedFile && (
                            <div className="mb-3 p-3 bg-[#fef3e8] rounded-lg flex items-center justify-between border border-[#E67E3C]/20">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        {getFileIcon(selectedFile.type.startsWith('image/') ? 'image' : selectedFile.type === 'application/pdf' ? 'pdf' : 'document')}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#4a3428]">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-600">{formatFileSize(selectedFile.size)}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="p-1.5 hover:bg-red-100 rounded-lg transition-all duration-200 group"
                                    title="Remove file"
                                >
                                    <svg className="w-5 h-5 text-red-500 group-hover:text-red-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileSelect}
                                accept="image/*,.pdf,.doc,.docx,.txt"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2.5 hover:bg-[#fef3e8] rounded-lg transition-all duration-200 group"
                                title="Attach File (Max 10MB)"
                            >
                                <svg className="w-5 h-5 text-gray-600 group-hover:text-[#E67E3C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                            </button>
                            <input
                                type="text"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#E67E3C] focus:border-transparent outline-none"
                            />
                            <button
                                type="button"
                                className="p-2.5 hover:bg-[#fef3e8] rounded-lg transition-all duration-200 group"
                                title="Voice Message"
                            >
                                <svg className="w-5 h-5 text-gray-600 group-hover:text-[#E67E3C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </button>
                            <button
                                type="submit"
                                disabled={!messageText.trim() && !selectedFile}
                                className="bg-gradient-to-r from-[#E67E3C] to-[#d16b2a] text-white p-3 rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                                title="Send"
                            >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
