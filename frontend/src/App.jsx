import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
    const isLoggedIn = false; // Replace with your actual authentication logic

    return (
        <GoogleOAuthProvider clientId="671602920396-qls3m19cjbamkbfsod9doqktqpg7ne93.apps.googleusercontent.com">
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;