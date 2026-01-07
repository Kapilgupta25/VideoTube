// src/hooks/useAuth.js

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.js';

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};