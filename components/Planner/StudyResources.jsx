"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTimes, FaPlay, FaExternalLinkAlt, FaBook, FaLink } from "react-icons/fa";

const STUDY_KEY = "bmi_study_resources_v1";
const VIDEO_PROGRESS_KEY = "bmi_video_progress_v1";

export default function StudyResources() {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // new state for sorting

  const loadFromStorage = (key, defaultVal) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const saveToStorage = (key, val) =>
    localStorage.setItem(key, JSON.stringify(val));

  useEffect(() => {
    setResources(loadFromStorage(STUDY_KEY, []));
  }, []);

  const sortedResources = [...resources].sort((a, b) => {
    if (sortBy === "alpha") {
      return (a.title || a.url).localeCompare(b.title || b.url);
    }
    // default: recent added
    return 0;
  });

  const getVideoProgress = (videoId) =>
    loadFromStorage(VIDEO_PROGRESS_KEY, {})[videoId] || 0;

  const setVideoProgress = (videoId, seconds) => {
    const progress = loadFromStorage(VIDEO_PROGRESS_KEY, {});
    progress[videoId] = Math.floor(seconds);
    saveToStorage(VIDEO_PROGRESS_KEY, progress);
  };

  const normalizeUrl = (raw) => {
    const input = (raw || "").trim();
    if (!input) return null;

    if (/youtube\.com|youtu\.be/.test(input))
      return input.includes("://") ? input : "https://" + input;
    if (/^[a-zA-Z0-9_-]{11}$/.test(input))
      return `https://www.youtube.com/watch?v=${input}`;

    const isSearch =
      /\s/.test(input) ||
      (!input.includes(".") &&
        !/^https?:\/\//.test(input) &&
        !input.startsWith("www"));
    if (isSearch)
      return `https://duckduckgo.com/?q=${encodeURIComponent(input)}`;

    try {
      return new URL(
        input.includes("://")
          ? input
          : input.startsWith("www.")
          ? "https://" + input
          : "https://" + input
      ).href;
    } catch {
      return `https://duckduckgo.com/?q=${encodeURIComponent(input)}`;
    }
  };

  const extractYouTubeVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\s?]+)/
    );
    return match ? match[1] : null;
  };

  const isBlockedPlatform = (url) =>
    [
      "edx",
      "coursera",
      "udemy",
      "pluralsight",
      "datacamp",
      "skillshare",
      "linkedin",
    ].some((p) => url.toLowerCase().includes(p));

  const getResourceIcon = (url) => {
    if (!url) return FaLink;

    const lowerUrl = url.toLowerCase();

    if (
      lowerUrl.includes("youtube") ||
      lowerUrl.includes("youtu.be") ||
      lowerUrl.includes("vimeo") ||
      lowerUrl.includes("dailymotion")
    )
      return FaPlay;

    if (
      lowerUrl.includes("edx") ||
      lowerUrl.includes("coursera") ||
      lowerUrl.includes("udemy") ||
      lowerUrl.includes("khanacademy") ||
      lowerUrl.includes("pluralsight") ||
      lowerUrl.includes("datacamp") ||
      lowerUrl.includes("skillshare") ||
      lowerUrl.includes("linkedin")
    )
      return FaBook;

    return FaExternalLinkAlt;
  };

  const addResource = () => {
    if (!title) return alert("Please enter a resource name");
    if (!url) return alert("Please paste a link or search term");

    const normalized = normalizeUrl(url);
    if (!normalized) return alert("Please paste a valid URL or search term");

    const list = [{ title, url: normalized }, ...resources];
    setResources(list);
    saveToStorage(STUDY_KEY, list);
    setTitle("");
    setUrl("");
    setShowForm(false);
  };

  const removeResource = (idx) => {
    const list = resources.filter((_, i) => i !== idx);
    setResources(list);
    saveToStorage(STUDY_KEY, list);
  };

  const openStudyResource = (item) => {
    const url = item.url || item;
    if (!url) return;

    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      const savedProgress = getVideoProgress(videoId);

      const iframeModal = document.createElement("div");
      iframeModal.className =
        "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm";
      iframeModal.innerHTML = `
        <div class="w-[95%] h-[95%] max-w-4xl bg-[var(--dayCard-color)] rounded-xl overflow-hidden flex flex-col shadow-2xl">
          <div class="px-5 py-4 bg-[var(--muted)] flex justify-between items-center border-b border-[var(--border)]">
            <div class="font-semibold flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-base pr-3">${
              item.title || "YouTube Video"
            }</div>
            <small id="progressDisplay" class="text-[var(--muted)] mr-3 text-sm font-medium"></small>
            <button id="closeIframeBtn" class="btn small px-4 py-2 text-sm rounded">Close</button>
          </div>
          <iframe id="studyFrame" src="https://www.youtube.com/embed/${videoId}?autoplay=1&start=${savedProgress}" class="flex-1 border-0 bg-[var(--brand)]" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      `;
      document.body.appendChild(iframeModal);

      const iframe = iframeModal.querySelector("#studyFrame");
      const progressDisplay = iframeModal.querySelector("#progressDisplay");
      const closeBtn = iframeModal.querySelector("#closeIframeBtn");

      const interval = setInterval(() => {
        try {
          const currentTime =
            iframe.contentWindow.document.querySelector("video")?.currentTime ||
            0;
          if (currentTime > 0) {
            setVideoProgress(videoId, currentTime);
            const mins = Math.floor(currentTime / 60);
            const secs = Math.floor(currentTime % 60);
            progressDisplay.textContent = `${mins}:${secs
              .toString()
              .padStart(2, "0")}`;
          }
        } catch {}
      }, 5000);

      const cleanup = () => {
        clearInterval(interval);
        iframeModal.remove();
      };

      closeBtn.addEventListener("click", cleanup);
      const escHandler = (e) => {
        if (e.key === "Escape") {
          cleanup();
          document.removeEventListener("keydown", escHandler);
        }
      };
      document.addEventListener("keydown", escHandler);
      return;
    }

    if (isBlockedPlatform(url)) window.open(url, "_blank");
    else window.open(url, "_blank");
  };

  return (
    <div className="card mt-4 rounded-xl overflow-hidden">
      {/* Header with Sort */}
      <div className="head flex items-center justify-between px-5 py-3 border-b border-[var(--border)] ">
        <h2 className="m-0 text-xl font-semibold">Study Resources</h2>
        <select
          className="p-2 rounded-lg bg-[var(--brand)] text-[var(--sub)] text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">Recently Added</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </div>

      <div className="body p-5">
        {showForm ? (
          <div className="block p-5 bg-[var(--brand)] rounded-xl border border-[var(--border)] mb-5 shadow-sm">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--brand)] text-[var(--sub)] text-[15px] leading-normal transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
              placeholder="Resource name (e.g., Python Basics, NLP Tutorial)"
            />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addResource()}
              className="w-full mb-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--brand)] text-[var(--sub)] text-[15px] leading-normal transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
              placeholder="Paste YouTube, edX, Coursera, Udemy, or any course link..."
            />
            <div className="flex gap-3 mt-2">
              <button
                className="btn flex-1 p-3 rounded-lg text-[15px] font-medium transition-all duration-200"
                onClick={addResource}
              >
                Save Resource
              </button>
              <button
                className="btn ghost flex-1 p-3 rounded-lg text-[15px] font-medium transition-all duration-200"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="btn flex items-center justify-center gap-3 w-full mb-5 p-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 border border-[var(--border)]"
            onClick={() => setShowForm(true)}
          >
            <FaPlus className="text-sm" /> Add Resource
          </button>
        )}

        <div className="flex flex-col gap-2.5 max-h-80 overflow-auto scrollbar-thin scrollbar-thumb-[var(--border)]">
          {sortedResources.map((item, idx) => {
            const IconComponent = getResourceIcon(item.url);
            return (
              <div
                key={idx}
                className="flex justify-between items-center gap-3 px-3 py-1.5 bg-[var(--brand)] rounded-xl border border-[var(--border)] transition-all duration-200 cursor-pointer"
                onClick={() => openStudyResource(item)}
              >
                <div
                  className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-medium text-[var(--text)] flex items-center gap-2.5"
                  title={item.title || item.url}
                >
                  <IconComponent className="text-xs text-[var(--muted)] flex-shrink-0" />
                  <span className="overflow-hidden text-ellipsis">
                    {item.title || item.url}
                  </span>
                </div>
                <button
                  className="p-2 text-s text-red-500 rounded bg-transparent border border-transparent transition-all duration-200 flex-shrink-0 hover:bg-red-500/10"
                  title="Delete this resource"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeResource(idx);
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            );
          })}
        </div>

        {resources.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center p-10 text-[var(--muted)] border-2 border-dashed border-[var(--border)] rounded-xl mt-3 bg-[var(--brand)]">
            <div className="text-5xl mb-4 opacity-70"></div>
            <div className="text-[15px] font-medium mb-2">
              No study resources yet
            </div>
            <small className="text-sm leading-normal">
              Add your first resource to start learning
            </small>
          </div>
        )}
      </div>
    </div>
  );
}
