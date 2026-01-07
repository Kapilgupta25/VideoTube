// src/components/VideoCard.jsx
// A component to display a single video thumbnail and info.
// =====================================================================
import React from 'react';
import { Link } from 'react-router-dom';

export default function VideoCard({ video }) {
  const videoTitle = video.title || 'Untitled Video';
  const videoThumbnail = video.thumbnail || 'https://placehold.co/320x180/E2E8F0/94A3B8?text=No+Image';
  const videoOwnerAvatar = video.owner?.avatar || 'https://placehold.co/40x40/cccccc/000000?text=U';
  const videoOwnerUsername = video.owner?.username || 'user';
  const videoViews = video.views || 0;
  const videoPublishedAt = video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'N/A';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden text-gray-900 dark:text-white">
      <Link to={`/watch/${video._id}`}>
        <img
          src={videoThumbnail}
          alt={videoTitle}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <img
            src={videoOwnerAvatar}
            alt={videoOwnerUsername}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate hover:text-blue-600 transition-colors">
              <Link to={`/watch/${video._id}`}>{videoTitle}</Link>
            </h3>
            <p className="text-xs text-gray-500">
              <Link to={`/channel/${videoOwnerUsername}`} className="hover:text-blue-600">
                {videoOwnerUsername}
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              {videoViews} views • {videoPublishedAt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}