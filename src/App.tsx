import React from 'react';
import { Dashboard } from './components/Dashboard';
import { AuthPages } from './components/AuthPages';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

const AuthenticatedApp = () => {
  const { user } = useAuth();
  return user ? <Dashboard /> : <AuthPages />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AuthenticatedApp />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;