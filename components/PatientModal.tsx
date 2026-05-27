import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Input, Select, Textarea, Button } from './ui';

interface PatientFormData {
    name: string;
    email: string;
    phone: string;
    age: string;
    gender: string;
    concerns: string;
    medicalHistory: string;
}

interface PatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (patient: PatientFormData) => void;
    patient?: any | null;
    mode: 'add' | 'edit';
}

const initialFormData: PatientFormData = {
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    concerns: '',
    medicalHistory: '',
};

export const PatientModal: React.FC<PatientModalProps> = ({
    isOpen,
    onClose,
    onSave,
    patient,
    mode,
}) => {
    const [formData, setFormData] = useState<PatientFormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<keyof PatientFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load patient data when editing
    useEffect(() => {
        if (mode === 'edit' && patient) {
            setFormData({
                name: patient.name || '',
                email: patient.email || '',
                phone: patient.phone || '',
                age: patient.age || '',
                gender: patient.gender || 'Male',
                concerns: patient.concerns || '',
                medicalHistory: patient.medicalHistory || '',
            });
        } else {
            setFormData(initialFormData);
        }
        setErrors({});
    }, [mode, patient, isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof PatientFormData]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof PatientFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (!formData.age.trim()) {
            newErrors.age = 'Age is required';
        } else if (isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120) {
            newErrors.age = 'Please enter a valid age';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            onSave(formData);
            setIsSubmitting(false);
            handleClose();
        }, 1000);
    };

    const handleClose = () => {
        setFormData(initialFormData);
        setErrors({});
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={mode === 'add' ? 'Add New Patient' : 'Edit Patient'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                    <h4 className="text-lg font-semibold text-foreground mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            id="name"
                            name="name"
                            label="Full Name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            placeholder="John Doe"
                            required
                        />

                        <Input
                            id="email"
                            name="email"
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="john@example.com"
                            required
                        />

                        <Input
                            id="phone"
                            name="phone"
                            label="Phone Number"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            error={errors.phone}
                            placeholder="+1 (555) 000-0000"
                            required
                        />

                        <Input
                            id="age"
                            name="age"
                            label="Age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            error={errors.age}
                            placeholder="25"
                            required
                        />

                        <Select
                            id="gender"
                            name="gender"
                            label="Gender"
                            value={formData.gender}
                            onChange={handleChange}
                            options={[
                                { value: 'Male', label: 'Male' },
                                { value: 'Female', label: 'Female' },
                                { value: 'Other', label: 'Other' },
                            ]}
                        />
                    </div>
                </div>

                {/* Medical Information */}
                <div>
                    <h4 className="text-lg font-semibold text-foreground mb-4">Medical Information</h4>
                    <div className="space-y-4">
                        <Textarea
                            id="concerns"
                            name="concerns"
                            label="Primary Concerns"
                            value={formData.concerns}
                            onChange={handleChange}
                            placeholder="Describe the main concerns or reasons for seeking counseling..."
                            rows={3}
                        />

                        <Textarea
                            id="medicalHistory"
                            name="medicalHistory"
                            label="Medical History"
                            value={formData.medicalHistory}
                            onChange={handleChange}
                            placeholder="Any relevant medical history, medications, or previous treatments..."
                            rows={4}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSubmitting}
                        className="flex-1"
                    >
                        {mode === 'add' ? 'Add Patient' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
