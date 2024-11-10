import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Backpack } from 'lucide-react';

function LandingPage() {
  const handleGoogleSignIn = async (credentialResponse) => {
    const { credential } = credentialResponse;

    try {
      const response = await axios.post('http://localhost:4000/api/user/login', {
        id_token: credential,
      });

      // Store the token and redirect to dashboard
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
    }
  };

  const handleGoogleOAuth = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/google/callback&response_type=code&scope=openid%20email%20profile`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-4">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <Backpack className="w-16 h-16 mx-auto mb-6 " />
          <h1 className="text-3xl font-bold mb-4 text-gray-900">U<span className='text-[#962a3f]'>Found</span></h1>
          <p className="text-lg text-gray-600 mb-8">Sign in to report or find lost items</p>
          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleSignIn}
              onError={() => console.log('Login Failed')}
              useOneTap
              theme="filled_blue"
              shape="rectangular"
              size="large"
              text="signin_with"
              width="100%"
            />
            <button onClick={handleGoogleOAuth}>Sign in with Google OAuth</button>
          </div>
        </div>
        <footer className="mt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} UMass Lost and Found. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;