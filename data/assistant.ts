// Mock data for Assistant profile
export interface AssistantProfile {
    id: number;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female' | 'Other';
    profileImage: string;
    specialty: string[];
    bio: string;
    qualifications: Qualification[];
    experience: number; // years
    languages: string[];
    consultationRate: number;
    sessionDuration: number; // minutes
    licenseNumber: string;
    licenseState: string;
    licenseExpiry: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    availability: {
        monday: { available: boolean; startTime: string; endTime: string };
        tuesday: { available: boolean; startTime: string; endTime: string };
        wednesday: { available: boolean; startTime: string; endTime: string };
        thursday: { available: boolean; startTime: string; endTime: string };
        friday: { available: boolean; startTime: string; endTime: string };
        saturday: { available: boolean; startTime: string; endTime: string };
        sunday: { available: boolean; startTime: string; endTime: string };
    };
    statistics: {
        totalPatients: number;
        totalSessions: number;
        rating: number;
        reviewCount: number;
        completionRate: number;
        responseTime: string; // average response time
    };
    bankDetails: {
        accountHolderName: string;
        accountNumber: string;
        bankName: string;
        routingNumber: string;
    };
    emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
    };
    preferences: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        appointmentReminders: boolean;
        marketingEmails: boolean;
    };
}

export interface Qualification {
    degree: string;
    institution: string;
    year: number;
    field: string;
}

export interface Certification {
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expiryDate: string;
    credentialId: string;
}

// Sample Assistant profile
export const AssistantProfile: AssistantProfile = {
    id: 1,
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@Apothecary.com',
    phone: '+1 (555) 987-6543',
    dateOfBirth: '1985-03-15',
    gender: 'Female',
    profileImage: '',
    specialty: [
        'Anxiety & Depression',
        'Cognitive Behavioral Clinical Care (CBT)',
        'Mindfulness-Based Clinical Care',
        'Stress Management',
    ],
    bio: 'Dr. Lisa Anderson is a licensed clinical psychologist with over 12 years of experience in mental health counseling. She specializes in anxiety, depression, and stress management using evidence-based approaches including CBT and mindfulness techniques. Dr. Anderson is passionate about helping individuals develop coping strategies and achieve their Clinic goals.',
    qualifications: [
        {
            degree: 'Ph.D. in Clinical Psychology',
            institution: 'Stanford University',
            year: 2014,
            field: 'Clinical Psychology',
        },
        {
            degree: 'M.A. in Psychology',
            institution: 'University of California, Berkeley',
            year: 2010,
            field: 'Psychology',
        },
        {
            degree: 'B.S. in Psychology',
            institution: 'UCLA',
            year: 2008,
            field: 'Psychology',
        },
    ],
    experience: 12,
    languages: ['English', 'Spanish', 'French'],
    consultationRate: 150,
    sessionDuration: 60,
    licenseNumber: 'PSY-12345-CA',
    licenseState: 'California',
    licenseExpiry: '2027-12-31',
    address: {
        street: '123 Wellness Avenue, Suite 200',
        city: 'San Francisco',
        state: 'California',
        zipCode: '94102',
        country: 'United States',
    },
    availability: {
        monday: { available: true, startTime: '09:00', endTime: '17:00' },
        tuesday: { available: true, startTime: '09:00', endTime: '17:00' },
        wednesday: { available: true, startTime: '09:00', endTime: '17:00' },
        thursday: { available: true, startTime: '09:00', endTime: '17:00' },
        friday: { available: true, startTime: '09:00', endTime: '15:00' },
        saturday: { available: false, startTime: '00:00', endTime: '00:00' },
        sunday: { available: false, startTime: '00:00', endTime: '00:00' },
    },
    statistics: {
        totalPatients: 28,
        totalSessions: 142,
        rating: 4.9,
        reviewCount: 24,
        completionRate: 96,
        responseTime: '< 2 hours',
    },
    bankDetails: {
        accountHolderName: 'Lisa Anderson',
        accountNumber: '****1234',
        bankName: 'Chase Bank',
        routingNumber: '****5678',
    },
    emergencyContact: {
        name: 'Michael Anderson',
        relationship: 'Spouse',
        phone: '+1 (555) 987-6544',
    },
    preferences: {
        emailNotifications: true,
        smsNotifications: true,
        appointmentReminders: true,
        marketingEmails: false,
    },
};

// Sample certifications
export const certifications: Certification[] = [
    {
        name: 'Certified Cognitive Behavioral Doctor',
        issuingOrganization: 'Academy of Cognitive Clinical Care',
        issueDate: '2015-06-15',
        expiryDate: '2025-06-15',
        credentialId: 'ACT-2015-1234',
    },
    {
        name: 'Mindfulness-Based Stress Reduction (MBSR)',
        issuingOrganization: 'Center for Mindfulness',
        issueDate: '2016-09-20',
        expiryDate: 'No Expiry',
        credentialId: 'MBSR-2016-5678',
    },
    {
        name: 'EMDR Clinical Care Certification',
        issuingOrganization: 'EMDR International Association',
        issueDate: '2018-03-10',
        expiryDate: '2028-03-10',
        credentialId: 'EMDRIA-2018-9012',
    },
];

// Helper functions
export const updateAssistantProfile = (updates: Partial<AssistantProfile>): AssistantProfile => {
    return { ...AssistantProfile, ...updates };
};

export const getSpecialtyList = (): string[] => {
    return [
        'Anxiety & Depression',
        'Cognitive Behavioral Clinical Care (CBT)',
        'Dialectical Behavior Clinical Care (DBT)',
        'EMDR Clinical Care',
        'Family Clinical Care',
        'Grief Counseling',
        'Mindfulness-Based Clinical Care',
        'Relationship Counseling',
        'Stress Management',
        'Trauma & PTSD',
        'Addiction Counseling',
        'Child & Adolescent Clinical Care',
    ];
};

export const getLanguageList = (): string[] => {
    return [
        'English',
        'Spanish',
        'French',
        'German',
        'Mandarin',
        'Hindi',
        'Arabic',
        'Portuguese',
        'Russian',
        'Japanese',
    ];
};
