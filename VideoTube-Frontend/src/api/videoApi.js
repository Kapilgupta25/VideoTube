/* eslint-disable no-unused-vars */
// API calls related to video management.
// =====================================================================
// The backend API URL. Make sure this is correct.
const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Fetches all videos for the current user.
 * @returns {Promise<Array>} An array of video objects.
 */
export const fetchAllVideos = async () => {
    
  try {
    // 1. Retrieve the access and refresh token from local storage
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken'); // Note: refreshToken is typically used for a different API call

    // 2. Check if the accessToken exists before making the call
    if (!accessToken) {
      throw new Error('No access token found.');
    }
    // This endpoint should be for getting all videos for the logged-in user.
    // The `getAllVideoes` controller you provided seems to suggest this.
    const response = await fetch(`${API_BASE_URL}/videos/getAllVideoes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }

    const result = await response.json();
    // Assuming the API response has a `data` field which is an array of videos
    return result.data;
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

/**
 * Fetches all videos on the platform for any user.
 * @returns {Promise<Array>} An array of video objects.
 */
export const fetchAllPlatformVideos = async () => {
  try {
    // 1. Retrieve the access and refresh token from local storage
    const accessToken = localStorage.getItem('accessToken')
    console.log('Access Token:', accessToken);
    // 2. Check if the accessToken exists before making the call
    if (!accessToken) {
      throw new Error('No access token found.');
    }
    // This is a new hypothetical endpoint for getting all videos on the platform.
    // You'll need to create a corresponding route and controller in your backend.
    const response = await fetch(`${API_BASE_URL}/video`, { // Updated API endpoint based on your backend
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      credentials: 'include' // Include cookies for session management
    });

    if (!response.ok) {
      throw new Error('Failed to fetch platform videos');
    }    
    const result = await response.json();
    // Assuming the API response has a `data` field which is an array of videos
    return result.data.videos;
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

/**
 * Publishes a new video to the backend.
 * @param {FormData} videoData The video data including files.
 * @returns {Promise<Object>} The newly published video object.
 */
export const publishVideo = async (videoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/videos/publishAVideo`, {
      method: 'POST',
      // The browser automatically sets the 'Content-Type' for FormData
      body: videoData,
    });

    if (!response.ok) {
      throw new Error('Failed to publish video');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
