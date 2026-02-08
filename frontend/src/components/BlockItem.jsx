import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { updateSection } from '../api/sectionApi';
import TextBlock from './TextBlock';
import CommandBlock from './CommandBlock';
import OutputBlock from './OutputBlock';
import ErrorBlock from './ErrorBlock';
import ImageBlock from './ImageBlock';
import VideoBlock from './VideoBlock';
import { FaTrash, FaGripVertical } from 'react-icons/fa';

// Debounce helper
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const BlockItem = ({ section, index, projectId, onUpdate, onDelete, readOnly }) => {
    const [content, setContent] = useState(section.content);
    const debouncedContent = useDebounce(content, 1000);

    useEffect(() => {
        if (!readOnly && debouncedContent !== section.content) {
            handleSave(debouncedContent);
        }
    }, [debouncedContent]);

    const handleSave = async (newContent) => {
        if (readOnly) return;
        try {
            await updateSection(section._id, { content: newContent });
            onUpdate(section._id, newContent);
        } catch (error) {
            console.error("Auto-save failed");
        }
    };

    const handleChange = (val) => {
        if (readOnly) return;
        setContent(val);
    };

    const renderBlock = () => {
        const props = { content, autoSave: handleChange, readOnly };
        switch (section.type) {
            case 'text': return <TextBlock {...props} />;
            case 'command': return <CommandBlock {...props} />;
            case 'output': return <OutputBlock {...props} />;
            case 'error': return <ErrorBlock {...props} />;
            case 'image': return <ImageBlock {...props} projectId={projectId} />;
            case 'video': return <VideoBlock {...props} projectId={projectId} />;
            default: return <div style={{ color: 'red' }}>Unknown block</div>;
        }
    };

    return (
        <Draggable draggableId={section._id} index={index} isDragDisabled={readOnly}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`block-item-wrapper ${snapshot.isDragging ? 'block-dragging' : ''} ${readOnly ? 'block-read-only' : ''}`}
                >
                    {!readOnly && (
                        <div {...provided.dragHandleProps} className="drag-handle" aria-label="Drag to reorder">
                            <FaGripVertical />
                        </div>
                    )}

                    <div className="block-content-area">
                        {renderBlock()}
                    </div>

                    {!readOnly && (
                        <button
                            onClick={() => onDelete(section._id)}
                            className="block-actions-right"
                            aria-label="Delete Block"
                        >
                            <FaTrash size={14} />
                        </button>
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default BlockItem;
