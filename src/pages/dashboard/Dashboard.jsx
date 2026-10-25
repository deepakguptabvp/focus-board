import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTasks,
  FaCheckCircle,
  FaSpinner,
  FaExclamationCircle,
  FaPlus,
  FaArrowRight,
  FaFire,
  FaCalendarDay,
  FaQuestionCircle,
} from "react-icons/fa";
import { useTasks } from "../../context/TaskContext";
import TaskCard from "../../components/TaskCard";
import CustomSelect from "../../components/CustomSelect";

const Dashboard = () => {
  const {
    tasks,
    allTasksCount,
    completedCount,
    inProgressCount,
    overdueCount,
    completionRate,
    profile,
    openCreateModal,
    addTask,
  } = useTasks();

  const [quickTitle, setQuickTitle] = useState("");
  const [quickPriority, setQuickPriority] = useState("medium");
  const [quickCategory, setQuickCategory] = useState("Work");

  // Determine greeting based on current hour
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Handle instant quick add
  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    addTask({
      title: quickTitle.trim(),
      description: "",
      priority: quickPriority,
      category: quickCategory,
      status: "todo",
      dueDate: new Date().toISOString().split("T")[0],
      subtasks: [],
    });

    setQuickTitle("");
  };

  // Newest tasks appear at the very top (sabse upar)
  const dashboardTasks = [...tasks]
    .filter((t) => t.status !== "completed")
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);

  return (
    <div className="p-4 sm:p-8 mx-auto space-y-8 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <FaFire className="text-amber-400 animate-pulse" />
              <span>Ready for high productivity</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {greeting}, {profile.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              You have completed <span className="font-bold text-emerald-400">{completedCount}</span> out of{" "}
              <span className="font-bold text-white">{allTasksCount} tasks</span>. Overall completion rate is{" "}
              <span className="font-bold text-indigo-400">{completionRate}%</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openCreateModal()}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-indigo-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <FaPlus className="text-xs" />
              <span>Create Task</span>
            </button>

            <Link
              to="/tasks"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition hover:border-slate-600"
            >
              <span>View All Tasks</span>
              <FaArrowRight className="text-xs text-indigo-400" />
            </Link>
          </div>
        </div>

        {/* Ambient background glow circles */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Tasks */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tasks</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FaTasks className="text-sm" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{allTasksCount}</p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="text-indigo-400 font-medium">{allTasksCount - completedCount} active</span> in backlog
          </p>
        </div>

        {/* In Progress */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">In Progress</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FaSpinner className="text-sm animate-spin" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{inProgressCount}</p>
          <p className="text-xs text-slate-400 mt-1">Currently being worked on</p>
        </div>

        {/* Completed */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FaCheckCircle className="text-sm" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{completedCount}</p>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-[11px] text-emerald-400 mt-1.5 font-medium">{completionRate}% finished</p>
        </div>

        {/* Overdue / Urgent */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overdue Tasks</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <FaExclamationCircle className="text-sm" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-rose-400 mt-3">{overdueCount}</p>
          <p className="text-xs text-slate-400 mt-1">
            {overdueCount > 0 ? "Requires immediate attention" : "Great job! Zero overdue tasks"}
          </p>
        </div>
      </div>

      {/* Quick Instant Task Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <FaPlus className="text-xs text-indigo-400" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">
            Fast Add Task
          </h2>
        </div>
        <form onSubmit={handleQuickAdd} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Type a task name and hit Enter (e.g. Schedule meeting with UX team)..."
            className="flex-1 px-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
          />

          <div className="flex items-center gap-2">
            <CustomSelect
              value={quickPriority}
              onChange={setQuickPriority}
              options={[
                { value: "high", label: "High Priority" },
                { value: "medium", label: "Medium Priority" },
                { value: "low", label: "Low Priority" },
              ]}
              className="py-2.5"
            />

            <CustomSelect
              value={quickCategory}
              onChange={setQuickCategory}
              options={["Work", "Development", "Design", "Personal", "Health"]}
              className="py-2.5"
            />

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 whitespace-nowrap"
            >
              <FaPlus className="text-xs" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recent & Active Tasks Full-Width Section */}
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <FaCalendarDay className="text-indigo-400" />
              <h2 className="text-sm sm:text-base font-bold text-white">Recent & Active Tasks</h2>
            </div>

            {/* Productivity Tip Heading with Question Mark Hover Tooltip */}
            <div className="relative group/tip cursor-pointer">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-indigo-300 text-xs font-semibold transition">
                <span>💡 Productivity Tip</span>
                <button
                  type="button"
                  className="text-indigo-400 group-hover/tip:text-white p-0.5 rounded-full hover:bg-indigo-500/30 transition focus:outline-none"
                  title="Hover to view tip"
                >
                  <FaQuestionCircle className="text-xs" />
                </button>
              </div>

              {/* Hover Tooltip showing description */}
              <div className="absolute left-0 top-full mt-2 hidden group-hover/tip:block w-72 sm:w-80 p-3.5 bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/40 rounded-xl shadow-2xl shadow-black/90 z-50 text-xs text-slate-300 leading-relaxed ring-1 ring-white/10 animate-fade-in pointer-events-none">
                <p className="font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                  <span>💡 Smart Workflow Strategy</span>
                </p>
                Break down larger tasks into smaller subtasks! Completing each subtask keeps momentum going and unlocks instant celebratory feedback.
              </div>
            </div>
          </div>

          <Link
            to="/tasks"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 self-end sm:self-auto transition"
          >
            <span>See all ({tasks.length})</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        <div className="space-y-3">
          {dashboardTasks.length === 0 ? (
            <div className="py-8 text-center">
              <FaCheckCircle className="text-emerald-400 text-3xl mx-auto mb-2" />
              <p className="text-slate-300 text-sm font-medium">All caught up!</p>
              <p className="text-slate-500 text-xs mt-1">No pending tasks right now. Add one above!</p>
            </div>
          ) : (
            dashboardTasks.map((task) => <TaskCard key={task.id} task={task} layout="list" />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
