"use client";
import { useState, useEffect, useRef } from "react";

// Helper functions
const isoDate = (d) => {
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  return dt.toISOString().slice(0, 10);
};

const LS_KEY = "bmi_5y_planner_state_v1";

export default function Heatmap() {
  const [viewMode, setViewMode] = useState("current");
  const [currentViewYear, setCurrentViewYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayDetailsOpen, setDayDetailsOpen] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, content: "", x: 0, y: 0 });
  const [dataVersion, setDataVersion] = useState(0);
  
  const tooltipRef = useRef(null);
  const heatmapGraphRef = useRef(null);
  const monthsRowRef = useRef(null);
  const dayDetailsRef = useRef(null); // Ref for the day details section

  // Constants
  const YEARS = 5;
  const MS_DAY = 24 * 60 * 60 * 1000;
  const START_DATE = new Date();
  START_DATE.setHours(0, 0, 0, 0);

  const WEEK_RHYTHM = {
    1: "Coding & Automation",
    2: "Marketing & Content",
    3: "Coding & Automation",
    4: "Marketing & Content",
    5: "Coding & Automation",
    6: "BMI Ops Project",
    0: "Strategy / Review",
  };

  // Load state from localStorage
  const loadState = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : { done: {}, custom: {} };
    } catch {
      return { done: {}, custom: {} };
    }
  };

  // Task generation function
  const buildTasksForDay = (date) => {
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
      id: `${idBase}-${i}`,
      text: t,
    }));
  };

  // Heatmap calculations
  const tasksCompletedOn = (date) => {
    const STATE = loadState();
    const key = isoDate(date);
    return Object.values(STATE.done[key] || {}).filter(Boolean).length;
  };

  const totalTasksOn = (date) => {
    const STATE = loadState();
    const key = isoDate(date);
    const base = 4;
    const custom = STATE.custom[key] || [];
    return base + custom.length;
  };

  const getActivityLevel = (completed, total) => {
    if (completed === 0) return 0;
    if (completed === 1) return 1;
    if (completed === 2) return 2;
    if (completed === 3) return 3;
    return 4;
  };

  // Render functions
  const renderMonths = (startDate, endDate) => {
    if (!monthsRowRef.current) return;

    monthsRowRef.current.innerHTML = "";
    let currentDate = new Date(startDate);
    let weekIndex = 0;
    let lastMonth = -1;

    while (currentDate <= endDate) {
      if (currentDate.getDay() === 0) {
        weekIndex++;

        const endOfWeek = new Date(currentDate);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        const month = endOfWeek <= endDate ? endOfWeek.getMonth() : currentDate.getMonth();

        if (month !== lastMonth) {
          const label = document.createElement("span");
          label.classList.add("month-label");
          label.style.gridColumn = weekIndex.toString();
          label.textContent = new Date(
            currentDate.getFullYear(),
            month
          ).toLocaleString("default", { month: "short" });
          monthsRowRef.current.appendChild(label);
          lastMonth = month;
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  const renderDays = (startDate, endDate) => {
    if (!heatmapGraphRef.current) return;

    heatmapGraphRef.current.innerHTML = "";
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const completed = tasksCompletedOn(currentDate);
      const total = totalTasksOn(currentDate);
      const level = getActivityLevel(completed, total);

      const box = document.createElement("div");
      box.classList.add("contrib-box", `level-${level}`);
      box.dataset.date = isoDate(currentDate);
      box.dataset.completed = completed;
      box.dataset.total = total;

      box.title = `${completed} tasks completed on ${currentDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      })}`;

      // Add event listeners
      box.addEventListener("mouseenter", (e) => showTooltip(e, currentDate, completed));
      box.addEventListener("mouseleave", hideTooltip);
      box.addEventListener("click", (e) => {
        e.stopPropagation();
        showDayDetails(currentDate, completed, total);
      });

      heatmapGraphRef.current.appendChild(box);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  const renderHeatmap = () => {
    let startDate, endDate;

    if (viewMode === "current") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const pastYear = new Date(today);
      pastYear.setFullYear(today.getFullYear() - 1);

      startDate = new Date(pastYear);
      startDate.setDate(startDate.getDate() - startDate.getDay());

      endDate = new Date(today);
    } else {
      startDate = new Date(currentViewYear, 0, 1);
      endDate = new Date(currentViewYear, 11, 31);
    }

    renderMonths(startDate, endDate);
    renderDays(startDate, endDate);
  };

  // Event handlers
  const showTooltip = (event, date, completed) => {
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const taskText = completed === 1 ? "task" : "tasks";
    const content = `${completed} ${taskText} completed on ${formattedDate}`;

    const rect = event.target.getBoundingClientRect();
    setTooltip({
      visible: true,
      content,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const hideTooltip = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const showDayDetails = (date, completed, total) => {
    const STATE = loadState();
    const key = isoDate(date);

    const generatedTasks = buildTasksForDay(date);
    const customTasks = STATE.custom[key] || [];
    const doneTasks = STATE.done[key] || {};

    const allTasks = [...generatedTasks, ...customTasks];
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    setSelectedDate({
      date,
      completed,
      total,
      completionPercentage,
      tasks: allTasks,
      doneTasks,
      track: WEEK_RHYTHM[date.getDay()]
    });
    setDayDetailsOpen(true);
    
    // Scroll to day details after state update
    setTimeout(() => {
      if (dayDetailsRef.current) {
        dayDetailsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100); // Small delay to ensure the component is rendered
  };

  const hideDayDetails = () => {
    setDayDetailsOpen(false);
    setSelectedDate(null);
  };

  const handleYearChange = (direction) => {
    if (direction === "prev" && currentViewYear > START_DATE.getFullYear()) {
      setCurrentViewYear(currentViewYear - 1);
    } else if (direction === "next" && currentViewYear < START_DATE.getFullYear() + YEARS - 1) {
      setCurrentViewYear(currentViewYear + 1);
    }
  };

  const handleViewModeChange = (e) => {
    setViewMode(e.target.value);
    if (e.target.value === "current") {
      setCurrentViewYear(new Date().getFullYear());
    }
  };

  // Listen for storage changes and custom events
  useEffect(() => {
    const handleStorageChange = () => {
      setDataVersion(prev => prev + 1);
    };

    const handleCustomStorageChange = () => {
      setDataVersion(prev => prev + 1);
    };
    
    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom events from within the app
    window.addEventListener('localStorageChange', handleCustomStorageChange);

    // Set up polling as fallback (check every 500ms)
    const interval = setInterval(() => {
      handleStorageChange();
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Main render effect
  useEffect(() => {
    renderHeatmap();
  }, [viewMode, currentViewYear, dataVersion]);

  // Scroll to day details when it opens
  useEffect(() => {
    if (dayDetailsOpen && dayDetailsRef.current) {
      // Scroll to day details
      dayDetailsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [dayDetailsOpen]);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        hideTooltip();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="heatmap-section mt-8">
      <div className="Contribution card">
        <div className="head">
          <h2>5-Year Activity Overview</h2>
          <div className="row">
            <select 
              id="yearSelector" 
              className="btn"
              value={viewMode}
              onChange={handleViewModeChange}
            >
              <option value="current">Current Year</option>
              <option value="all">All 5 Years</option>
            </select>
          </div>
        </div>
        <div className="body">
          {/* Year navigation for multi-year view */}
          <div id="yearNavigation" className={viewMode === "all" ? "mb-4" : "hidden mb-4"}>
            <div className="flex items-center justify-between">
              <button 
                id="prevYear" 
                className="btn"
                onClick={() => handleYearChange("prev")}
                disabled={currentViewYear <= START_DATE.getFullYear()}
              >
                <i className="fa-solid fa-chevron-left"></i> Previous Year
              </button>
              <span id="currentYearDisplay" className="font-semibold">
                {currentViewYear}
              </span>
              <button 
                id="nextYear" 
                className="btn"
                onClick={() => handleYearChange("next")}
                disabled={currentViewYear >= START_DATE.getFullYear() + YEARS - 1}
              >
                Next Year <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
          
          {/* Heatmap container */}
          <div className="heatmap-container">
            {/* Months row */}
            <div className="months-row" id="monthsRow" ref={monthsRowRef}></div>
            
            {/* Main heatmap grid */}
            <div className="heatmap-grid-container">
              {/* Day labels */}
              <div className="day-labels">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>
              
              {/* Contribution graph */}
              <div className="heatmap-graph" id="heatmapGraph" ref={heatmapGraphRef}></div>
            </div>
            
            {/* Legend */}
            <div className="heatmap-legend">
              <span className="legend-text">Less</span>
              <div className="legend-boxes">
                <div className="legend-box level-0" title="0 tasks"></div>
                <div className="legend-box level-1" title="1 task"></div>
                <div className="legend-box level-2" title="2 tasks"></div>
                <div className="legend-box level-3" title="3 tasks"></div>
                <div className="legend-box level-4" title="4+ tasks"></div>
              </div>
              <span className="legend-text">More</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Day Details Section - with ref */}
      {dayDetailsOpen && selectedDate && (
        <div 
          id="dayDetails" 
          className="card Contribution mt-4" 
          ref={dayDetailsRef} // Add ref here
        >
          <div className="head">
            <h2 id="dayDetailsTitle">
              {selectedDate.date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h2>
            <button id="closeDayDetails" className="btn ghost" onClick={hideDayDetails}>
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          <div className="body">
            <div id="dayDetailsContent">
              <div className="day-details-grid">
                <div className="day-summary">
                  <h3 className="font-semibold mb-4">Day Summary</h3>
                  <div className="completion-ring">
                    <div style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: `conic-gradient(var(--ok) ${selectedDate.completionPercentage * 3.6}deg, var(--border) 0deg)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto"
                    }}>
                      <div style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        background: "var(--brand)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "var(--text)"
                      }}>
                        {selectedDate.completionPercentage}%
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">
                      {selectedDate.completed}/{selectedDate.total} Tasks Completed
                    </div>
                    <div className="text-sm text-muted mt-1">
                      Track: {selectedDate.track}
                    </div>
                  </div>
                </div>
                
                <div className="tasks-overview">
                  <h3 className="font-semibold mb-4">Tasks Breakdown</h3>
                  <div className="tasks-list">
                    {selectedDate.tasks.map((task) => {
                      const isCompleted = selectedDate.doneTasks[task.id];
                      return (
                        <div key={task.id} className={`task-item ${isCompleted ? "completed" : ""}`}>
                          <div className={`task-icon ${isCompleted ? "completed" : "pending"}`}>
                            {isCompleted ? "✓" : "○"}
                          </div>
                          <span>{task.text}</span>
                        </div>
                      );
                    })}
                  </div>
                  {selectedDate.tasks.length === 0 && (
                    <p className="text-muted text-center">No tasks for this day</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tooltip */}
      {tooltip.visible && (
        <div 
          ref={tooltipRef}
          id="heatmapTooltip" 
          className="heatmap-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="tooltip-content">{tooltip.content}</div>
        </div>
      )}
    </div>
  );
}