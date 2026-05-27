'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission (static for now)
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[var(--accent)] to-[var(--secondary)] py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold text-foreground mb-6">
                        Get In Touch
                    </h1>
                    <p className="text-xl text-[#6b4423] max-w-3xl mx-auto">
                        Have questions? We're here to help. Reach out to our team and
                        we'll get back to you as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-6">
                                Send Us a Message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="billing">Billing Question</option>
                                        <option value="Assistant">Become an Assistant</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary text-white py-4 rounded-full font-semibold hover:bg-primary-dark transition-colors"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-6">
                                Contact Information
                            </h2>

                            <div className="space-y-6 mb-12">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
                                        📧
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-1">
                                            Email
                                        </h3>
                                        <p className="text-gray-600">support@Apothecaryplus.com</p>
                                        <p className="text-gray-600">info@Apothecaryplus.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
                                        📞
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-1">
                                            Phone
                                        </h3>
                                        <p className="text-gray-600">+1 (555) 123-4567</p>
                                        <p className="text-sm text-gray-500">Mon-Fri, 9am-6pm EST</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
                                        📍
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-1">
                                            Office
                                        </h3>
                                        <p className="text-gray-600">123 Wellness Street</p>
                                        <p className="text-gray-600">New York, NY 10001</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-accent rounded-2xl p-8">
                                <h3 className="text-xl font-semibold text-foreground mb-4">
                                    Office Hours
                                </h3>
                                <div className="space-y-2 text-gray-700">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span className="font-medium">9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span className="font-medium">10:00 AM - 4:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span className="font-medium">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Emergency Notice */}
            <section className="py-12 bg-red-50 border-t-4 border-red-500">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-bold text-red-900 mb-4">
                        🚨 In Case of Emergency
                    </h3>
                    <p className="text-red-800 mb-4">
                        If you are experiencing a mental health emergency, please call 911 or
                        the National Suicide Prevention Lifeline at 988 immediately.
                    </p>
                    <p className="text-red-700">
                        Apothecary is not a crisis service and should not be used for emergency situations.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
