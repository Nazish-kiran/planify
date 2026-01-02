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

export default function Calendar({
  selectedDate,
  onDateSelect,
  dayProgress,
  PHASES,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [openInfo, setOpenInfo] = useState(false);
  const [isWeekView, setIsWeekView] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    return d;
  });

  const closeInfo = useCallback(() => setOpenInfo(false), []);

  /* ---------------- helpers ---------------- */

  const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

  const startOfWeek = (d) => {
    const date = new Date(d);
    date.setDate(date.getDate() - date.getDay());
    return date;
  };

  const addDays = (d, n) => {
    const date = new Date(d);
    date.setDate(date.getDate() + n);
    return date;
  };

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isoDate = (d) =>
    new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
      .toISOString()
      .slice(0, 10);

  /* ---------------- month days ---------------- */

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const firstDow = start.getDay();
    const arr = [];

    for (let i = 0; i < firstDow; i++) arr.push({ type: "blank" });

    for (let d = 1; d <= end.getDate(); d++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        d
      );
      const key = isoDate(date);

      arr.push({
        type: "day",
        date,
        day: d,
        track: WEEK_RHYTHM[date.getDay()],
        progress: dayProgress?.[key] || 0,
        isSelected: selectedDate && isSameDay(date, selectedDate),
      });
    }

    return arr;
  }, [currentMonth, dayProgress, selectedDate]);

  /* ---------------- week days ---------------- */

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentWeekStart);
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i);
      const key = isoDate(date);

      return {
        date,
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        day: date.getDate(),
        track: WEEK_RHYTHM[date.getDay()],
        progress: dayProgress?.[key] || 0,
        isSelected: selectedDate && isSameDay(date, selectedDate),
      };
    });
  }, [currentWeekStart, dayProgress, selectedDate]);

  /* ---------------- handlers ---------------- */

  const handlePrevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );

  const handleNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  const handleDayClick = (date) => {
    onDateSelect(date);
    setCurrentWeekStart(startOfWeek(date));
  };

  /* ---------------- render ---------------- */

  return (
    <div className="card" id="calCard">
      {/* ---------- HEADER ---------- */}
      <div className="head">
        <h2 id="monthTitle">
          {isWeekView
            ? `${weekDays[0].date.toLocaleDateString()} – ${weekDays[6].date.toLocaleDateString()}`
            : currentMonth.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
        </h2>

        <div className="row gap-2">
          {/* Info */}
          <button
            className="btn"
            onClick={() => setOpenInfo(true)}
            aria-label="How scheduling works"
          >
            <FiInfo size={18} />
          </button>

          <GuideCard open={openInfo} onClose={closeInfo} PHASES={PHASES} />

          {/* Week toggle — RIGHT of info */}
          <button
            className="btn ghost"
            title="Toggle week view"
            onClick={() => setIsWeekView((v) => !v)}
          >
            <i className="fa-solid fa-calendar-week" />
          </button>

          {/* Month navigation */}
          {!isWeekView && (
            <button className="btn" onClick={handlePrevMonth}>
              <i className="fa-solid fa-chevron-left" />
            </button>
          )}

          {!isWeekView && (
            <button className="btn" onClick={handleNextMonth}>
              <i className="fa-solid fa-chevron-right" />
            </button>
          )}
        </div>
      </div>

      {/* ---------- BODY ---------- */}
      <div className="body">
        {/* ===== MONTH VIEW ===== */}
        {!isWeekView && (
          <>
            <div className="cal-grid" id="dowRow">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="dow">
                  {d}
                </div>
              ))}
            </div>

            <div className="cal-grid" id="calGrid">
              {days.map((day, i) =>
                day.type === "blank" ? (
                  <div key={`b-${i}`} />
                ) : (
                  <button
                    key={isoDate(day.date)}
                    className={`day ${day.isSelected ? "selected" : ""}`}
                    onClick={() => handleDayClick(day.date)}
                  >
                    <div
                      className="row"
                      style={{ justifyContent: "space-between" }}
                    >
                      <span className="dnum">{day.day}</span>
                      <span className="track">{day.track}</span>
                    </div>
                    <div className="bar">
                      <span style={{ width: `${day.progress}%` }} />
                    </div>
                  </button>
                )
              )}
            </div>
          </>
        )}

        {/* ===== WEEK VIEW ===== */}
        {isWeekView && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button
                className="btn"
                onClick={() =>
                  setCurrentWeekStart(addDays(currentWeekStart, -7))
                }
              >
                <i className="fa-solid fa-chevron-left" /> Prev
              </button>

              <span style={{ flex: 1, textAlign: "center", fontWeight: 600 }} />

              <button
                className="btn"
                onClick={() =>
                  setCurrentWeekStart(addDays(currentWeekStart, 7))
                }
              >
                Next <i className="fa-solid fa-chevron-right" />
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7,1fr)",
                gap: 8,
              }}
            >
              {weekDays.map((day) => (
                <button
                  key={isoDate(day.date)}
                  className={`day ${day.isSelected ? "selected" : ""}`}
                  onClick={() => onDateSelect(day.date)}
                >
                  <div
                    className="row"
                    style={{ justifyContent: "space-between" }}
                  >
                    <span>{day.label}</span>
                    <span className="dnum">{day.day}</span>
                  </div>
                  <span className="track">{day.track}</span>
                  <div className="bar">
                    <span style={{ width: `${day.progress}%` }} />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
