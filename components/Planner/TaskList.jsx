"use client";
import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import Notes from "../ui/Notes";

const LS_KEY = "bmi_5y_planner_state_v1";

// Memoize helpers
const isoDate = (d) => {
  if (!d) return "";
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  return dt.toISOString().slice(0, 10);
};

const hashId = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h >>> 0);
  }
  return (h >>> 0).toString(36);
};

// Memoized data structure
const WEEK_RHYTHM = {
  0: "Strategy / Review",
  1: "Coding & Automation",
  2: "Marketing & Content",
  3: "Coding & Automation",
  4: "Marketing & Content",
  5: "Coding & Automation",
  6: "BMI Ops Project",
};

const CURRICULUM = {
  "Coding & Automation": [
    "Python: data types, loops, functions",
    "Python: files, JSON, error handling",
    "SQL: SELECT/JOIN/AGG",
    "Pandas basics for analysis",
    "Flask/Django: CRUD app",
    "Auth & roles (admin/distributor)",
    "REST APIs for inventory",
    "React basics (components/state)",
    "Next.js pages & API routes",
    "Deploy to Vercel/Render",
    "Data viz (charts/dashboards)",
    "Automation: Excel/CSV pipelines",
  ],
  "Marketing & Content": [
    "SEO basics: keywords & intent",
    "On-page SEO: titles/meta/alt",
    "Content calendar for BMI",
    "Facebook/IG ads fundamentals",
    "Google Ads basics",
    "Landing page copywriting",
    "Email CRM (segmentation)",
    "LinkedIn outreach (B2B)",
    "Competitor teardown (5 brands)",
    "Photography standards for SKUs",
    "Short-form video workflow",
    "Analytics (GA4, Meta)",
  ],
  "BMI Ops Project": [
    "Catalog: 92 SKUs × sizes × colors (audit)",
    "Map distributors by region",
    "Hospital/clinic leads list",
    "Website IA + wireframes",
    "Set packaging/labeling guidelines",
    "Prepare ISO documentation packet",
    "B2B order form requirements",
    "Calculate pricing & margin sheets",
    "Logistics & delivery SLAs",
    "CSR & partnerships plan",
    "Sports physio pilot program",
    "Quarterly board review deck",
  ],
  "Strategy / Review": [
    "Weekly review: wins/blockers",
    "Read: The Prince / Art of War",
    "Read: Blue Ocean / Lean Startup",
    "Roadmap adjust: next sprint",
    "Finance check: P&L snapshot",
    "Product ideas backlog grooming",
    "Rest & recovery / family",
  ],
};

export default function TaskList({ selectedDate, onProgressUpdate }) {
  const [customInput, setCustomInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState({});
  const [customTasks, setCustomTasks] = useState({});

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? JSON.parse(raw) : { done: {}, custom: {} };
      setCompletedTasks(parsed.done || {});
      setCustomTasks(parsed.custom || {});
    } catch {
      setCompletedTasks({});
      setCustomTasks({});
    }
  }, []);

  // Save to localStorage
  const saveState = useCallback((done, custom) => {
    localStorage.setItem(LS_KEY, JSON.stringify({ done, custom }));
  }, []);

  // Toggle task
  const handleTaskToggle = useCallback((taskId, isCompleted) => {
    if (!selectedDate) return;
    const key = isoDate(selectedDate);

    setCompletedTasks((prev) => {
      const prevDay = prev[key] || {};
      if (prevDay[taskId] === isCompleted) return prev; // prevent unnecessary update
      const newDone = { ...prev, [key]: { ...prevDay, [taskId]: isCompleted } };
      saveState(newDone, customTasks);
      return newDone;
    });
  }, [selectedDate, customTasks, saveState]);

  // Add custom task
  const handleAddCustom = useCallback(() => {
    if (!customInput.trim() || !selectedDate) return;
    const key = isoDate(selectedDate);
    const newTask = {
      id: hashId(key + ":custom:" + customInput + ":" + Date.now()),
      text: customInput.trim(),
      type: "custom"
    };
    setCustomTasks((prev) => {
      const newCustom = { ...prev, [key]: [...(prev[key] || []), newTask] };
      saveState(completedTasks, newCustom);
      return newCustom;
    });
    setCustomInput("");
  }, [customInput, selectedDate, completedTasks, saveState]);

  // Delete custom task
  const handleDeleteCustom = useCallback((taskId) => {
    if (!selectedDate) return;
    const key = isoDate(selectedDate);

    setCustomTasks((prev) => {
      const newCustom = { ...prev, [key]: (prev[key] || []).filter((t) => t.id !== taskId) };
      return newCustom;
    });

    setCompletedTasks((prev) => {
      const newCompleted = { ...prev };
      if (newCompleted[key]) delete newCompleted[key][taskId];
      saveState(newCompleted, customTasks);
      return newCompleted;
    });
  }, [selectedDate, customTasks, saveState]);

  // Complete all tasks
  const handleCompleteAll = useCallback(() => {
    if (!selectedDate) return;
    const key = isoDate(selectedDate);
    setCompletedTasks((prev) => {
      const newCompleted = { ...prev, [key]: {} };
      tasks.forEach((task) => (newCompleted[key][task.id] = true));
      saveState(newCompleted, customTasks);
      return newCompleted;
    });
  }, [selectedDate, tasks, customTasks, saveState]);

  // Clear all checks
  const handleClearChecks = useCallback(() => {
    if (!selectedDate) return;
    const key = isoDate(selectedDate);
    setCompletedTasks((prev) => {
      const newCompleted = { ...prev };
      delete newCompleted[key];
      saveState(newCompleted, customTasks);
      return newCompleted;
    });
  }, [selectedDate, customTasks, saveState]);

  // Check if task is completed
  const isTaskCompleted = useCallback((taskId) => {
    if (!selectedDate) return false;
    const key = isoDate(selectedDate);
    return completedTasks[key]?.[taskId] || false;
  }, [selectedDate, completedTasks]);

  // Keep a ref to onProgressUpdate to avoid dependency issues
  const onProgressUpdateRef = useRef(onProgressUpdate);
  
  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  // Generate tasks for the selected day - memoized with useMemo
  const generatedTasks = useMemo(() => {
    if (!selectedDate) return [];
    
    const buildTasksForDay = (date) => {
      const START_DATE = new Date();
      START_DATE.setHours(0, 0, 0, 0);
      const MS_DAY = 24 * 60 * 60 * 1000;
      const yearDiff = date.getFullYear() - START_DATE.getFullYear();
      const phaseIdx = Math.min(Math.max(0, yearDiff), 4);

      const track = WEEK_RHYTHM[date.getDay()];
      const weekIndex = Math.floor((date - START_DATE) / MS_DAY / 7);
      const modules = CURRICULUM[track] || [];
      const mA = modules.length ? modules[weekIndex % modules.length] : "Focus block";
      const mB = modules.length ? modules[(weekIndex + 1) % modules.length] : "Implementation";

      const learn = `LEARN: ${mA}`;
      const build = `BUILD: ${
        track.includes("Coding")
          ? "Implement feature or script"
          : track.includes("Marketing")
          ? "Draft content/ads"
          : track.includes("Ops")
          ? "Complete sub-task of ops item"
          : "Plan upcoming week"
      }`;

      const biz =
        phaseIdx === 0
          ? "BUSINESS: Compile SKU/size/color data into master sheet"
          : phaseIdx === 1
          ? "BUSINESS: Reach out to 5 clinics/distributors"
          : phaseIdx === 2
          ? "BUSINESS: Marketplace/export prep (1 micro-task)"
          : phaseIdx === 3
          ? "BUSINESS: Data collection for forecasting"
          : "BUSINESS: KPI review & optimize";

      const idBase = isoDate(date);
      return [learn, `DO: ${mB}`, build, biz].map((t, i) => ({
        id: hashId(idBase + ":" + i + ":" + t),
        text: t,
        type: "generated",
      }));
    };
    
    return buildTasksForDay(selectedDate);
  }, [selectedDate]);

  // Combine generated and custom tasks
  useEffect(() => {
    const key = isoDate(selectedDate);
    const combined = [
      ...generatedTasks,
      ...(customTasks[key] || [])
    ];
    setTasks(combined);
  }, [selectedDate, generatedTasks, customTasks]);

  // Update overall progress
  useEffect(() => {
    if (!onProgressUpdateRef.current) return;

    const calculateProgress = () => {
      const YEARS = 5;
      const MS_DAY = 24 * 60 * 60 * 1000;
      const START_DATE = new Date();
      START_DATE.setHours(0, 0, 0, 0);
      const end = new Date(START_DATE);
      end.setDate(end.getDate() + YEARS * 365);
      const totalDays = Math.ceil((end - START_DATE) / MS_DAY);
      const baseTasks = totalDays * 4;

      let completed = 0;
      Object.values(completedTasks).forEach((day) => {
        completed += Object.values(day || {}).filter(Boolean).length;
      });

      const pct = Math.min(100, Math.round((completed / Math.max(1, baseTasks)) * 100));

      const dayProgress = {};
      Object.keys(customTasks).forEach((dateKey) => {
        const base = 4;
        const customCount = customTasks[dateKey]?.length || 0;
        const total = base + customCount;
        const doneCount = Object.values(completedTasks[dateKey] || {}).filter(Boolean).length;
        dayProgress[dateKey] = Math.min(100, Math.round((doneCount / Math.max(1, total)) * 100));
      });

      Object.keys(completedTasks).forEach((dateKey) => {
        if (!dayProgress[dateKey]) {
          const base = 4;
          const customCount = customTasks[dateKey]?.length || 0;
          const total = base + customCount;
          const doneCount = Object.values(completedTasks[dateKey] || {}).filter(Boolean).length;
          dayProgress[dateKey] = Math.min(100, Math.round((doneCount / Math.max(1, total)) * 100));
        }
      });

      return { completed, percentage: pct, dayProgress };
    };

    onProgressUpdateRef.current(calculateProgress());
  }, [completedTasks, customTasks]);

  // Render
  if (!selectedDate) {
    return (
      <div className="card" style={{ marginTop: 16 }}>
        <div className="body">
          <p>Select a date to view tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="head">
        <h2 id="taskTitle">
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h2>
        <div className="row">
          <Notes date={selectedDate} />
          <button id="completeAll" className="btn" onClick={handleCompleteAll}>
            Complete all
          </button>
          <button id="clearChecks" className="btn ghost" onClick={handleClearChecks}>
            Clear
          </button>
        </div>
      </div>
      <div className="body">
        <div
          id="taskList"
          className="stack"
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          {tasks.map((task) => {
            const isCompleted = isTaskCompleted(task.id);
            return (
              <div key={task.id} className={`task ${isCompleted ? "done" : ""}`}>
                <input
                  type="checkbox"
                  id={`task-${task.id}`}
                  checked={isCompleted}
                  onChange={(e) => handleTaskToggle(task.id, e.target.checked)}
                />
                <label htmlFor={`task-${task.id}`}>{task.text}</label>
                {task.type === "custom" && (
                  <button className="del" title="Remove" onClick={() => handleDeleteCustom(task.id)}>
                    ✕
                  </button>
                )}
              </div>
            );
          })}
          {tasks.length === 0 && <p>No tasks for this day</p>}
        </div>
        <div className="add-row">
          <input
            id="customInput"
            type="text"
            placeholder="Add a custom task…"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
          />
          <button id="addCustom" className="btn" onClick={handleAddCustom}>
            Add
          </button>
        </div>
        <small className="muted pt-3 block">
          Daily pillars: <span className="pill">LEARN</span>
          <span className="pill">DO</span> <span className="pill">BUILD</span>
          <span className="pill">BUSINESS</span>
        </small>
      </div>
    </div>
  );
}
