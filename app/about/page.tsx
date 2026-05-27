import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function About() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[var(--foreground)] via-[#6b4423] to-[var(--foreground)] py-28 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-block mb-6">
                            <span className="bg-primary/20 text-primary px-5 py-2 rounded-full text-sm font-semibold border border-primary/30">
                                🌟 About Apothecary
                            </span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Transforming Mental Healthcare,
                            <span className="text-primary"> One Life at a Time</span>
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                            We're pioneering a new era of accessible, compassionate, and evidence-based mental health support
                            that empowers individuals to thrive in every aspect of their lives.
                        </p>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <p className="text-4xl lg:text-5xl font-bold text-primary mb-2">10K+</p>
                            <p className="text-gray-300 text-sm font-medium">Lives Transformed</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <p className="text-4xl lg:text-5xl font-bold text-primary mb-2">500+</p>
                            <p className="text-gray-300 text-sm font-medium">Expert Assistants</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <p className="text-4xl lg:text-5xl font-bold text-primary mb-2">50K+</p>
                            <p className="text-gray-300 text-sm font-medium">Sessions Completed</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <p className="text-4xl lg:text-5xl font-bold text-primary mb-2">4.9/5</p>
                            <p className="text-gray-300 text-sm font-medium">Client Satisfaction</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-primary font-semibold text-sm uppercase tracking-wide">Our Story</span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 mt-3">
                                Built on Compassion, Driven by Innovation
                            </h2>
                            <div className="space-y-5 text-lg text-gray-700 leading-relaxed">
                                <p>
                                    Apothecary was founded in 2020 with a singular vision: to break down the barriers that prevent
                                    people from accessing quality mental healthcare. We recognized that traditional Clinical Care models
                                    often fall short—limited availability, high costs, geographical constraints, and stigma create
                                    obstacles for those who need support most.
                                </p>
                                <p>
                                    Our founders, a team of licensed psychologists, technologists, and healthcare innovators,
                                    came together to reimagine mental health support for the digital age. We built a platform
                                    that combines cutting-edge technology with the irreplaceable human touch of experienced
                                    mental health professionals.
                                </p>
                                <p>
                                    Today, Apothecary serves over 10,000 active users across the country, providing accessible,
                                    affordable, and effective mental health support that fits seamlessly into modern lifestyles.
                                    Our commitment remains unchanged: to empower every individual with the tools and support
                                    they need to achieve lasting Clinic.
                                </p>
                            </div>
                            <div className="mt-8">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-xl transition-all duration-300 group"
                                >
                                    Get in Touch
                                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--secondary)] rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                                <div className="space-y-8">
                                    <div className="flex items-start space-x-4 group">
                                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                                HIPAA Compliant & Secure
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                Bank-level 256-bit encryption ensures your data and conversations remain completely private and protected.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4 group">
                                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                                Vetted Professionals
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                Every Assistant is licensed, certified, and undergoes rigorous background checks and continuous training.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4 group">
                                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                                Evidence-Based Approach
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                Our clinical methods are grounded in proven clinical research and best practices in mental healthcare.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Element */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10"></div>
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-24 bg-gradient-to-br from-[var(--accent)] via-white to-[var(--secondary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wide">Our Purpose</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 mt-3">
                            Mission & Vision
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                To democratize access to high-quality mental healthcare by leveraging technology to connect
                                individuals with licensed professionals, providing personalized, evidence-based support that
                                empowers people to overcome challenges and achieve lasting wellness.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                A world where mental health support is as accessible and stigma-free as physical healthcare,
                                where every individual has the resources and support they need to thrive emotionally, mentally,
                                and socially—regardless of location, income, or background.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wide">Our Values</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 mt-3">
                            What Drives Us Forward
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our core values guide every decision we make and every interaction we have
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                ),
                                title: 'Compassion',
                                description: 'We approach every client with empathy, understanding, and genuine care for their wellbeing.'
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                ),
                                title: 'Integrity',
                                description: 'We maintain the highest ethical standards and complete transparency in all our practices.'
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                ),
                                title: 'Innovation',
                                description: 'We continuously evolve our platform and services to provide cutting-edge mental health solutions.'
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                ),
                                title: 'Inclusivity',
                                description: 'We create a welcoming space for everyone, regardless of background, identity, or circumstances.'
                            }
                        ].map((value, index) => (
                            <div key={index} className="bg-gradient-to-br from-[var(--accent)] to-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-gradient-to-br from-[var(--accent)] via-white to-[var(--secondary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wide">Our Team</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 mt-3">
                            Meet Our Expert Assistants
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Licensed professionals dedicated to your Clinic journey
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {[
                            {
                                name: 'Dr. Sarah Johnson',
                                role: 'Clinical Psychologist',
                                specialty: 'Anxiety & Depression',
                                experience: '15+ years',
                                credentials: 'PhD, Licensed Clinical Psychologist'
                            },
                            {
                                name: 'Dr. Michael Chen',
                                role: 'Licensed Doctor',
                                specialty: 'Relationship Counseling',
                                experience: '12+ years',
                                credentials: 'LMFT, Certified Couples Doctor'
                            },
                            {
                                name: 'Dr. Emily Rodriguez',
                                role: 'Mental Health Assistant',
                                specialty: 'Stress Management',
                                experience: '10+ years',
                                credentials: 'LMHC, Certified Mindfulness Coach'
                            },
                        ].map((member, index) => (
                            <div key={index} className="bg-white rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100">
                                <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-dark rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-xl group-hover:scale-105 transition-transform duration-300">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">
                                    {member.name}
                                </h3>
                                <p className="text-primary font-semibold mb-3 text-lg">
                                    {member.role}
                                </p>
                                <div className="space-y-2 text-gray-600">
                                    <p className="flex items-center justify-center space-x-2">
                                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                        </svg>
                                        <span className="text-sm">{member.credentials}</span>
                                    </p>
                                    <p className="flex items-center justify-center space-x-2">
                                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">{member.experience} Experience</span>
                                    </p>
                                    <p className="flex items-center justify-center space-x-2">
                                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">{member.specialty}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600 mb-6 text-lg">
                            Join our network of 500+ certified mental health professionals
                        </p>
                        <Link
                            href="/auth/signup"
                            className="inline-flex items-center bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-xl transition-all duration-300 group"
                        >
                            Start Your Journey Today
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Accreditations & Partnerships */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wide">Trust & Recognition</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 mt-3">
                            Accreditations & Partnerships
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Recognized by leading healthcare organizations and mental health associations
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { name: 'HIPAA Certified', icon: '🔒' },
                            { name: 'APA Member', icon: '🏛️' },
                            { name: 'NBCC Approved', icon: '✓' },
                            { name: 'ISO 27001', icon: '🛡️' },
                        ].map((cert, index) => (
                            <div key={index} className="bg-gradient-to-br from-[var(--accent)] to-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 border border-gray-100">
                                <div className="text-5xl mb-4">{cert.icon}</div>
                                <p className="font-semibold text-foreground text-lg">{cert.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-[var(--foreground)] to-[#6b4423] text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                        Ready to Transform Your Mental Health?
                    </h2>
                    <p className="text-xl mb-8 text-gray-300 leading-relaxed">
                        Join thousands who have found their path to wellness with Apothecary.
                        Your journey to better mental health starts here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/signup"
                            className="inline-block bg-gradient-to-r from-primary to-primary-dark text-white px-10 py-4 rounded-full text-lg font-medium hover:shadow-2xl transition-all duration-300 group"
                        >
                            Get Started Free
                            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-block border-2 border-white text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-white hover:text-foreground transition-all duration-300"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
