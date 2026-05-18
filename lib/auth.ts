import { apiRequest } from './api';

export type FrontendRole = 'admin' | 'doctor' | 'patient';
export type BackendRole = 'super_admin' | 'doctor' | 'assistant' | 'patient';

export type SessionUser = {
    user_id: string;
    email: string;
    role: BackendRole;
    tier?: string;
    email_verified?: boolean;
    mfa_enabled?: boolean;
    must_change_password?: boolean;
    patient_id?: string;
    doctor_id?: string;
    assistant_id?: string;
};

export type AuthSession = {
    access_token: string;
    refresh_token?: string;
    user: SessionUser;
    frontendRole: FrontendRole;
};

type LoginResponse = {
    access_token?: string;
    refresh_token?: string;
    user?: SessionUser;
    requires_otp?: boolean;
    requires_mfa?: boolean;
    message?: string;
};

type CheckOtpResponse = {
    requires_otp: boolean;
    email: string;
    message?: string;
    otp_expires_in?: string;
};

const SESSION_KEY = 'ApothecaryAuthSession';

function toFrontendRole(role: BackendRole): FrontendRole | null {
    if (role === 'super_admin') {
        return 'admin';
    }

    if (role === 'doctor' || role === 'assistant') {
        return 'doctor';
    }

    if (role === 'patient') {
        return 'patient';
    }

    return null;
}

function persistSession(session: AuthSession) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('accessToken', session.access_token);
    if (session.refresh_token) {
        localStorage.setItem('refreshToken', session.refresh_token);
    }
    localStorage.setItem('userRole', session.frontendRole);
    localStorage.setItem('userEmail', session.user.email);
    localStorage.setItem('backendRole', session.user.role);
}

export function getSession(): AuthSession | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw) as AuthSession;
    } catch {
        clearSession();
        return null;
    }
}

export function hasRole(role: FrontendRole) {
    return getSession()?.frontendRole === role;
}

export function getDashboardPath(session: AuthSession) {
    if (session.frontendRole === 'patient') return '/dashboard/patient';
    return session.frontendRole === 'admin' ? '/dashboard/admin' : '/dashboard/doctor';
}

export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('backendRole');
}

export async function login(email: string, password: string): Promise<AuthSession> {
    const normalizedEmail = email.trim().toLowerCase();

    const authResult =
        (await tryLogin('/admin/signin', normalizedEmail, password)) ||
        (await tryLogin('/auth/login', normalizedEmail, password));

    if (!authResult) {
        throw new Error('Invalid email or password.');
    }

    if (authResult.requires_otp) {
        throw new Error(authResult.message || 'This admin account requires OTP verification before login.');
    }

    if (authResult.requires_mfa) {
        throw new Error(authResult.message || 'This account requires MFA. MFA entry is not available in this portal yet.');
    }

    if (!authResult.access_token || !authResult.user) {
        throw new Error('The backend did not return a usable login session.');
    }

    const frontendRole = toFrontendRole(authResult.user.role);
    if (!frontendRole) {
        throw new Error('This portal is only for patients, admins and Doctors.');
    }

    const session: AuthSession = {
        access_token: authResult.access_token,
        refresh_token: authResult.refresh_token,
        user: authResult.user,
        frontendRole,
    };

    persistSession(session);
    return session;
}

export async function startPortalLogin(email: string, password: string) {
    try {
        const otpStatus = await checkAdminOtpRequirement(email, password);
        if (otpStatus.requires_otp) {
            return {
                requiresOtp: true,
                message: otpStatus.message || 'OTP sent to admin email.',
            };
        }
    } catch {
        // Non-admin users sign in through the standard auth endpoint below.
    }

    const session = await login(email, password);
    return {
        requiresOtp: false,
        session,
    };
}

export async function checkAdminOtpRequirement(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const response = await apiRequest<CheckOtpResponse>('/admin/signin/check-otp', {
        method: 'POST',
        body: JSON.stringify({
            email: normalizedEmail,
            password,
        }),
    });

    if (!response.data) {
        throw new Error('The backend did not return OTP status.');
    }

    return response.data;
}

export async function verifyAdminSigninOtp(email: string, otp: string): Promise<AuthSession> {
    const normalizedEmail = email.trim().toLowerCase();

    const response = await apiRequest<LoginResponse>('/admin/signin/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
            email: normalizedEmail,
            otp,
        }),
    });

    if (!response.data?.access_token || !response.data.user) {
        throw new Error('The backend did not return a usable login session.');
    }

    const frontendRole = toFrontendRole(response.data.user.role);
    if (frontendRole !== 'admin') {
        throw new Error('OTP sign-in is only available for super admin accounts.');
    }

    const session: AuthSession = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        user: response.data.user,
        frontendRole,
    };

    persistSession(session);
    return session;
}

async function tryLogin(path: '/admin/signin' | '/auth/login', email: string, password: string) {
    try {
        const response = await apiRequest<LoginResponse>(path, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        return response.data || null;
    } catch {
        return null;
    }
}
