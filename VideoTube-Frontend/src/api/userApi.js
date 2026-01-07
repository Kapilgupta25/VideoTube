/* eslint-disable no-unused-vars */
// API calls related to user management.
// =====================================================================
// The backend API URL. Make sure this is correct.
const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Fetches the currently logged-in user's profile.
 * @returns {Promise<Object>} The user profile object.
 */
export const fetchCurrentUser = async () => {
  // This is a placeholder. You'll need to handle authentication headers
  // such as a JWT token stored in cookies or local storage.
  try {
  // 1. Retrieve the access and refresh token from local storage
  const accessToken = localStorage.getItem('accessToken');

  // 2. Check if the accessToken exists before making the call
  if (!accessToken) {
    throw new Error('No access token found.');
  }

  const response = await fetch(`${API_BASE_URL}/user/current-user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 3. Add the Authorization header with the access token
      'Authorization': `Bearer ${accessToken}`
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  const result = await response.json();
  return result.data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
};

/**
 * Logs out the current user.
 * @returns {Promise<boolean>} True if logout is successful.
 */
export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to log out');
    }

    return true;
  } catch (error) {
    console.error('Logout API Error:', error);
    return false;
  }
};