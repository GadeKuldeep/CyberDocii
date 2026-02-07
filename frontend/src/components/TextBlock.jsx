import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const TextBlock = ({ content, autoSave, readOnly }) => {
  return (
    <TextareaAutosize
      value={content}
      onChange={(e) => autoSave(e.target.value)}
      className="textarea-autosize"
      placeholder="Type something..."
      readOnly={readOnly}
    />
  );
};

export default TextBlock;
