import React, { useState } from "react";
import {
  FaCheck,
  FaCalendarAlt,
  FaEllipsisV,
  FaPen,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useTasks } from "../context/TaskContext";
import CustomSelect from "./CustomSelect";

const priorityStyles = {
  high: {
    bg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    dot: "bg-rose-500",
  },
  medium: {
    bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
  },
  low: {
    bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
};

const categoryColors = {
  Work: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Development: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  Design: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  Personal: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  Health: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const TaskCard = ({ task, layout = "card" }) => {
  const { toggleTaskStatus, moveTaskStatus, toggleSubtask, openEditModal, deleteTask } = useTasks();
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isCompleted = task.status === "completed";
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const subtaskProgress =
    subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  // Due Date calculation
  const todayStr = new Date().toISOString().split("T")[0];
  const isOverdue = !isCompleted && task.dueDate && task.dueDate < todayStr;
  const isDueToday = !isCompleted && task.dueDate && task.dueDate === todayStr;

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr === todayStr) return "Today";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const pConfig = priorityStyles[task.priority] || priorityStyles.medium;
  const cBadge = categoryColors[task.category] || "bg-slate-700/50 text-slate-300 border-slate-600";

  if (layout === "list") {
    return (
      <div
        className={`group relative rounded-xl border p-4 transition-all duration-200 flex flex-col focus-within:z-30 hover:z-20 ${
          isCompleted
            ? "bg-slate-900/40 border-slate-800/80 opacity-75"
            : "bg-slate-800/50 hover:bg-slate-800/80 border-slate-700/60 hover:border-slate-600 shadow-sm hover:shadow-md"
        }`}
      >
        {/* Main Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 w-full">
          {/* Left: Checkbox + Title + Description */}
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            {/* Complete Toggle Checkbox */}
            <button
              onClick={() => toggleTaskStatus(task.id)}
              className={`mt-0.5 sm:mt-0 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition border ${
                isCompleted
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "border-slate-600 hover:border-indigo-400 bg-slate-800 text-transparent hover:text-indigo-400"
              }`}
              title={isCompleted ? "Mark as pending" : "Mark as completed"}
            >
              <FaCheck className="text-xs" />
            </button>

            {/* Title & Description */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`text-sm sm:text-base font-semibold ${
                    isCompleted ? "line-through text-slate-400" : "text-slate-100"
                  }`}
                >
                  {task.title}
                </span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${cBadge}`}>
                  {task.category}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border capitalize ${pConfig.bg}`}>
                  {task.priority}
                </span>
              </div>

              {task.description && (
                <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
              )}
            </div>
          </div>

          {/* Right: Info & Actions */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto flex-shrink-0 flex-wrap">
            {/* Subtasks pill */}
            {subtasks.length > 0 && (
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition ${
                  showSubtasks
                    ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40"
                    : "text-slate-400 hover:text-slate-200 bg-slate-700/40 border-slate-700"
                }`}
              >
                <span>
                  {completedSubtasks}/{subtasks.length} subtasks
                </span>
                {showSubtasks ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
              </button>
            )}

            {/* Due date */}
            {task.dueDate && (
              <div
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border font-medium ${
                  isOverdue
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse"
                    : isDueToday
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    : "bg-slate-700/30 border-slate-700 text-slate-300"
                }`}
              >
                {isOverdue ? <FaExclamationTriangle className="text-[10px]" /> : <FaCalendarAlt className="text-[10px]" />}
                <span>{formatDueDate(task.dueDate)}</span>
              </div>
            )}

            {/* Quick status button */}
            <CustomSelect
              value={task.status}
              onChange={(newStatus) => moveTaskStatus(task.id, newStatus)}
              options={[
                { value: "todo", label: "To Do" },
                { value: "in_progress", label: "In Progress" },
                { value: "completed", label: "Completed" },
              ]}
              align="right"
              className="py-1"
            />

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => openEditModal(task)}
                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/50 rounded-lg transition"
                title="Edit Task"
              >
                <FaPen className="text-xs" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition"
                title="Delete Task"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Subtasks in List View - Clean full-width section below */}
        {showSubtasks && subtasks.length > 0 && (
          <div className="w-full mt-3 pt-3 border-t border-slate-700/60 bg-slate-900/60 p-3 rounded-xl space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold text-slate-300">Subtasks Checklist:</span>
              <span className="font-bold text-indigo-400">{subtaskProgress}% completed</span>
            </div>
            <div className="space-y-1.5">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => toggleSubtask(task.id, st.id)}
                  className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer p-1.5 rounded-lg hover:bg-slate-800/80 transition"
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] transition ${
                      st.completed ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-600 bg-slate-800"
                    }`}
                  >
                    {st.completed && <FaCheck />}
                  </div>
                  <span className={st.completed ? "line-through text-slate-500" : ""}>{st.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Grid and Kanban Card Layout
  return (
    <div
      className={`group relative rounded-xl border p-4 flex flex-col justify-between transition-all duration-300 focus-within:z-30 hover:z-20 ${
        isCompleted
          ? "bg-slate-900/60 border-slate-800 opacity-80"
          : "bg-slate-800/60 hover:bg-slate-800/90 border-slate-700/70 hover:border-indigo-500/40 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      }`}
    >
      {/* Top row: Priority, Category, Status Menu */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border capitalize ${pConfig.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${pConfig.dot}`} />
              {task.priority}
            </span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${cBadge}`}>
              {task.category}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-700/50 transition"
            >
              <FaEllipsisV className="text-xs" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-7 w-40 bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/30 rounded-xl shadow-2xl shadow-black/80 p-1.5 z-30 ring-1 ring-white/10 animate-fade-in"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={() => {
                    openEditModal(task);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-indigo-600/20 rounded-lg transition flex items-center gap-2 font-medium"
                >
                  <FaPen className="text-xs text-indigo-400" /> Edit Task
                </button>
                <button
                  onClick={() => {
                    deleteTask(task.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 rounded-lg transition flex items-center gap-2 font-medium"
                >
                  <FaTrash className="text-xs" /> Delete Task
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Task Title & Status Toggle */}
        <div className="flex items-start gap-2.5 mb-2">
          <button
            onClick={() => toggleTaskStatus(task.id)}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition border ${
              isCompleted
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "border-slate-600 hover:border-indigo-400 bg-slate-800/80 text-transparent hover:text-indigo-400"
            }`}
            title={isCompleted ? "Mark as pending" : "Mark as completed"}
          >
            <FaCheck className="text-[10px]" />
          </button>

          <h3
            className={`text-sm font-semibold leading-snug break-words ${
              isCompleted ? "line-through text-slate-400" : "text-slate-100 group-hover:text-white"
            }`}
          >
            {task.title}
          </h3>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Subtasks Progress */}
        {subtasks.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="flex items-center gap-1 hover:text-indigo-300 transition"
              >
                <span>
                  Checklist ({completedSubtasks}/{subtasks.length})
                </span>
                {showSubtasks ? <FaChevronUp className="text-[9px]" /> : <FaChevronDown className="text-[9px]" />}
              </button>
              <span className="font-semibold text-slate-300">{subtaskProgress}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${subtaskProgress}%` }}
              />
            </div>

            {/* Expanded subtasks checklist */}
            {showSubtasks && (
              <div className="mt-2 space-y-1 bg-slate-900/40 p-2 rounded-lg border border-slate-700/40">
                {subtasks.map((st) => (
                  <label
                    key={st.id}
                    className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white"
                  >
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => toggleSubtask(task.id, st.id)}
                      className="rounded border-slate-600 text-indigo-600 bg-slate-700 w-3.5 h-3.5"
                    />
                    <span className={st.completed ? "line-through text-slate-500" : ""}>
                      {st.text}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer: Due Date & Status Switcher */}
      <div className="pt-2.5 mt-1 border-t border-slate-700/50 flex items-center justify-between text-xs">
        {/* Due Date Indicator */}
        <div
          className={`flex items-center gap-1 text-[11px] font-medium ${
            isOverdue
              ? "text-rose-400"
              : isDueToday
              ? "text-amber-400"
              : "text-slate-400"
          }`}
        >
          {isOverdue ? (
            <>
              <FaExclamationTriangle className="text-[10px]" />
              <span>Overdue ({formatDueDate(task.dueDate)})</span>
            </>
          ) : isDueToday ? (
            <>
              <FaClock className="text-[10px]" />
              <span>Due Today</span>
            </>
          ) : task.dueDate ? (
            <>
              <FaCalendarAlt className="text-[10px]" />
              <span>{formatDueDate(task.dueDate)}</span>
            </>
          ) : (
            <span className="text-slate-500">No deadline</span>
          )}
        </div>

        {/* Move Status Mini Selector */}
        <CustomSelect
          value={task.status}
          onChange={(newStatus) => moveTaskStatus(task.id, newStatus)}
          options={[
            { value: "todo", label: "To Do" },
            { value: "in_progress", label: "In Progress" },
            { value: "completed", label: "Completed" },
          ]}
          align="right"
          direction="up"
          className="py-0.5 px-2 text-[11px] rounded-lg"
        />
      </div>
    </div>
  );
};

export default TaskCard;
