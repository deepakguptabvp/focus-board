import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUser,
  FaBullseye,
  FaDownload,
  FaCog,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import { useTasks } from "../context/TaskContext";

const pageTitles = {
  "/": { title: "Dashboard Overview", subtitle: "Real-time task performance & insights" },
  "/tasks": { title: "Tasks Workspace", subtitle: "Manage, prioritize and organize all projects" },
  "/profile": { title: "Profile & Analytics", subtitle: "Productivity stats and backup settings" },
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    setMobileSidebarOpen,
    tasks,
    profile,
    searchQuery,
    setSearchQuery,
    completedCount,
    exportData,
  } = useTasks();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentPage = pageTitles[location.pathname] || {
    title: "WorkMatrix",
    subtitle: "Manage your tasks effectively",
  };

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const urgentTasks = tasks.filter(
    (t) =>
      t.status !== "completed" &&
      (t.priority === "high" ||
        (t.dueDate && t.dueDate <= new Date().toISOString().split("T")[0]))
  );

  const dailyGoal = profile.dailyGoal || 5;
  const goalPercent = Math.min(Math.round((completedCount / dailyGoal) * 100), 100);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 text-slate-400 hover:text-white md:hidden rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
          title="Open Menu"
        >
          <FaBars className="text-lg" />
        </button>

        <div>
          <h1 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>{currentPage.title}</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
            {todayStr} • {currentPage.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Search, Notifications & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Search on larger screens */}
        <div className="relative hidden lg:block w-64">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (location.pathname !== "/tasks") {
                navigate("/tasks");
              }
            }}
            placeholder="Quick search tasks..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 hover:border-slate-700 focus:border-indigo-500/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition shadow-inner"
          />
        </div>

        {/* Notification Bell with Matching Glassmorphic Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`relative p-2.5 rounded-xl border transition-all duration-200 ${
              showNotifications
                ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/20"
                : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
            title="Notifications"
          >
            <FaBell className="text-sm" />
            {urgentTasks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-tr from-rose-500 to-pink-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-md shadow-rose-500/50 animate-pulse">
                {urgentTasks.length}
              </span>
            )}
          </button>

          {/* Premium Glassmorphic Notification Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-84 sm:w-96 bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/30 rounded-2xl shadow-2xl shadow-black/80 p-4 z-50 animate-fade-in ring-1 ring-white/10">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-bold text-white tracking-wide">
                    Urgent & Due Tasks
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {urgentTasks.length} pending
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {urgentTasks.length === 0 ? (
                  <div className="py-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2 text-emerald-400">
                      <FaCheckCircle className="text-base" />
                    </div>
                    <p className="text-xs font-semibold text-slate-200">All caught up!</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      No urgent tasks requiring attention right now.
                    </p>
                  </div>
                ) : (
                  urgentTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        navigate("/tasks");
                        setShowNotifications(false);
                      }}
                      className="group p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800/90 border border-slate-700/50 hover:border-indigo-500/40 cursor-pointer transition text-left"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition truncate">
                          {t.title}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border capitalize ${
                            t.priority === "high"
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <FaClock className="text-[9px] text-amber-400" />
                          Due: {t.dueDate || "No deadline"}
                        </span>
                        <span className="text-slate-500 group-hover:text-slate-300">
                          {t.category}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
                <Link
                  to="/tasks"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                >
                  Open in Tasks Workspace →
                </Link>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar with Matching Glassmorphic Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2 border-l border-slate-800 text-left group focus:outline-none"
          >
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className={`w-9 h-9 rounded-xl object-cover ring-2 transition-all duration-200 ${
                  showProfileMenu
                    ? "ring-indigo-400 scale-105 shadow-md shadow-indigo-500/30"
                    : "ring-slate-700/80 group-hover:ring-indigo-500/60"
                }`}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>

            <div className="hidden xl:block">
              <p className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition leading-tight">
                {profile.name}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[110px]">
                {profile.role}
              </p>
            </div>
          </button>

          {/* Premium Glassmorphic Profile Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-64 bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/30 rounded-2xl shadow-2xl shadow-black/80 p-3 z-50 animate-fade-in ring-1 ring-white/10">
              {/* Profile Card Header */}
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 mb-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/40"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{profile.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{profile.email}</p>
                  </div>
                </div>

                {/* Mini Target Progress */}
                <div className="mt-2.5 pt-2 border-t border-slate-700/40">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>Daily Goal</span>
                    <span className="text-indigo-300 font-semibold">
                      {completedCount}/{dailyGoal} tasks ({goalPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${goalPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-indigo-600/15 border border-transparent hover:border-indigo-500/30 transition font-medium"
                >
                  <FaUser className="text-xs text-indigo-400" />
                  <span>Profile & Analytics</span>
                </Link>

                <Link
                  to="/tasks"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-indigo-600/15 border border-transparent hover:border-indigo-500/30 transition font-medium"
                >
                  <FaBullseye className="text-xs text-purple-400" />
                  <span>Tasks Workspace</span>
                </Link>

                <button
                  onClick={() => {
                    exportData();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-indigo-600/15 border border-transparent hover:border-indigo-500/30 transition font-medium text-left"
                >
                  <FaDownload className="text-xs text-emerald-400" />
                  <span>Export Backup (JSON)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
