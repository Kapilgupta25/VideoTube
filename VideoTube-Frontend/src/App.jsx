import { Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './Pages/SignUpForm.jsx';
import SignInPage from './pages/SignIn.jsx';
import LandingPage from './Pages/LandingPage.jsx';
import Home from './pages/Home.jsx';

// This is the main application component that handles routing.
// It maps URL paths to the corresponding page components.
export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

