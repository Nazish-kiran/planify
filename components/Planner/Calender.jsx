"use client";
import { useState, useEffect } from "react";

const WEEK_RHYTHM = {
  0: "Strategy / Review",
  1: "Coding & Automation",
  2: "Marketing & Content", 
  3: "Coding & Automation",
  4: "Marketing & Content",
  5: "Coding & Automation",
  6: "BMI Ops Project",
};

export default function Calendar({ selectedDate, onDateSelect, dayProgress }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState([]);

  // Helper functions
  const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const isSameDay = (a, b) => 
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isoDate = (d) => {
    const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    return dt.toISOString().slice(0, 10);
  };

  useEffect(() => {
    renderCalendar();
  }, [currentMonth, dayProgress]);

  const renderCalendar = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const firstDow = start.getDay();
    
    const daysArray = [];

    // Add blank days for previous month
    for (let i = 0; i < firstDow; i++) {
      daysArray.push({ type: 'blank' });
    }

    // Add days for current month
    for (let d = 1; d <= end.getDate(); d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const dateKey = isoDate(date);
      const progress = dayProgress?.[dateKey] || 0;
      
      daysArray.push({
        type: 'day',
        date,
        day: d,
        track: WEEK_RHYTHM[date.getDay()],
        isSelected: selectedDate && isSameDay(date, selectedDate),
        progress: progress
      });
    }

    setDays(daysArray);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (date) => {
    onDateSelect(date);
  };

  return (
    <div className="card" id="calCard">
      <div className="head">
        <h2 id="monthTitle">
          {currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <div className="row">
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
            <div key={day} className="dow">{day}</div>
          ))}
        </div>
        <div className="cal-grid" id="calGrid">
          {days.map((day, index) => (
            day.type === 'blank' ? (
              <div key={`blank-${index}`}></div>
            ) : (
              <button
                key={`day-${day.date}`}
                className={`day ${day.isSelected ? 'selected' : ''}`}
                onClick={() => handleDayClick(day.date)}
              >
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="dnum">{day.day}</span>
                  <span className="track">{day.track}</span>
                </div>
                <div className="bar">
                  <span style={{ width: `${day.progress}%` }}></span>
                </div>
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
}