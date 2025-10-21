"use client";

export default function Progress({ progressData }) {
  const { completed = 0, percentage = 0 } = progressData || {};

  return (
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
  );
}