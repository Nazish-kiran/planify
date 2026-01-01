import { useEffect, useState, useCallback } from "react";

export default function ScheduleInfoModal({ open, onClose }) {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = useCallback((key) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  }, []);

  const PHASES = [
    { year: 1, title: "Foundation: Code + Web + SEO (Own Pakistan)" },
    { year: 2, title: "Brand & Sales Engine (Nationwide)" },
    { year: 3, title: "E‑commerce & Export Entry" },
    { year: 4, title: "AI Forecasting & International Marketing" },
    { year: 5, title: "Scale, Funding & Ops Excellence" },
  ];

  // Close modal on ESC key
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center  p-4"
      onClick={onClose}
    >
      <div
        className="btn w-full max-w-xl rounded-xl p-6 max-h-[80vh] overflow-y-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">How it schedules your days</h1>
          <button onClick={onClose} className="text-xl">
            ✕
          </button>
        </div>

        {/* Weekly Rhythm Accordion */}
        <div className="border-b border-zinc-300">
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
              <ul className="list-disc mt-2 space-y-1">
                <li>Mon / Wed / Fri → Coding & Automation</li>
                <li>Tue / Thu → Marketing & Content</li>
                <li>Sat → BMI Ops Project</li>
                <li>Sun → Strategy / Review</li>
              </ul>
            </div>
          )}
        </div>

        {/* Phases by Year Accordion */}
        <div className="border-b border-zinc-300">
          <button
            className="w-full flex justify-between items-center py-4 text-left font-semibold"
            onClick={() => toggleAccordion("phasesByYear")}
          >
            <span>Phases by year</span>
            <span
              className={`fas fa-chevron-down transition-transform duration-300 ${
                openAccordion === "phasesByYear" ? "rotate-180" : ""
              }`}
            ></span>
          </button>

          {openAccordion === "phasesByYear" && (
            <div className="pb-4">
              <ol className="mt-2 space-y-2">
                {PHASES.map((phase) => (
                  <li key={phase.year}>
                    <strong>{phase.year}.</strong> {phase.title}
                  </li>
                ))}
              </ol>
              <p className="block mt-3 text-sm">
                You can tweak curriculum or phase text later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
