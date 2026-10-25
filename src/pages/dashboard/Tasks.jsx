import React from "react";
import {
  FaPlus,
  FaCheckDouble,
  FaTrashAlt,
  FaUndo,
  FaTasks,
} from "react-icons/fa";
import { useTasks } from "../../context/TaskContext";
import TaskFilters from "../../components/TaskFilters";
import TaskCard from "../../components/TaskCard";

const Tasks = () => {
  const {
    filteredTasks,
    allTasksCount,
    viewMode,
    openCreateModal,
    markAllCompleted,
    clearCompleted,
    resetToDemo,
    completedCount,
  } = useTasks();

  return (
    <div className="p-4 sm:p-8 mx-auto space-y-6 animate-fade-in">
      {/* Action Toolbar & Task Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-2.5">
          <span className="text-xs sm:text-sm font-semibold text-slate-300">All Items</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
            {filteredTasks.length} of {allTasksCount}
          </span>
        </div>

        {/* Batch Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => openCreateModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 transition transform active:scale-95"
          >
            <FaPlus className="text-xs" />
            <span>Add Task</span>
          </button>

          <button
            onClick={markAllCompleted}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-emerald-400 hover:text-emerald-300 font-medium text-xs transition"
            title="Mark all matching tasks completed"
          >
            <FaCheckDouble className="text-xs" />
            <span className="hidden md:inline">Complete All</span>
          </button>

          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-rose-400 hover:text-rose-300 font-medium text-xs transition"
              title="Clear all completed tasks"
            >
              <FaTrashAlt className="text-xs" />
              <span className="hidden md:inline">Clear Done</span>
            </button>
          )}

          <button
            onClick={resetToDemo}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition"
            title="Reset with sample demo tasks"
          >
            <FaUndo className="text-xs" />
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <TaskFilters />

      {/* Main View Area (List & Grid) */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80">
              <FaTasks className="text-slate-600 text-3xl mx-auto mb-2" />
              <p className="text-slate-300 text-sm font-semibold">No tasks matched your criteria</p>
              <p className="text-slate-500 text-xs mt-1">Try resetting filters or adding a new task!</p>
              <button
                onClick={() => openCreateModal()}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                <FaPlus className="text-xs" /> Create Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => <TaskCard key={task.id} task={task} layout="card" />)
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80">
              <FaTasks className="text-slate-600 text-3xl mx-auto mb-2" />
              <p className="text-slate-300 text-sm font-semibold">No tasks matched your criteria</p>
              <p className="text-slate-500 text-xs mt-1">Try resetting filters or adding a new task!</p>
              <button
                onClick={() => openCreateModal()}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                <FaPlus className="text-xs" /> Create Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => <TaskCard key={task.id} task={task} layout="list" />)
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
