import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { createPortal } from 'react-dom';
import { AiOutlineUpload, AiOutlineSearch, AiOutlineHome, AiOutlineLogout, AiOutlineSun, AiOutlineMoon } from 'react-icons/ai';

// A simple Modal component for uploading videos.
const UploadModal = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnail || !title) {
      alert('Video File, Thumbnail, and Title are required.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('videoFile', videoFile);
    formData.append('thumbnail', thumbnail);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await fetch('http://localhost:8000/api/v1/videos/publishAVideo', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to upload video');

      alert('Video uploaded successfully!');
      onClose();
      window.location.reload(); 
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Failed to upload video.');
    } finally {
      setIsUploading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload a Video</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video File</label>
            <input type="file" required onChange={(e) => setVideoFile(e.target.files[0])} className="mt-1 block w-full text-gray-700 dark:text-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail</label>
            <input type="file" required onChange={(e) => setThumbnail(e.target.files[0])} className="mt-1 block w-full text-gray-700 dark:text-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" />
          </div>
          <button type="submit" disabled={isUploading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            {isUploading ? 'Uploading...' : 'Publish Video'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/signin');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  const userAvatarUrl = user?.avatar || 'https://placehold.co/40x40/cccccc/000000?text=U';

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-white dark:bg-gray-900 shadow-lg transition-all duration-300
                       ${isScrolled ? 'h-14 md:h-16 shadow-md' : 'h-16 md:h-20 shadow-none'}`}>
      <Link to="/home" className="flex items-center space-x-2 shrink-0">
        <span className={`text-2xl font-extrabold text-blue-600 dark:text-blue-400 transition-all duration-300
                          ${isScrolled ? 'text-xl' : 'text-2xl'}`}>VideoTube</span>
      </Link>

      <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4 hidden md:flex">
        <div className="relative w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for videos..."
            className="w-full px-4 py-2 pl-12 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all text-gray-900 dark:text-white"
          />
          <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
        </div>
      </form>

      <div className="flex items-center space-x-2 sm:space-x-4 relative shrink-0">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 text-gray-700 dark:text-yellow-400 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <AiOutlineSun size={24} /> : <AiOutlineMoon size={24} />}
        </button>

        <button
          onClick={() => setShowUploadModal(true)}
          className="p-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Upload a video"
        >
          <AiOutlineUpload size={24} />
        </button>

        {user ? (
          <div className="relative">
            <img
              src={userAvatarUrl}
              alt="User Avatar"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 dark:border-gray-700 hover:border-blue-600 transition-colors duration-200"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-expanded={showDropdown}
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-700">
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
                </div>
                <Link to="/home" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">
                  <AiOutlineHome /><span>My Videos</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center space-x-2 w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">
                  <AiOutlineLogout /><span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/signin"
            className="hidden sm:inline-block px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
      {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} />}
    </header>
  );
}