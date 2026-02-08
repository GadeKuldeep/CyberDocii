import React, { useRef } from 'react';
import { BASE_URL } from '../api/axios';
import { uploadFile } from '../api/sectionApi';
import { FaVideo } from 'react-icons/fa';

const VideoBlock = ({ content, autoSave, projectId, readOnly }) => {
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    if (readOnly) return;
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await uploadFile(formData);
      // Save only the relative path to the database
      autoSave(data.filePath);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const getDisplayUrl = (url) => {
    if (!url) return '';
    // If it's already a full URL but points to localhost, replace it with the current BASE_URL
    if (url.includes('localhost:5000')) {
      return url.replace('http://localhost:5000', BASE_URL);
    }
    // If it's a relative path, prepend BASE_URL
    if (url.startsWith('/uploads')) {
      return `${BASE_URL}${url}`;
    }
    return url;
  };

  return (
    <div className="media-block">
      {content ? (
        <div className="media-container">
          <video controls src={getDisplayUrl(content)} className="media-content" />
          {!readOnly && (
            <button
              className="change-media-btn"
              onClick={() => fileInputRef.current.click()}
              aria-label="Change Video"
            >
              Change Video
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => !readOnly && fileInputRef.current.click()}
          className={`upload-placeholder ${readOnly ? 'no-hover' : ''}`}
        >
          <FaVideo size={32} style={{ marginBottom: '0.5rem' }} />
          <span>{readOnly ? 'No Video Uploaded' : 'Click to upload video'}</span>
        </div>
      )}
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default VideoBlock;
