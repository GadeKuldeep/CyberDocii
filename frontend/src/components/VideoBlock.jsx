import React, { useRef } from 'react';
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
      autoSave(`http://localhost:5000${data.filePath}`);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="media-block">
      {content ? (
        <div className="media-container">
          <video controls src={content} className="media-content" />
          {!readOnly && (
            <button
              className="change-media-btn"
              onClick={() => fileInputRef.current.click()}
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
