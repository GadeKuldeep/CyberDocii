import React from 'react';
import { FaCopy } from 'react-icons/fa';

const CommandBlock = ({ content, readOnly, autoSave }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="command-block">
      <div className="copy-btn">
        <button onClick={copyToClipboard} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
          <FaCopy /> COPY
        </button>
      </div>
      <div style={{ display: 'flex' }}>
        <span style={{ color: '#6b7280', marginRight: '0.5rem', userSelect: 'none' }}>$</span>
        {readOnly ? (
          <span>{content}</span>
        ) : (
          <input
            value={content}
            onChange={(e) => autoSave(e.target.value)}
            className="command-input"
            placeholder="echo 'cyberdocii'"
          />
        )}
      </div>
    </div>
  );
};

export default CommandBlock;
