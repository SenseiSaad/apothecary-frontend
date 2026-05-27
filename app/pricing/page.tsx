import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Pricing() {
    const plans = [
        {
            name: 'Starter Clinical Care Pack',
            sessions: '4 sessions',
            price: '$240',
            pricePerSession: '$60/session',
            features: [
                '4 individual counseling sessions',
                'Chat messaging support',
                'Mood tracking tools',
                'Basic wellness resources',
                'Email support',
            ],
            popular: false,
        },
        {
            name: 'Deep Growth Pack',
            sessions: '8 sessions',
            price: '$450',
            pricePerSession: '$56.25/session',
            features: [
                '8 individual counseling sessions',
                'Priority chat messaging',
                'Advanced mood analytics',
                'Personalized wellness plan',
                'Journal & reflection tools',
                'Priority email support',
            ],
            popular: true,
        },
        {
            name: 'Mindfulness Plus',
            sessions: 'Unlimited',
            price: '$15/mo',
            pricePerSession: 'Monthly subscription',
            features: [
                'Unlimited AI guidance',
                'Daily check-ins',
                'Mood tracking & analytics',
                'Wellness tools & exercises',
                'Community support',
                '24/7 chat access',
            ],
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[var(--accent)] to-[var(--secondary)] py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold text-foreground mb-6">
                        Choose Your Wellness Plan
                    </h1>
                    <p className="text-xl text-[#6b4423] max-w-3xl mx-auto">
                        Flexible pricing options designed to fit your needs and budget.
                        Start your journey to better mental health today.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`rounded-3xl p-8 ${plan.popular
                                        ? 'bg-primary text-white shadow-2xl scale-105'
                                        : 'bg-accent text-foreground'
                                    } relative`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-foreground text-white px-6 py-2 rounded-full text-sm font-semibold">
                                            MOST POPULAR
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <p className={`text-sm mb-4 ${plan.popular ? 'text-white/80' : 'text-gray-600'}`}>
                                        {plan.sessions}
                                    </p>
                                    <div className="mb-2">
                                        <span className="text-5xl font-bold">{plan.price}</span>
                                    </div>
                                    <p className={`text-sm ${plan.popular ? 'text-white/80' : 'text-gray-600'}`}>
                                        {plan.pricePerSession}
                                    </p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start">
                                            <svg
                                                className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-primary'
                                                    } mr-3 flex-shrink-0`}
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span className={plan.popular ? 'text-white' : 'text-gray-700'}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/auth/signup"
                                    className={`block w-full py-4 rounded-full text-center font-semibold transition-colors ${plan.popular
                                            ? 'bg-white text-primary hover:bg-gray-100'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                        }`}
                                >
                                    Get Started
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gradient-to-br from-[var(--accent)] to-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-foreground mb-4">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                question: 'Can I switch plans later?',
                                answer: 'Yes! You can upgrade or change your plan at any time. Contact our support team for assistance.',
                            },
                            {
                                question: 'Are the Assistants licensed?',
                                answer: 'Absolutely. All our Assistants are licensed mental health professionals with years of experience.',
                            },
                            {
                                question: 'Is my information secure?',
                                answer: 'Yes. We use bank-level encryption and are HIPAA compliant to ensure your data is completely secure.',
                            },
                            {
                                question: 'What if I need to cancel?',
                                answer: 'You can cancel anytime. For session packages, unused sessions can be refunded within 30 days.',
                            },
                        ].map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="text-xl font-semibold text-foreground mb-3">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-foreground text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Still Have Questions?
                    </h2>
                    <p className="text-xl mb-8 text-gray-300">
                        Our team is here to help you find the perfect plan for your needs.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-primary text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-primary-dark transition-colors"
                    >
                        Contact Us
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
