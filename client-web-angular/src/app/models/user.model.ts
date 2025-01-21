export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}