"use client";
import { useState, useEffect, useRef } from "react";

const NOTES_KEY = "bmi_notes_v1";

export default function Notes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const textareaRef = useRef(null);

  // Load notes on component mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(NOTES_KEY) || "";
      setNotes(savedNotes);
    } catch {
      setNotes("");
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (text) => {
    try {
      localStorage.setItem(NOTES_KEY, text);
    } catch (e) {
      console.warn('Could not save notes', e);
    }
  };

  // Handle save button click
  const handleSave = () => {
    saveNotes(notes);
    showNotification('Notes saved');
  };

  // Handle clear button click
  const handleClear = () => {
    if (confirm('Clear all notes?')) {
      setNotes('');
      saveNotes('');
    }
  };

  // Handle textarea change with debounce
  useEffect(() => {
    if (!isModalOpen) return;

    const timeoutId = setTimeout(() => {
      saveNotes(notes);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [notes, isModalOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isModalOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current.focus(), 150);
    }
  }, [isModalOpen]);

  return (
    <>
      {/* Notes Button */}
      <button 
        id="notesBtn" 
        className="btn icon"
        onClick={() => setIsModalOpen(true)}
      >
        <i className="fa-regular fa-note-sticky"></i>
        Notes
      </button>

      {/* Notes Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 p-4" >
          <div className="notes-body rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="notes-head flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Notes</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-5xl cursor-pointer "
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-4 overflow-hidden">
              <textarea
                ref={textareaRef}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                className="w-full h-64 p-3 border border-gray-300 rounded-md resize-none focus:outline-none"
                style={{ minHeight: "200px" }}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between p-4 border-t rounded-b-lg">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-red-500 rounded-md text-white font-medium cursor-pointer"
              >
                Clear Notes
              </button>
              <div className="space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-50 hover:text-gray-100 font-medium cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Helper function to show notifications
function showNotification(message) {
  // You can replace this with your preferred notification system
  alert(message);
}