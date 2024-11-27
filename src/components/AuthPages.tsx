import React, { useState } from 'react';
import { LoginPage } from './LoginPage';
import { SignUpPage } from './SignUpPage';

export const AuthPages: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return isLoginView ? (
    <LoginPage onSwitchToSignUp={() => setIsLoginView(false)} />
  ) : (
    <SignUpPage onSwitchToLogin={() => setIsLoginView(true)} />
  );
};