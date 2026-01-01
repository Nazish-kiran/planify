"use client";

import { useEffect, useState } from "react";
import {
  FiUser,
  FiFolder,
  FiStar,
  FiGitBranch,
  FiExternalLink,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { FaGithub } from "react-icons/fa";

const GH_LAST_KEY = "gh_last_user_v1";
const PROJECTS_KEY = "projects_v1";

export default function GitHubProjects() {
  const [activeTab, setActiveTab] = useState(null);
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projTitle, setProjTitle] = useState("");
  const [projLink, setProjLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const last = localStorage.getItem(GH_LAST_KEY);
    if (last) {
      setUsername(last);
      fetchGitHubUser(last);
    }
    setProjects(loadProjects());
  }, []);

  async function fetchGitHubUser(u) {
    try {
      setError("");
      setProfile(null);
      setRepos([]);

      const userRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(u)}`
      );
      if (!userRes.ok) throw new Error();
      const user = await userRes.json();

      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(
          u
        )}/repos?per_page=100&sort=updated`
      );
      const repoData = reposRes.ok ? await reposRes.json() : [];

      setProfile(user);
      setRepos(repoData);
      localStorage.setItem(GH_LAST_KEY, u);
      setActiveTab("profile");
    } catch {
      setError("GitHub user not found or API rate limit reached.");
    }
  }

  function loadProjects() {
    try {
      return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveProjects(list) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
    setProjects(list);
  }

  function addProject() {
    if (!projTitle) return;
    const list = loadProjects();
    list.unshift({ title: projTitle, link: projLink, done: false });
    saveProjects(list);
    setProjTitle("");
    setProjLink("");
  }

  function toggleDone(idx) {
    const list = loadProjects();
    list[idx].done = !list[idx].done;
    saveProjects(list);
  }

  function deleteProject(idx) {
    const list = loadProjects();
    list.splice(idx, 1);
    saveProjects(list);
  }

  function toggleTab(tab) {
    setActiveTab(activeTab === tab ? null : tab);
  }

  return (
    <div className="card mt-4">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaGithub className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold ">GitHub & Projects</h2>
              <p className="text-sm mb-2">
                Explore profiles and track personal projects
              </p>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-3 mt-4">
          {/* Profile Accordion */}
          <div className="border border-gray-200 rounded-lg">
            <button
              className={`flex items-center justify-between w-full px-4 py-3 text-left `}
              onClick={() => toggleTab("profile")}
            >
              <div className="flex items-center gap-2">
                <FiUser className="w-4 h-4" />
                <span className="font-medium">GitHub Profile</span>
              </div>
              {activeTab === "profile" ? (
                <FiChevronUp className="w-5 h-5 " />
              ) : (
                <FiChevronDown className="w-5 h-5 " />
              )}
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ${
                activeTab === "profile" ? "max-h-[2000px]" : "max-h-0"
              }`}
            >
              <div className="p-4 px-0 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      className=" pr-4 w-full border border-gray-300 rounded-lg outline-none transition "
                      type="text"
                      style={{paddingLeft:'24px'}}
                      placeholder="GitHub username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition"
                    onClick={() => fetchGitHubUser(username)}
                  >
                    Load
                  </button>
                </div>

                <div className="px-4 put-6">
                  {!profile && (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <FaGithub className="w-8 h-8 text-gray-400" />
                      </div>
                      <p>
                        {error ||
                          "Enter a GitHub username and click Load to see profile"}
                      </p>
                    </div>
                  )}

                  {profile && (
                    <div className="space-y-6">
                      {/* Profile Header */}
                      <div className="flex items-start gap-4 pt-2">
                        <img
                          src={profile.avatar_url}
                          alt={`${profile.login}'s avatar`}
                          className="w-20 h-20 rounded-xl border-2 border-gray-200 shadow-sm"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold ">
                                {profile.name || profile.login}
                              </h3>
                            </div>
                            <a
                              href={profile.html_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-1 py-1.5 hover:bg-gray-200 rounded-lg text-sm font-medium transition whitespace-nowrap"
                            >
                              <FaGithub className="w-4 h-4" />
                              View on GitHub
                            </a>
                          </div>
                        </div>
                      </div>
                      <p className=" mt-1">{profile.bio}</p>

                      <div className="flex flex-wrap gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="font-semibold">{profile.followers}</div>
                          <span>Followers</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="font-semibold">{profile.following}</div>
                          <span>Following</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="font-semibold">{profile.public_repos}</div>
                          <span>Repositories</span>
                        </div>
                      </div>

                      {/* Repositories Section */}
                      <div className="border-t border-gray-200 pt-2">
                        <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          <FiFolder className="w-5 h-5" />
                          Recent Repositories
                        </h4>

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-current">
                          {repos.slice(0, 10).map((r) => (
                            <div
                              key={r.id}
                              className="group px-2 py-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <a
                                      href={r.html_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="font-semibold  hover:text-blue-600 truncate transition"
                                    >
                                      {r.name}
                                    </a>
                                    {r.private && (
                                      <span className="px-2 py-0.5 text-xs bg-gray-100  rounded">
                                        Private
                                      </span>
                                    )}
                                  </div>
                                  <p className=" text-sm line-clamp-2 mb-3">
                                    {r.description}
                                  </p>

                                  <div className="flex flex-wrap gap-4 text-sm ">
                                    <div className="flex items-center gap-1">
                                      <FiStar className="w-4 h-4" />
                                      <span>{r.stargazers_count}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FiGitBranch className="w-4 h-4" />
                                      <span>{r.forks_count}</span>
                                    </div>
                                    {r.language && (
                                      <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <span>{r.language}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <a
                                  href={r.html_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition"
                                >
                                  <FiExternalLink className="w-5 h-5" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Projects Accordion */}
          <div className="border border-gray-200 rounded-lg">
            <button
              className={`flex items-center justify-between w-full px-4 py-3 text-left `}
              onClick={() => toggleTab("projects")}
            >
              <div className="flex items-center gap-2">
                <FiFolder className="w-4 h-4" />
                <span className="font-medium">My Projects ({projects.length})</span>
              </div>
              {activeTab === "projects" ? (
                <FiChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ${
                activeTab === "projects" ? "max-h-[2000px]" : "max-h-0"
              }`}
            >
              <div className="p-4 pt-2 border-t border-gray-200">
                <div className="space-y-6">
                  {/* Add Project Form */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2 pt-2">
                      <FiPlus className="w-4 h-4" />
                      Add New Project
                    </h4>
                    <div>
                      <input
                        className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none  mb-2 w-full"
                        placeholder="Project title *"
                        value={projTitle}
                        onChange={(e) => setProjTitle(e.target.value)}
                      />
                      <input
                        className="px-4 py-2.5 border border-gray-300 rounded-lg mb-2 outline-none w-full"
                        placeholder="GitHub repo URL (optional)"
                        value={projLink}
                        onChange={(e) => setProjLink(e.target.value)}
                      />
                      <button
                        className="px-4 py-2.5 btn rounded-lg hover:bg-blue-700 active:bg-blue-800 font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
                        onClick={addProject}
                        disabled={!projTitle}
                      >
                        <FiPlus className="w-5 h-5" />
                        Add Project
                      </button>
                    </div>
                  </div>

                  {/* Projects List */}
                  <div>
                    <h4 className="text-lg font-semibold  mb-4">
                      My Projects ({projects.length})
                    </h4>

                    {projects.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl mb-3">
                        <FiFolder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">
                          No projects yet. Add your first project above!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {projects.map((p, idx) => (
                          <div
                            key={idx}
                            className={`p-4 border rounded-xl transition-all ${
                              p.done
                                ? "border-green-200 bg-green-50"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                  <h5
                                    className={`font-medium truncate ${
                                      p.done
                                        ? "text-green-700 line-through"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {p.title}
                                  </h5>
                                  {p.done && (
                                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                                      Completed
                                    </span>
                                  )}
                                </div>

                                {p.link && (
                                  <a
                                    href={p.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition truncate"
                                  >
                                    <FaGithub className="w-4 h-4 shrink-0" />
                                    <span className="truncate">{p.link}</span>
                                  </a>
                                )}
                              </div>

                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => toggleDone(idx)}
                                  className={`px-3 py-1.5 rounded-lg font-medium text-sm flex items-center gap-2 transition ${
                                    p.done
                                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  <FiCheck className="w-4 h-4" />
                                  {p.done ? "Done" : "Mark"}
                                </button>
                                <button
                                  onClick={() => deleteProject(idx)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Delete project"
                                >
                                  <FiTrash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}