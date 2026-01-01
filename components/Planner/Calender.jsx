"use client";
import { useState, useMemo, useCallback } from "react";
import GuideCard from "./GuideCard";
import { FiInfo } from "react-icons/fi";

const WEEK_RHYTHM = {
  0: "Strategy / Review",
  1: "Coding & Automation",
  2: "Marketing & Content",
  3: "Coding & Automation",
  4: "Marketing & Content",
  5: "Coding & Automation",
  6: "BMI Ops Project",
};

export default function Calendar({ selectedDate, onDateSelect, dayProgress, PHASES }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [openInfo, setOpenInfo] = useState(false);
  const closeInfo = useCallback(() => setOpenInfo(false), []);

  const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isoDate = (d) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    .toISOString()
    .slice(0, 10);

  // Generate calendar days dynamically using useMemo (safe)
  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const firstDow = start.getDay();
    const daysArray = [];

    // Blank days for previous month
    for (let i = 0; i < firstDow; i++) {
      daysArray.push({ type: "blank" });
    }

    // Days for current month
    for (let d = 1; d <= end.getDate(); d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const dateKey = isoDate(date);
      const progress = dayProgress?.[dateKey] || 0;

      daysArray.push({
        type: "day",
        date,
        day: d,
        track: WEEK_RHYTHM[date.getDay()],
        isSelected: selectedDate && isSameDay(date, selectedDate),
        progress,
      });
    }

    return daysArray;
  }, [currentMonth, dayProgress, selectedDate]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (date) => onDateSelect(date);

  return (
    <div className="card" id="calCard">
      <div className="head">
        <h2 id="monthTitle">
          {currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <div className="row gap-2">
          <button
            className="btn flex items-center gap-2"
            onClick={() => setOpenInfo(true)}
            aria-label="How scheduling works"
          >
            <FiInfo size={18} />
          </button>
          <GuideCard open={openInfo} onClose={closeInfo} PHASES={PHASES} />

          <button id="prevMonth" className="btn" onClick={handlePrevMonth}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button id="nextMonth" className="btn" onClick={handleNextMonth}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="body">
        <div className="cal-grid" id="dowRow">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="dow">
              {day}
            </div>
          ))}
        </div>

        <div className="cal-grid" id="calGrid">
          {days.map((day, index) =>
            day.type === "blank" ? (
              <div key={`blank-${index}`} />
            ) : (
              <button
                key={`day-${day.date}`}
                className={`day ${day.isSelected ? "selected" : ""}`}
                onClick={() => handleDayClick(day.date)}
              >
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span className="dnum">{day.day}</span>
                  <span className="track">{day.track}</span>
                </div>
                <div className="bar">
                  <span style={{ width: `${day.progress}%` }}></span>
                </div>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
