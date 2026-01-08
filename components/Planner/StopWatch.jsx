"use client";

import { useEffect, useRef, useState } from "react";

export default function StopwatchWrapper() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && open) {
      intervalRef.current = setInterval(() => {
        setTime((t) => t + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, open]);

  const reset = () => {
    setRunning(false);
    setTime(0);
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}.${String(centiseconds).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Open Button */}
      <button
        onClick={() => setOpen(true)}
        className="btn px-4 py-2  font-medium"
      >
        Open Stopwatch
      </button>

      {/* Stopwatch */}
      {open && (
        <div className="card flex flex-col items-center gap-6 p-6 rounded-xl absolute z-10">
          <div className="font-mono text-4xl tabular-nums select-none">
            {formatTime(time)}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setRunning(true)}
              disabled={running}
              className="btn px-4 py-2 font-medium disabled:opacity-50"
            >
              Start
            </button>

            <button
              onClick={() => setRunning(false)}
              disabled={!running}
              className="btn px-4 py-2  font-medium disabled:opacity-50"
            >
              Pause
            </button>

            <button
              onClick={reset}
              className="btn px-4 py-2 font-medium"
            >
              Reset
            </button>

            <button
              onClick={() => {
                setRunning(false);
                setOpen(false);
              }}
              className="btn px-4 py-2 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
