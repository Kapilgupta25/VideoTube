/* eslint-disable no-unused-vars */

// The main home page that displays videos and uses the Header and Sidebar.
// =====================================================================
import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import VideoCard from '../components/VideoCard.jsx';
import { fetchAllVideos, fetchAllPlatformVideos } from '../api/videoApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';


  export default function HomePage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    // const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // useEffect(() => {
    //   if (!authLoading && !user) {
    //     // Redirect to sign in if not authenticated
    //     navigate('/signin');
    //   }
    // }, [user, authLoading, navigate]);

    useEffect(() => {
      const getVideos = async () => {
        try {
          // Updated API call to the correct endpoint
          const fetchedVideos = await fetchAllPlatformVideos();
          setVideos(fetchedVideos || []);
        } catch (error) {
          console.error('Failed to fetch videos:', error);
          setVideos([]);
        } finally {
          setLoading(false);
        }
      };
      getVideos();
    }, []); // Run only once on component mount

    // Return a loading state if videos are still being fetched
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          <p className="text-gray-500">Loading...</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-300">
        <Header />
        <div className="flex flex-1 pt-16"> {/* pt-16 to offset the header height */}
          <Sidebar />
          <main className="flex-1 p-8 ml-0 lg:ml-64 transition-all duration-300"> {/* ml-64 to offset the sidebar width */}
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">All Videos</h1>
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No videos have been published yet.</p>
            )}
          </main>
        </div>
      </div>
    );
  }