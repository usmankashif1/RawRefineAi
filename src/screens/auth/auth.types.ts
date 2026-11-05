export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export type LoginErrors = Partial<Record<keyof LoginPayload, string>>;
