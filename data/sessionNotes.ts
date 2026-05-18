// Mock data for session notes
export interface SessionNote {
    id: number;
    sessionId: number;
    patientId: number;
    patientName: string;
    assistantId: number;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    sessionType: 'Initial Consultation' | 'Follow-up' | 'Consultation' | 'Check-in' | 'Emergency';
    mood: 'Excellent' | 'Good' | 'Neutral' | 'Poor' | 'Critical';
    presentingIssues: string[];
    subjectiveReport: string;
    objectiveObservations: string;
    assessment: string;
    plan: string;
    interventionsUsed: string[];
    homework: string;
    progressRating: number; // 1-10
    riskAssessment: {
        suicidalIdeation: boolean;
        selfHarm: boolean;
        homicidalIdeation: boolean;
        substanceAbuse: boolean;
        notes: string;
    };
    nextSessionGoals: string[];
    privateNotes: string;
    attachments: string[];
    createdAt: string;
    updatedAt: string;
}

export interface NoteTemplate {
    id: number;
    name: string;
    description: string;
    sections: {
        name: string;
        placeholder: string;
    }[];
}

// Sample session notes
export const sessionNotesData: SessionNote[] = [
    {
        id: 1,
        sessionId: 9,
        patientId: 1,
        patientName: 'Sarah Johnson',
        assistantId: 1,
        date: '2026-05-07',
        startTime: '09:00',
        endTime: '10:00',
        duration: 60,
        sessionType: 'Consultation',
        mood: 'Good',
        presentingIssues: ['Work-related anxiety', 'Sleep disturbances', 'Difficulty concentrating'],
        subjectiveReport: 'Patient reports feeling more in control of anxiety symptoms this week. Used breathing techniques successfully during a stressful work presentation. Sleep has improved slightly - averaging 6 hours per night (up from 4-5 hours). Still experiencing some difficulty falling asleep but less frequent night waking.',
        objectiveObservations: 'Patient appeared calm and engaged throughout session. Made good eye contact. Speech was clear and coherent. Affect was brighter compared to previous sessions. Demonstrated understanding of CBT concepts when discussing thought patterns.',
        assessment: 'Patient is making good progress in managing anxiety symptoms. Shows increased awareness of triggers and improved use of coping strategies. Sleep improvement is encouraging but still below optimal levels. Continue current treatment approach with focus on sleep hygiene and cognitive restructuring.',
        plan: 'Continue weekly CBT sessions. Introduce progressive muscle relaxation for sleep improvement. Review and refine thought records. Schedule follow-up in one week.',
        interventionsUsed: [
            'Cognitive Behavioral Clinical Care (CBT)',
            'Breathing exercises',
            'Thought challenging',
            'Psychoeducation on anxiety',
        ],
        homework: '1. Practice progressive muscle relaxation before bed (provided audio guide)\n2. Complete thought records for anxiety-provoking situations\n3. Maintain sleep diary\n4. Practice deep breathing 2x daily',
        progressRating: 7,
        riskAssessment: {
            suicidalIdeation: false,
            selfHarm: false,
            homicidalIdeation: false,
            substanceAbuse: false,
            notes: 'No current safety concerns. Patient has good support system and coping strategies in place.',
        },
        nextSessionGoals: [
            'Review homework completion',
            'Assess sleep improvement',
            'Introduce cognitive restructuring techniques',
            'Discuss workplace boundary setting',
        ],
        privateNotes: 'Patient mentioned potential job change - explore this further next session as it may be contributing to anxiety. Consider discussing career counseling resources.',
        attachments: ['thought-record-template.pdf', 'sleep-diary.pdf'],
        createdAt: '2026-05-07T10:15:00',
        updatedAt: '2026-05-07T10:15:00',
    },
    {
        id: 2,
        sessionId: 10,
        patientId: 4,
        patientName: 'David Kim',
        assistantId: 1,
        date: '2026-05-07',
        startTime: '15:00',
        endTime: '16:00',
        duration: 60,
        sessionType: 'Initial Consultation',
        mood: 'Neutral',
        presentingIssues: ['Work stress', 'Burnout symptoms', 'Time management difficulties'],
        subjectiveReport: 'Patient is a 31-year-old male presenting with work-related stress and burnout. Reports feeling overwhelmed by workload, difficulty disconnecting from work, and decreased motivation. Symptoms have been present for approximately 6 months and worsening over past 2 months. Sleep is affected (difficulty falling asleep due to racing thoughts about work). Appetite has decreased. Reports feeling irritable and withdrawn from social activities.',
        objectiveObservations: 'Patient appeared tired with visible signs of stress (tense posture, frequent sighing). Maintained adequate eye contact. Speech was coherent but somewhat rushed when discussing work stressors. Affect was constricted. Demonstrated insight into current difficulties.',
        assessment: 'Initial assessment indicates significant work-related stress with symptoms consistent with burnout. Patient shows good insight and motivation for treatment. No immediate safety concerns. Recommend weekly Clinical Care focusing on stress management, work-life balance, and cognitive-behavioral interventions.',
        plan: 'Begin weekly Consultations. Focus on stress management techniques, boundary setting, and cognitive restructuring. Provide psychoeducation on burnout. Schedule next session in one week.',
        interventionsUsed: [
            'Clinical interview',
            'Mental status examination',
            'Psychoeducation on burnout',
            'Initial stress management strategies',
        ],
        homework: '1. Begin daily stress journal (provided template)\n2. Identify 3 current stressors and rate intensity\n3. Practice 5-minute breathing exercise daily\n4. List current coping strategies (healthy and unhealthy)',
        progressRating: 5,
        riskAssessment: {
            suicidalIdeation: false,
            selfHarm: false,
            homicidalIdeation: false,
            substanceAbuse: false,
            notes: 'No current safety concerns identified. Patient has supportive family. Denies substance use.',
        },
        nextSessionGoals: [
            'Review stress journal',
            'Identify specific work stressors',
            'Begin developing stress management plan',
            'Assess sleep patterns in detail',
        ],
        privateNotes: 'Patient works in tech industry with long hours. May benefit from discussing career options or workplace accommodations. Monitor for depression symptoms.',
        attachments: ['intake-form.pdf', 'stress-journal-template.pdf'],
        createdAt: '2026-05-07T16:20:00',
        updatedAt: '2026-05-07T16:20:00',
    },
    {
        id: 3,
        sessionId: 11,
        patientId: 6,
        patientName: 'Amanda Foster',
        assistantId: 1,
        date: '2026-05-06',
        startTime: '10:00',
        endTime: '11:00',
        duration: 60,
        sessionType: 'Consultation',
        mood: 'Good',
        presentingIssues: ['PTSD symptoms', 'Trauma processing', 'Anxiety'],
        subjectiveReport: 'Patient reports continued improvement in PTSD symptoms. Nightmares have decreased in frequency (now 1-2x per week vs. daily). Flashbacks are less intense and shorter in duration. Patient feels more in control when triggered. Successfully used grounding techniques twice this week during anxiety episodes.',
        objectiveObservations: 'Patient appeared more relaxed than previous sessions. Able to discuss traumatic material with less visible distress. Demonstrated effective use of grounding techniques during session when discussing difficult memories. Affect was appropriate and mood appeared stable.',
        assessment: 'Patient continues to make excellent progress with EMDR Clinical Care. Trauma processing is proceeding well with decreased symptom intensity. Patient is developing strong coping skills and showing increased resilience. Continue current treatment approach.',
        plan: 'Continue EMDR Clinical Care targeting remaining traumatic memories. Reinforce coping strategies. Begin discussing post-traumatic growth and future goals. Schedule next session in one week.',
        interventionsUsed: [
            'EMDR (Eye Movement Desensitization and Reprocessing)',
            'Grounding techniques',
            'Cognitive processing',
            'Resource development',
        ],
        homework: '1. Continue daily grounding practice\n2. Journal about positive changes noticed\n3. Practice self-compassion exercises\n4. Use EMDR app for additional processing (as needed)',
        progressRating: 8,
        riskAssessment: {
            suicidalIdeation: false,
            selfHarm: false,
            homicidalIdeation: false,
            substanceAbuse: false,
            notes: 'No safety concerns. Patient has strong support system and effective coping strategies.',
        },
        nextSessionGoals: [
            'Continue EMDR processing',
            'Review homework and progress',
            'Discuss post-traumatic growth',
            'Begin transition planning for maintenance phase',
        ],
        privateNotes: 'Patient is doing remarkably well. Consider discussing reducing session frequency to bi-weekly in 2-3 sessions if progress continues.',
        attachments: ['emdr-protocol-notes.pdf'],
        createdAt: '2026-05-06T11:10:00',
        updatedAt: '2026-05-06T11:10:00',
    },
];

// Note templates
export const noteTemplates: NoteTemplate[] = [
    {
        id: 1,
        name: 'SOAP Note',
        description: 'Subjective, Objective, Assessment, Plan format',
        sections: [
            { name: 'Subjective', placeholder: 'Patient\'s reported symptoms, concerns, and experiences...' },
            { name: 'Objective', placeholder: 'Observable behaviors, mental status, appearance...' },
            { name: 'Assessment', placeholder: 'Clinical impression, diagnosis, progress evaluation...' },
            { name: 'Plan', placeholder: 'Treatment plan, interventions, next steps...' },
        ],
    },
    {
        id: 2,
        name: 'Progress Note',
        description: 'Standard progress note format',
        sections: [
            { name: 'Session Summary', placeholder: 'Brief overview of session content...' },
            { name: 'Progress', placeholder: 'Patient progress toward goals...' },
            { name: 'Interventions', placeholder: 'Techniques and interventions used...' },
            { name: 'Homework', placeholder: 'Assignments for next session...' },
            { name: 'Next Steps', placeholder: 'Plan for upcoming sessions...' },
        ],
    },
    {
        id: 3,
        name: 'Initial Assessment',
        description: 'Comprehensive initial evaluation',
        sections: [
            { name: 'Presenting Problem', placeholder: 'Chief complaint and reason for seeking Clinical Care...' },
            { name: 'History', placeholder: 'Relevant background and history...' },
            { name: 'Mental Status', placeholder: 'Mental status examination findings...' },
            { name: 'Assessment', placeholder: 'Clinical formulation and diagnosis...' },
            { name: 'Treatment Plan', placeholder: 'Proposed treatment approach and goals...' },
        ],
    },
    {
        id: 4,
        name: 'Crisis Note',
        description: 'Emergency or crisis intervention documentation',
        sections: [
            { name: 'Crisis Description', placeholder: 'Nature and severity of crisis...' },
            { name: 'Risk Assessment', placeholder: 'Safety evaluation and risk factors...' },
            { name: 'Interventions', placeholder: 'Crisis interventions provided...' },
            { name: 'Safety Plan', placeholder: 'Safety planning and follow-up...' },
            { name: 'Disposition', placeholder: 'Outcome and next steps...' },
        ],
    },
];

// Helper functions
export const getNotesByPatient = (patientId: number): SessionNote[] => {
    return sessionNotesData.filter(note => note.patientId === patientId);
};

export const getNoteById = (noteId: number): SessionNote | undefined => {
    return sessionNotesData.find(note => note.id === noteId);
};

export const getRecentNotes = (limit: number = 5): SessionNote[] => {
    return sessionNotesData
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
};

export const getMoodColor = (mood: string): string => {
    switch (mood) {
        case 'Excellent':
            return 'bg-green-100 text-green-700';
        case 'Good':
            return 'bg-blue-100 text-blue-700';
        case 'Neutral':
            return 'bg-yellow-100 text-yellow-700';
        case 'Poor':
            return 'bg-orange-100 text-orange-700';
        case 'Critical':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};
