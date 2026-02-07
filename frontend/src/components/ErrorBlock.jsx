import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorBlock = ({ content, autoSave, readOnly }) => {
  return (
    <div className="error-block">
      <FaExclamationTriangle style={{ marginTop: '0.25rem', flexShrink: 0 }} />
      <div style={{ width: '100%' }}>
        {readOnly ? (
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontWeight: 'bold' }}>{content}</pre>
        ) : (
          <textarea
            value={content}
            onChange={(e) => autoSave(e.target.value)}
            className="error-textarea"
            placeholder="Error message..."
          />
        )}
      </div>
    </div>
  );
};

export default ErrorBlock;
