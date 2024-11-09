import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const LandingPage = () => {
    const handleGoogleSignIn = async (credentialResponse) => {
        const { credential } = credentialResponse; // Get the Google token

        try {
            // Send the token to your backend for verification
            const response = await axios.post('http://localhost:3000/auth/google/callback', {
                idToken: credential,
            });

            console.log('User Info:', response.data); // Handle user info from backend
        } catch (error) {
            console.error('Error during Google Sign-In:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">Welcome to Our App</h1>
            <p className="text-lg mb-8">Sign up to get started!</p>
            <div className="bg-white shadow-md rounded-lg p-8 w-96">
                <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
                <GoogleLogin
                    onSuccess={handleGoogleSignIn}
                    onError={() => console.log('Login Failed')}
                />
            </div>
        </div>
    );
};

export default LandingPage;