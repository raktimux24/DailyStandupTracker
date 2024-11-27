export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}