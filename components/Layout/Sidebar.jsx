"use client";
import { useState } from "react";
import StudyResources from "../Planner/StudyResources";
import GitHubProjects from "../Planner/GithubProfileShowcase";

export default function Sidebar({ progressData }) {
  const [openAccordion, setOpenAccordion] = useState("weeklyRhythm");

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };
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
      <GitHubProjects/>
      <StudyResources/>
    </div>
  );
}