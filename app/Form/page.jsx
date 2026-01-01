"use client";

import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function GoalForm() {
  const [form, setForm] = useState({
    field: "Technology",
    currentSkill: "Beginner",
    focusArea: "Skills",
    learningGoals: "",
    actionPlans: "",
    buildingProjects: "",
    productivityGoals: "",
    duration: "1",
    timeAllocation: "",
    interests: [],
    strengths: "",
    weaknesses: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const err = {};
    if (!form.learningGoals.trim())
      err.learningGoals = "Please enter your learning goals.";
    if (!form.actionPlans.trim())
      err.actionPlans = "Please enter your action plans.";
    if (!form.currentSkill.trim())
      err.currentSkill = "Please select your current skill level.";
    if (!form.focusArea.trim()) err.focusArea = "Please select a focus area.";
    if (!form.buildingProjects.trim())
      err.buildingProjects = "Please describe what you want to build.";
    if (!form.productivityGoals.trim())
      err.productivityGoals = "Please add productivity goals.";
    if (!form.timeAllocation.trim())
      err.timeAllocation = "Please state hours per week you can dedicate.";
    if (form.timeAllocation && isNaN(Number(form.timeAllocation)))
      err.timeAllocation = "Please enter a number.";
    return err;
  }
  async function handleSubmit(e) {
  e.preventDefault();
  const err = validate();
  setErrors(err);
  if (Object.keys(err).length) return;
  try {
    const res = await fetch(`${API_BASE}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
      
    });

    if (res.ok) {
           window.location.href = "/planner";
      setTimeout(() => setShowModal(false), 3500);
    } else {
      console.error("Failed to save:", await res.json());
    }
  } catch (error) {
    console.error(error);
  }
}

  function handleTagKeyDown(e) {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (!form.interests.includes(tag)) {
        setForm((prev) => ({ ...prev, interests: [...prev.interests, tag] }));
      }
      e.target.value = "";
    }
  }

  function removeTag(tag) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.filter((t) => t !== tag),
    }));
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060606] font-[manrope] text-white p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-8 shadow-2xl"
      >
        <h1 className="text-2xl font-semibold mb-4">
          Goals & Plan — Quick Form
        </h1>
        <p className="text-sm text-white/70 mb-6">
          Fill the fields below with honest, concise answers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-white/80">Field Identification</span>
            <select
              name="field"
              value={form.field}
              onChange={handleChange}
              className="mt-2 w-full rounded-md px-3 py-2 bg-zinc-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option>Technology</option>
              <option>Business</option>
              <option>Arts</option>
              <option>Education</option>
              <option>Science</option>
              <option>Health</option>
              <option>Finance</option>
              <option>Marketing</option>
              <option>Design</option>
              <option>Engineering</option>
              <option>Gaming</option>
              <option>Writing</option>
              <option>Research</option>
              <option>AI / Machine Learning</option>
              <option>Other</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-white/80">Duration (years)</span>
            <select
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="mt-2 w-full rounded-md px-3 py-2 bg-zinc-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="4">4 years</option>
              <option value="5">5 years</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-white/80">Current Skill Level</span>
            <select
              name="currentSkill"
              value={form.currentSkill}
              onChange={handleChange}
              className="mt-2 w-full rounded-md px-3 py-2 bg-zinc-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            {errors.currentSkill && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.currentSkill}
              </p>
            )}
          </label>
          <label className="block">
            <span className="text-sm text-white/80">Focus Area</span>
            <select
              name="focusArea"
              value={form.focusArea}
              onChange={handleChange}
              className="mt-2 w-full rounded-md px-3 py-2 bg-zinc-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option>Skills</option>
              <option>Projects</option>
              <option>Portfolio</option>
              <option>Job Prep</option>
              <option>Research</option>
            </select>
            {errors.focusArea && (
              <p className="text-xs text-rose-400 mt-1">{errors.focusArea}</p>
            )}
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm text-white/80">Interests (keywords)</span>
            <div className="flex flex-wrap mt-2 gap-2">
              {form.interests.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-white/80 hover:text-red-600"
                  >
                    <AiOutlineClose size={14} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Type and press Enter"
                className="bg-white/6 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/20"
                onKeyDown={handleTagKeyDown}
              />
            </div>
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm text-white/80">Learning Goals</span>
            <textarea
              name="learningGoals"
              value={form.learningGoals}
              onChange={handleChange}
              rows={3}
              placeholder="E.g., Learn React + Next.js, basics of SEO"
              className="mt-2 w-full rounded-lg px-3 py-2 bg-white/6 border border-white/10 resize-y focus:outline-none focus:ring-2 focus:ring-white/20 min-h-20"
            ></textarea>
            {errors.learningGoals && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.learningGoals}
              </p>
            )}
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm text-white/80">Action Plans</span>
            <textarea
              name="actionPlans"
              value={form.actionPlans}
              onChange={handleChange}
              rows={3}
              placeholder="E.g., Build 3 projects, take an SEO course, publish articles"
              className="mt-2 w-full rounded-lg px-3 py-2 bg-white/6 border border-white/10 resize-y focus:outline-none focus:ring-2 focus:ring-white/20 min-h-20"
            ></textarea>
            {errors.actionPlans && (
              <p className="text-xs text-rose-400 mt-1">{errors.actionPlans}</p>
            )}
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm text-white/80">Building Projects</span>
            <textarea
              name="buildingProjects"
              value={form.buildingProjects}
              onChange={handleChange}
              rows={3}
              placeholder="E.g., Personal portfolio site, blog, e-commerce MVP"
              className="mt-2 w-full rounded-lg px-3 py-2 bg-white/6 border border-white/10 resize-y focus:outline-none focus:ring-2 focus:ring-white/20 min-h-20"
            ></textarea>
            {errors.buildingProjects && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.buildingProjects}
              </p>
            )}
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm text-white/80">Productivity Goals</span>
            <textarea
              name="productivityGoals"
              value={form.productivityGoals}
              onChange={handleChange}
              rows={2}
              placeholder="E.g., 5 focused hours/day, automate backups"
              className="mt-2 w-full rounded-lg px-3 py-2 bg-white/6 border border-white/10 resize-y focus:outline-none focus:ring-2 focus:ring-white/20 min-h-20"
            ></textarea>
            {errors.productivityGoals && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.productivityGoals}
              </p>
            )}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2 mt-4">
            <label className="block">
              <span className="text-sm text-white/80">Strengths</span>
              <input
                type="text"
                name="strengths"
                value={form.strengths}
                onChange={handleChange}
                placeholder="Your strengths"
                className="mt-2 w-full rounded-md px-3 py-2 bg-white/6 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </label>
            <label className="block">
              <span className="text-sm text-white/80">Weaknesses</span>
              <input
                type="text"
                name="weaknesses"
                value={form.weaknesses}
                onChange={handleChange}
                placeholder="Your weaknesses"
                className="mt-2 w-full rounded-md px-3 py-2 bg-white/6 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-sm text-white/80">
              Time Allocation (hours/week)
            </span>
            <input
              name="timeAllocation"
              value={form.timeAllocation}
              onChange={handleChange}
              placeholder="e.g., 10"
              className="mt-2 w-full rounded-md px-3 py-2 bg-white/6 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            {errors.timeAllocation && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.timeAllocation}
              </p>
            )}
          </label>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/12 transition"
          >
            Save Goals
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({
                field: "Technology",
                currentSkill: "Beginner",
                focusArea: "Skills",
                learningGoals: "",
                actionPlans: "",
                buildingProjects: "",
                productivityGoals: "",
                duration: "1",
                timeAllocation: "",
                interests: [],
                strengths: "",
                weaknesses: "",
              });
              setErrors({});
            }}
            className="px-4 py-2 rounded-lg bg-white/6 border border-white/10 hover:bg-white/8 transition"
          >
            Reset
          </button>

          <div className="ml-auto text-sm text-white/70">
            Preview:{" "}
            <span className="font-medium">
              {form.field} • {form.duration}yr • {form.timeAllocation || "—"}{" "}
              hrs/wk
            </span>
          </div>
        </div>
{/* 
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 w-80 max-w-sm text-center">
              <h2 className="text-lg font-semibold text-white mb-2">
                Goals Saved!
              </h2>
              <p className="text-sm text-white/70 mb-4">
                Your goals have been saved (demo). Check console for details.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        )} */}
      </form>
    </div>
  );
}
