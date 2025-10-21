"use client";
import { useState } from "react";

export default function Sidebar({ progressData }) {
  const [openAccordion, setOpenAccordion] = useState("weeklyRhythm");

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const PHASES = [
    { year: 1, title: "Foundation: Code + Web + SEO (Own Pakistan)" },
    { year: 2, title: "Brand & Sales Engine (Nationwide)" },
    { year: 3, title: "E‑commerce & Export Entry" },
    { year: 4, title: "AI Forecasting & International Marketing" },
    { year: 5, title: "Scale, Funding & Ops Excellence" },
  ];

  const { completed = 0, percentage = 0 } = progressData || {};

  return (
    <div className="col">
      {/* Progress Card */}
      <div className="card">
        <div className="head">
          <h2>Overall Progress</h2>
        </div>
        <div className="body progress-wrap">
          <div className="prog">
            <span 
              id="overallBar" 
              style={{ 
                width: `${percentage}%`,
                transition: 'width 0.3s ease-in-out'
              }}
            ></span>
          </div>
          <div>
            <strong id="overallNums">
              {completed.toLocaleString()} done • {percentage}%
            </strong>
          </div>
          <small className="muted">
            Estimate based on 4 base tasks per day for 5 years (not counting your custom tasks).
          </small>
        </div>
      </div>

      {/* Guide Card */}
      <div className="card" style={{ marginTop: "16px" }}>
        <div className="head">
          <h2>How it schedules your days</h2>
        </div>
        <div className="body">
          {/* Weekly Rhythm Accordion */}
          <div className="border-b border-zinc-600">
            <button 
              className="w-full flex justify-between items-center py-4 text-left font-semibold"
              onClick={() => toggleAccordion("weeklyRhythm")}
            >
              <span>Weekly rhythm</span>
              <i 
                className={`fas fa-chevron-down transition-transform duration-300 ${
                  openAccordion === "weeklyRhythm" ? "rotate-180" : ""
                }`}
              ></i>
            </button>
            {openAccordion === "weeklyRhythm" && (
              <div className="px-5 pb-4">
                <ul className="list-disc mt-2">
                  <li>Mon/Wed/Fri → Coding & Automation</li>
                  <li>Tue/Thu → Marketing & Content</li>
                  <li>Sat → BMI Ops Project</li>
                  <li>Sun → Strategy / Review</li>
                </ul>
              </div>
            )}
          </div>

          {/* Phases by Year Accordion */}
          <div className="border-b border-zinc-600">
            <button 
              className="w-full flex justify-between items-center py-4 text-left font-semibold"
              onClick={() => toggleAccordion("phasesByYear")}
            >
              <span>Phases by year</span>
              <i 
                className={`fas fa-chevron-down transition-transform duration-300 ${
                  openAccordion === "phasesByYear" ? "rotate-180" : ""
                }`}
              ></i>
            </button>
            {openAccordion === "phasesByYear" && (
              <div className="pb-4">
                <ol className="mt-2">
                  {PHASES.map((phase) => (
                    <li key={phase.year} className="mb-2">
                      <strong>{phase.year}.</strong> {phase.title}
                    </li>
                  ))}
                </ol>
                <small className="muted">
                  You can tweak curriculum/phase text inside this file later.
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}