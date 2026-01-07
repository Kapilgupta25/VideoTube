import { Link } from 'react-router-dom';

// The LandingPage component contains the main welcome message and navigation buttons.
export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 tracking-tight mb-4">
        VideoTube
      </h1>
      <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-8">
        Welcome to your personal video platform!
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/signin"
          className="py-3 px-8 bg-white text-blue-600 font-bold rounded-full shadow-lg border-2 border-blue-600 
                     hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-300 
                     transition-all duration-300 transform hover:scale-105"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="py-3 px-8 bg-blue-600 text-white font-bold rounded-full shadow-lg border-2 border-blue-600
                     hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 
                     transition-all duration-300 transform hover:scale-105"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}