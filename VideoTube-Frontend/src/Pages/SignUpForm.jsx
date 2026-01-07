
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// The SignUpPage 
export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    username: '',
    password: '',
    avatar: null, 
    coverImage: null
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    // Check if the input is a file input
    if (files) {
      setFormData(prevData => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signup Form Submitted:', formData);
    
    // --- START: Backend Integration Logic ---
    // Here is a placeholder for a real API call.

    // Validation for compulsory avatar field
    if (!formData.avatar) {
      alert("Please upload an avatar image.");
      return;
    }

    // Create a new FormData object to handle file uploads
    const formPayload = new FormData();
    formPayload.append('email', formData.email);
    formPayload.append('fullName', formData.fullName);
    formPayload.append('username', formData.username);
    formPayload.append('password', formData.password);
    formPayload.append('avatar', formData.avatar);
    // Only append coverImage if a file was selected
    if (formData.coverImage) {
      formPayload.append('coverImage', formData.coverImage);
    }

    try {
      // Replace with your actual backend API endpoint for signup.
      const response = await fetch('http://localhost:8000/api/v1/user/register', {
        method: 'POST',
        // Note: Do NOT set 'Content-Type' when using FormData, 
        // the browser will automatically set it to 'multipart/form-data'
        body: formPayload,
      });

      if (response.ok) {
        // If the sign up is successful, show a success message and redirect.
        alert('Sign up successful! Redirecting to home page...');
        // Use the useNavigate hook to programmatically navigate.
        navigate('/SignIn'); 
      } else {
        // Handle errors from the backend.
        const errorData = await response.json();
        alert(`Sign up failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('A network error occurred. Please try again.');
    }
    // --- END: Backend Integration Logic ---
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white rounded-xl shadow-2xl w-full max-w-md transition-all duration-300 transform hover:scale-[1.02]">
        <h2 className="text-3xl font-bold text-center text-gray-800">Create an Account</h2>
        <p className="text-center text-gray-500">Join our community and get started!</p>
        
        {/* Form Inputs */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="johndoe@example.com"
          />
        </div>
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="johndoe123"
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

        {/* New File Input for Avatar */}
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Avatar</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            onChange={handleInputChange}
            required
            className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
        </div>

        {/* New File Input for Cover Image */}
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image</label>
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            onChange={handleInputChange}
            className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          onSubmit={handleSubmit}
        >
          Sign Up
        </button>
        
        {/* Link to Sign In Page */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
