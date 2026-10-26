import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaChartPie,
  FaTasks,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaUser,
  FaChartLine,
  FaTimes,
  FaCheckDouble,
  FaFire,
  FaLayerGroup,
} from "react-icons/fa";
import { useTasks, CATEGORIES } from "../context/TaskContext";

const CATEGORY_COLORS = {
  All: "bg-indigo-400",
  Work: "bg-blue-400",
  Personal: "bg-emerald-400",
  Design: "bg-purple-400",
  Urgent: "bg-rose-400",
  General: "bg-amber-400",
};

const Sidebar = () => {
  const {
    tasks,
    completedCount,
    profile,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    selectedCategory,
    setSelectedCategory,
  } = useTasks();

  const navigate = useNavigate();
  const location = useLocation();
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  const pendingCount = tasks.filter((t) => t.status !== "completed").length;
  const dailyGoal = profile.dailyGoal || 5;
  const progressPercent = Math.min(Math.round((completedCount / dailyGoal) * 100), 100);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (location.pathname !== "/tasks") {
      navigate("/tasks");
    }
    setMobileSidebarOpen(false);
  };

  const isCategoriesActive =
    location.pathname === "/tasks" && selectedCategory !== "All";

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Aside Container */}
      <aside
        className={`fixed md:static top-0 bottom-0 left-0 z-50 w-72 bg-slate-950/95 md:bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <FaCheckDouble className="text-white text-lg" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                  FocusBoard
                </span>
                <span className="block text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">
                  Workspace
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 text-slate-400 hover:text-white md:hidden rounded-lg hover:bg-slate-900"
            >
              <FaTimes />
            </button>
          </div>

          {/* MAIN MENU */}
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
              Main Menu
            </p>
            <nav className="space-y-1">
              {/* Dashboard */}
              <NavLink
                to="/"
                end
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <FaChartPie className="text-base" />
                  <span>Dashboard</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                  Overview
                </span>
              </NavLink>

              {/* Tasks */}
              <NavLink
                to="/tasks"
                onClick={() => {
                  setSelectedCategory("All");
                  setMobileSidebarOpen(false);
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                    isActive && selectedCategory === "All"
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <FaTasks className="text-base" />
                  <span>Tasks</span>
                </div>
                {pendingCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    {pendingCount}
                  </span>
                )}
              </NavLink>

              {/* Categories with Collapsible Dropdown */}
              <div>
                <button
                  type="button"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                    isCategoriesActive
                      ? "text-indigo-300 bg-indigo-600/10 font-semibold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {categoriesOpen ? (
                      <FaFolderOpen className="text-base text-indigo-400" />
                    ) : (
                      <FaFolder className="text-base text-indigo-400" />
                    )}
                    <span>Categories</span>
                  </div>
                  <FaChevronDown
                    className={`text-[10px] text-slate-400 transition-transform duration-200 ${
                      categoriesOpen ? "transform rotate-180 text-indigo-300" : ""
                    }`}
                  />
                </button>

                {/* Sub-categories Dropdown List */}
                {categoriesOpen && (
                  <div className="pl-4 pr-1 mt-1 space-y-1 animate-fade-in border-l border-slate-800/80 ml-5">
                    {CATEGORIES.map((cat) => {
                      const count =
                        cat === "All"
                          ? tasks.length
                          : tasks.filter((t) => t.category === cat).length;
                      const isCatSelected =
                        location.pathname === "/tasks" && selectedCategory === cat;
                      const dotColor = CATEGORY_COLORS[cat] || "bg-indigo-400";

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryClick(cat)}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                            isCatSelected
                              ? "bg-indigo-600/20 text-indigo-200 border border-indigo-500/30 font-semibold"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0`} />
                            <span className="truncate">{cat === "All" ? "All Categories" : cat}</span>
                          </div>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded ${
                              isCatSelected
                                ? "bg-indigo-500/30 text-indigo-200 font-bold"
                                : "bg-slate-800/80 text-slate-400"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* SETTINGS SECTION */}
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
              Settings
            </p>
            <nav className="space-y-1">
              {/* Profile & Analytics Combined */}
              <NavLink
                to="/profile"
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <FaUser className="text-base text-indigo-400" />
                  <span>Profile & Analytics</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  Settings
                </span>
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Daily Goal Target Card & User Mini Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex-shrink-0">
          <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <FaFire className="text-amber-400" /> Daily Target
              </span>
              <span className="text-indigo-300 font-bold">
                {completedCount}/{dailyGoal}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              {progressPercent >= 100
                ? "🎉 Target reached! Keep crushing it!"
                : `${dailyGoal - completedCount} more tasks to hit goal`}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

