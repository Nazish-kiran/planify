"use client";
import { useState } from "react";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import Calendar from "@/components/Planner/Calender";
import TaskList from "@/components/Planner/TaskList";
import Heatmap from "@/components/Planner/Heatmap";

import "./planner.css";
import "../../styles/Themes/dark.css";
import "../../styles/Themes/light.css";
import "../../styles/Themes/ocean.css";
import "../../styles/Themes/forest.css";
import "../../styles/Themes/sunset.css";
import "../../styles/Themes/royal.css";
import "../../styles/Themes/cyber.css";
import StudyResources from "@/components/Planner/StudyResources";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [progressData, setProgressData] = useState({
    completed: 0,
    percentage: 0,
    dayProgress: {},
  });

  const handleProgressUpdate = (progress) => {
    setProgressData(progress);
  };

  return (
    <div className="app">
      <Header />
      <div className="grid">
        <div className="col">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            dayProgress={progressData.dayProgress}
          />
          <TaskList
            selectedDate={selectedDate}
            onProgressUpdate={handleProgressUpdate}
          />
        </div>
        <Sidebar progressData={progressData} />
        {/* <StudyResources /> */}
      </div>

      <Heatmap progressData={progressData} />
    </div>
  );
}
