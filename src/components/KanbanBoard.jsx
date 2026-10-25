import React, { useState } from "react";
import { FaPlus, FaCheckCircle, FaSpinner, FaListUl } from "react-icons/fa";
import { useTasks } from "../context/TaskContext";
import TaskCard from "./TaskCard";

const columns = [
  {
    id: "todo",
    title: "To Do",
    icon: FaListUl,
    headerColor: "text-indigo-400",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    dropHover: "border-indigo-500/50 bg-indigo-950/20",
  },
  {
    id: "in_progress",
    title: "In Progress",
    icon: FaSpinner,
    headerColor: "text-amber-400",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    dropHover: "border-amber-500/50 bg-amber-950/20",
  },
  {
    id: "completed",
    title: "Completed",
    icon: FaCheckCircle,
    headerColor: "text-emerald-400",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    dropHover: "border-emerald-500/50 bg-emerald-950/20",
  },
];

const KanbanBoard = () => {
  const { filteredTasks, moveTaskStatus, openCreateModal } = useTasks();
  const [activeDragId, setActiveDragId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragStart = (e, taskId) => {
    setActiveDragId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || activeDragId;
    if (taskId) {
      moveTaskStatus(taskId, targetStatus);
    }
    setActiveDragId(null);
    setDragOverCol(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((col) => {
        const colTasks = filteredTasks.filter((t) => t.status === col.id);
        const Icon = col.icon;
        const isHovered = dragOverCol === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`rounded-2xl bg-slate-900/60 border transition-all duration-200 p-4 flex flex-col min-h-[520px] ${
              isHovered
                ? `border-dashed ${col.dropHover} ring-2 ring-indigo-500/30`
                : "border-slate-800/80 shadow-md"
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Icon className={`text-base ${col.headerColor}`} />
                <h3 className="font-bold text-sm tracking-wide text-slate-100">{col.title}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${col.badgeColor}`}
                >
                  {colTasks.length}
                </span>
              </div>

              <button
                onClick={() => openCreateModal(col.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title={`Add task to ${col.title}`}
              >
                <FaPlus className="text-xs" />
              </button>
            </div>

            {/* Tasks Container */}
            <div className="space-y-3.5 flex-1">
              {colTasks.length === 0 ? (
                <div className="h-44 border-2 border-dashed border-slate-800/70 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">No tasks in {col.title}</p>
                  <button
                    onClick={() => openCreateModal(col.id)}
                    className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <FaPlus className="text-[10px]" /> Add a task
                  </button>
                </div>
              ) : (
                colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="cursor-grab active:cursor-grabbing transition-transform relative focus-within:z-40 hover:z-20"
                  >
                    <TaskCard task={task} layout="card" />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
