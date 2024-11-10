import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ARView from './components/ui/ARView';


function App() {
    const isLoggedIn = !!localStorage.getItem('token'); // Replace with your actual authentication logic
    
     
    return (
        <GoogleOAuthProvider clientId="671602920396-qls3m19cjbamkbfsod9doqktqpg7ne93.apps.googleusercontent.com">
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
                    <Route path="/ar-view" element={<ARView />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;