"use client";
import { useState, useEffect, useRef } from "react";

const BACKEND_URL = "http://localhost:3001";

export default function Notes({ date }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  // Helper to ensure date is YYYY-MM-DD (LOCAL TIME)
  const formatDate = (d) => {
    if (!d) return new Date().toLocaleDateString('en-CA');
    if (d instanceof Date) return d.toLocaleDateString('en-CA');
    return d; // already a string in YYYY-MM-DD format
  };

  const formattedDate = formatDate(date);

  // Fetch notes when modal opens or date changes
  useEffect(() => {
    if (!formattedDate) return;
    setLoading(true);

    fetch(`${BACKEND_URL}/notes?date=${formattedDate}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setNotes(data?.note || "");
      })
      .catch(() => {
        console.warn("Could not fetch notes");
        setNotes("");
      })
      .finally(() => setLoading(false));
  }, [formattedDate, isModalOpen]);

  // Save notes to backend
  const saveNotesToDB = async (text) => {
    if (!formattedDate) return;

    try {
      const res = await fetch(`${BACKEND_URL}/notes/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: text, date: formattedDate }),
      });
      const data = await res.json();
      if (data.success) showNotification("Notes saved!");
      else showNotification(data.error || "Failed to save notes.");
    } catch (err) {
      console.warn("Could not save notes", err);
      showNotification("Server error while saving notes.");
    }
  };

  const handleSave = () => saveNotesToDB(notes);

  const handleClear = async () => {
    if (!formattedDate) return;
    if (confirm("Clear all notes?")) {
      setNotes("");
      await saveNotesToDB("");
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isModalOpen) setIsModalOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isModalOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current.focus(), 150);
    }
  }, [isModalOpen]);

  return (
    <>
      <button className="btn icon" onClick={() => setIsModalOpen(true)}>
        <i className="fa-regular fa-note-sticky"></i> Notes
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 p-4">
          <div className="notes-body rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col bg-white">
            {/* Header */}
            <div className="notes-head flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Notes</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-4xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-4 overflow-hidden">
              {loading ? (
                <p className="text-gray-500 italic">Loading your notes...</p>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes here..."
                  className="w-full h-64 p-3 border border-gray-300 rounded-md resize-none focus:outline-none"
                  style={{ minHeight: "200px" }}
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between p-4 border-t rounded-b-lg">
              <button
                onClick={handleClear}
                className="px-[12px] py-[8px] border border-red-500 rounded-[10px] text-red-500 font-medium cursor-pointer"
              >
                Clear Notes
              </button>
              <div className="space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-[12px] py-[8px] text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleSave}
                  className="px-[12px] py-[8px] bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 font-medium cursor-pointer"
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

function showNotification(message) {
  alert(message);
}