import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import HemogramAnalyze from './components/HemogramAnalyze';
import AdminPanel from './components/AdminPanel';
import HomePage from './components/HomePage';
import Contact from './components/Contact';
import Xray from './components/Xray';
import Electrocardiogram from './components/Electrocardiogram';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import * as authService from './services/authService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email
        });
        setCurrentScreen('dashboard');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentScreen('dashboard');
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setCurrentScreen('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (currentScreen === 'admin' && user) {
    return (
      <AdminPanel 
        user={user} 
        onLogout={handleLogout}
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === 'dashboard' && user) {
    return (
      <Dashboard 
        user={user} 
        onLogout={handleLogout}
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === 'settings' && user) {
    return (
      <Settings 
        user={user} 
        onLogout={handleLogout}
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === 'hemogram' && user) {
    return (
      <HemogramAnalyze 
        user={user} 
        onLogout={handleLogout}
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === 'xray' && user) {
    return (
      <Xray 
        user={user} 
        onLogout={handleLogout}
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === 'ecg' && user) {
    return (
      <Electrocardiogram 
        user={user} 
        onLogout={handleLogout}
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === 'contact') {
    return (
      <Contact 
        user={user} 
        onLogout={handleLogout}
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} onNavigate={setCurrentScreen} />;
  }


  return <HomePage onNavigateLogin={() => setCurrentScreen('login')} onNavigate={setCurrentScreen} user={user} onLogout={handleLogout} />;
}