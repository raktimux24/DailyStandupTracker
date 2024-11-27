import React, { useState } from 'react';
import { Mail, Lock, ClipboardList } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types/auth';
import { patterns } from '../styles/patterns';
import { useTheme } from '../contexts/ThemeContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface LoginPageProps {
  onSwitchToSignUp: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignUp }) => {
  useDocumentTitle('Sign In - Daily Standup Tracker');
  const { login, error } = useAuth();
  const { theme } = useTheme();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={theme === 'dark' ? patterns.authDark : patterns.auth}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Sign in to Daily Standup Tracker
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Track your daily progress and stay connected with your team
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full flex justify-center items-center">
              <ClipboardList className="w-5 h-5 mr-2" />
              Sign in
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};