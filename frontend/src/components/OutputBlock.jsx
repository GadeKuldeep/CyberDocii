import React from 'react';

const OutputBlock = ({ content, autoSave, readOnly }) => {
  return (
    <div className="output-block">
      {readOnly ? (
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{content}</pre>
      ) : (
        <textarea
          value={content}
          onChange={(e) => autoSave(e.target.value)}
          className="output-textarea"
          placeholder="Command output..."
        />
      )}
    </div>
  );
};

export default OutputBlock;
