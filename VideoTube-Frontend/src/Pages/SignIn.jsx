import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// The SignInPage component contains the full form logic and JSX for signing in.
export default function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // --- START: Backend Integration Logic ---
  try {
    const response = await fetch('http://localhost:8000/api/v1/user/loginUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include'
    });

    const responseData = await response.json();

    if (response.ok) {
  // Check if tokens exist in the response data
      if (responseData.data && responseData.data.accessToken) {
      // Store the access token in local storage
        localStorage.setItem('accessToken', responseData.data.accessToken);
      } 
      else {
        console.error("Access token not found in the response.");
      }

      alert('Sign in successful! Redirecting to home page...');
      navigate('/home'); 

      } 
      else {
      // Handle errors from the backend.
        alert(`Sign in failed: ${responseData.message || 'Unknown error'}`);
      }
    } 

    catch (error) {
      console.error('Network error:', error);
      alert('A network error occurred. Please try again.');
    }
    // --- END: Backend Integration Logic ---
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white rounded-xl shadow-2xl w-full max-w-md transition-all duration-300 transform hover:scale-[1.02]">
        <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back!</h2>
        <p className="text-center text-gray-500">Sign in to your account.</p>

        {/* Form Inputs */}
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">Username or Email</label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="johndoe123 or johndoe@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="••••••••"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          onSubmit={handleSubmit}
        >
          Sign In
        </button>

        {/* Link to Sign Up Page */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}