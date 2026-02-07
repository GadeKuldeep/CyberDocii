import React, { useRef } from 'react';
import { uploadFile } from '../api/sectionApi';
import { FaImage } from 'react-icons/fa';

const ImageBlock = ({ content, autoSave, projectId, readOnly }) => {
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    if (readOnly) return;
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);

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
          <img src={content} alt="Block Content" className="media-content" />
          {!readOnly && (
            <button
              className="change-media-btn"
              onClick={() => fileInputRef.current.click()}
            >
              Change Image
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => !readOnly && fileInputRef.current.click()}
          className={`upload-placeholder ${readOnly ? 'no-hover' : ''}`}
        >
          <FaImage size={32} style={{ marginBottom: '0.5rem' }} />
          <span>{readOnly ? 'No Image Uploaded' : 'Click to upload image'}</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageBlock;
