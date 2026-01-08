"use client";
import { useState, useRef } from "react";
import { useTheme } from "../ui/ThemeProvider";
import ThemeDropdown from "../ui/DropDown";
import Notes from "../ui/Notes";
import Stopwatch from "../Planner/StopWatch";

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const importFileRef = useRef(null);
  const { currentTheme } = useTheme();

  // Export functionality
  const handleExport = () => {
    const LS_KEY = "bmi_5y_planner_state_v1";
    try {
      const state = localStorage.getItem(LS_KEY);
      if (!state) {
        alert("No data to export");
        return;
      }

      const payload = JSON.stringify(JSON.parse(state), null, 2);
      const blob = new Blob([payload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bmi-planner-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error exporting data");
    }
  };

  // Import functionality
  const handleImport = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const LS_KEY = "bmi_5y_planner_state_v1";
        const importedState = JSON.parse(reader.result);
        localStorage.setItem(LS_KEY, JSON.stringify(importedState));
        alert("Import successful! Page will reload.");
        window.location.reload();
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (importFileRef.current) {
      importFileRef.current.value = "";
    }
  };

  // Reset functionality
  const handleReset = () => {
    if (confirm("Reset all progress?")) {
      setTimeout(() => {
        const LS_KEY = "bmi_5y_planner_state_v1";
        localStorage.setItem(LS_KEY, JSON.stringify({ done: {}, custom: {} }));
        alert("All progress has been reset! Page will reload.");
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <header className="w-full flex items-center justify-between gap-4 mb-4">
      <div className="flex gap-3 items-center">
        <i
          className="fa-regular fa-calendar"
          style={{ color: "#E53935", fontSize: "23.5px" }}
        ></i>
        <h1>BMI 5‑Year Planner</h1>
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="hamburger" onClick={() => setIsDrawerOpen(true)}>
        <i className="fas fa-bars" style={{ fontSize: "30px" }}></i>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black z-40"
          style={{ opacity: 0.3 }}
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 p-3 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="font-bold text-lg">Menu</h2>
          <button
            className="text-gray-700 text-xl"
            onClick={() => setIsDrawerOpen(false)}
          >
            &times;
          </button>
        </div>

        <div className="row row2">
          <Stopwatch/>
          {/* User Icon */}
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-zinc-800 border border-[#3F3F46] text-gray-200 mr-3">
            <i className="fa-regular fa-user" aria-hidden="true"></i>
            <span className="sr-only">User</span>
          </div>

          {/* Theme Dropdown for Mobile */}
          <div className="relative inline-block text-left">
            <button
              className="inline-flex btn justify-between items-center focus:outline-none"
              onClick={() => setIsDropdownOpen2(!isDropdownOpen2)}
            >
              <span className="flex items-center gap-2">
                <i
                  className={`far fa-${
                    currentTheme === "dark"
                      ? "moon"
                      : currentTheme === "light"
                      ? "sun"
                      : "palette"
                  }`}
                ></i>{" "}
                {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
              </span>
              <i className="fa-solid fa-chevron-down ml-2 text-gray-500"></i>
            </button>

            {isDropdownOpen2 && (
              <div className="absolute z-10 mt-2 w-full min-w-max bg-white border border-gray-200 rounded-md shadow-lg">
                <ul className="py-1">
                  <ThemeDropdown />
                </ul>
              </div>
            )}
          </div>
          <Notes date={new Date()}/>
          <button className="btn icon" onClick={handleExport}>
            Export
          </button>

          <label className="btn icon ghost" htmlFor="importFile">
            Import
          </label>

          <input
            id="importFile"
            ref={importFileRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={handleImport}
          />

          <button type="button" className="buttonreset" onClick={handleReset}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-repeat"
              viewBox="0 0 16 16"
            >
              <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path>
              <path
                fillRule="evenodd"
                d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
              ></path>
            </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Desktop Header Controls */}
      <div className="row">
          <Stopwatch/>
        <div className="w-11 h-11 rounded-full flex items-center justify-center bg-zinc-800 border border-[#3F3F46] text-gray-200 mr-3">
          <i className="fa-regular fa-user" aria-hidden="true"></i>
          <span className="sr-only">User</span>
        </div>

        {/* Theme Dropdown for Desktop */}
        <ThemeDropdown />
        <Notes date={new Date()}/>

        <button className="btn icon" onClick={handleExport}>
          Export
        </button>

        <label className="btn icon ghost" htmlFor="importFile">
          Import
        </label>

        <button type="button" className="buttonreset" onClick={handleReset}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-repeat"
            viewBox="0 0 16 16"
          >
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path>
            <path
              fillRule="evenodd"
              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
            ></path>
          </svg>
          Reset
        </button>
      </div>
    </header>
  );
}
