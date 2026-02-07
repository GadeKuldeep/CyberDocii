import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import BlockItem from './BlockItem';
import { createSection, getSections, reorderSections, deleteSection } from '../api/sectionApi';
import { FaTerminal, FaFont, FaImage, FaVideo, FaExclamationTriangle, FaCode } from 'react-icons/fa';
import '../styles/components/Editor.css';

const BlockEditor = ({ projectId, readOnly }) => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchSections();
  }, [projectId]);

  const fetchSections = async () => {
    try {
      const { data } = await getSections(projectId);
      setSections(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addBlock = async (type) => {
    if (readOnly) return;
    const newOrder = sections.length > 0 ? sections[sections.length - 1].order + 1 : 0;
    try {
      const { data } = await createSection({
        projectId,
        type,
        content: '',
        order: newOrder
      });
      setSections([...sections, data]);
    } catch (error) {
      console.error("Failed to add block");
    }
  };

  const updateLocalSection = (id, newContent) => {
    setSections(prev => prev.map(s => s._id === id ? { ...s, content: newContent } : s));
  };

  const handleDelete = async (id) => {
    if (readOnly) return;
    if (!window.confirm("Delete block?")) return;
    try {
      await deleteSection(id);
      setSections(sections.filter(s => s._id !== id));
    } catch (error) {
      console.error("Failed to delete");
    }
  };

  const onDragEnd = async (result) => {
    if (readOnly || !result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setSections(updatedItems);

    const updates = updatedItems.map(item => ({
      _id: item._id,
      order: item.order
    }));

    try {
      await reorderSections(projectId, updates);
    } catch (error) {
      console.error("Reorder failed");
    }
  };

  return (
    <div className={`editor-layout ${readOnly ? 'read-only' : ''}`}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="blocks" isDropDisabled={readOnly}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="blocks-list">
              {sections.map((section, index) => (
                <BlockItem
                  key={section._id}
                  section={section}
                  index={index}
                  projectId={projectId}
                  onUpdate={updateLocalSection}
                  onDelete={handleDelete}
                  readOnly={readOnly}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {!readOnly && (
        <div className="toolbar-container">
          <span className="toolbar-label">Add Block</span>
          <button onClick={() => addBlock('text')} className="toolbar-btn" title="Text">
            <FaFont size={18} />
          </button>
          <button onClick={() => addBlock('command')} className="toolbar-btn btn-cmd" title="Command">
            <FaTerminal size={18} />
          </button>
          <button onClick={() => addBlock('output')} className="toolbar-btn btn-out" title="Output">
            <FaCode size={18} />
          </button>
          <button onClick={() => addBlock('error')} className="toolbar-btn btn-err" title="Error">
            <FaExclamationTriangle size={18} />
          </button>
          <div className="toolbar-separator"></div>
          <button onClick={() => addBlock('image')} className="toolbar-btn btn-img" title="Image">
            <FaImage size={18} />
          </button>
          <button onClick={() => addBlock('video')} className="toolbar-btn btn-vid" title="Video">
            <FaVideo size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BlockEditor;
