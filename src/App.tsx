import React from 'react';
import { Dashboard } from './components/Dashboard';
import { AuthPages } from './components/AuthPages';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Footer from './components/Footer';

const AuthenticatedApp = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      {user ? <Dashboard /> : <AuthPages />}
      <Footer />
    </div>
  );
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