import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaTrash, FaCalendarAlt, FaTag, FaFlag, FaTasks, FaCheckCircle } from "react-icons/fa";
import { useTasks, CATEGORIES } from "../context/TaskContext";
import CustomSelect from "./CustomSelect";

const TaskModal = () => {
  const { isModalOpen, modalMode, editingTask, closeModal, addTask, updateTask } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("Work");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority || "medium");
      setCategory(editingTask.category || "Work");
      setStatus(editingTask.status || "todo");
      setDueDate(editingTask.dueDate || new Date().toISOString().split("T")[0]);
      setSubtasks(editingTask.subtasks ? [...editingTask.subtasks] : []);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("Work");
      setStatus("todo");
      setDueDate(new Date().toISOString().split("T")[0]);
      setSubtasks([]);
    }
  }, [editingTask, isModalOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  const handleAddSubtask = (e) => {
    if (e) e.preventDefault();
    if (!newSubtaskText.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: `st-${Date.now()}`, text: newSubtaskText.trim(), completed: false },
    ]);
    setNewSubtaskText("");
  };

  const handleRemoveSubtask = (subtaskId) => {
    setSubtasks((prev) => prev.filter((st) => st.id !== subtaskId));
  };

  const handleToggleSubtask = (subtaskId) => {
    setSubtasks((prev) =>
      prev.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskPayload = {
      title,
      description,
      priority,
      category,
      status,
      dueDate,
      subtasks,
    };

    if (modalMode === "edit" && editingTask?.id) {
      updateTask(editingTask.id, taskPayload);
    } else {
      addTask(taskPayload);
    }
    closeModal();
  };

  const completedSubtasksCount = subtasks.filter((s) => s.completed).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={closeModal}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/90 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/60 flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              {modalMode === "edit" ? "Edit Task Details" : "Create New Task"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {modalMode === "edit"
                ? "Update task information, priority, deadlines, and checklists"
                : "Add details to stay organized, prioritize work, and stay on track"}
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            title="Close modal (Esc)"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Task Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Design High-converting Checkout Flow"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Description / Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add key goals, context, links or acceptance criteria..."
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition resize-none"
              />
            </div>

            {/* Grid for Category, Status, Priority, Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <FaTag className="text-indigo-400 text-xs" /> Category
                </label>
                <CustomSelect
                  value={category}
                  onChange={setCategory}
                  options={CATEGORIES.filter((c) => c !== "All")}
                  fullWidth
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <FaTasks className="text-indigo-400 text-xs" /> Status
                </label>
                <CustomSelect
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: "todo", label: "To Do" },
                    { value: "in_progress", label: "In Progress" },
                    { value: "completed", label: "Completed" },
                  ]}
                  fullWidth
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <FaFlag className="text-indigo-400 text-xs" /> Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      key: "low",
                      label: "Low",
                      dot: "bg-emerald-400",
                      active:
                        "bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm shadow-emerald-500/10",
                    },
                    {
                      key: "medium",
                      label: "Medium",
                      dot: "bg-amber-400",
                      active:
                        "bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm shadow-amber-500/10",
                    },
                    {
                      key: "high",
                      label: "High",
                      dot: "bg-rose-400",
                      active:
                        "bg-rose-500/20 text-rose-300 border-rose-500 shadow-sm shadow-rose-500/10",
                    },
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setPriority(p.key)}
                      className={`h-[42px] px-2 text-xs font-semibold rounded-xl border transition-all text-center flex items-center justify-center gap-1.5 ${
                        priority === p.key
                          ? p.active
                          : "bg-slate-800/80 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <FaCalendarAlt className="text-indigo-400 text-xs" /> Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-[42px] px-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 focus:border-indigo-500 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition shadow-sm [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Subtasks & Checklist */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <FaCheckCircle className="text-indigo-400 text-xs" /> Subtasks & Checklist
                </label>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  {completedSubtasksCount}/{subtasks.length} Done
                </span>
              </div>

              {/* Add Subtask Input */}
              <div className="relative flex items-center mb-3">
                <input
                  type="text"
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  placeholder="Add actionable subtask and press Enter..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSubtask(e);
                    }
                  }}
                  className="w-full pl-3.5 pr-20 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  disabled={!newSubtaskText.trim()}
                  className="absolute right-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                >
                  <FaPlus className="text-[10px]" /> Add
                </button>
              </div>

              {/* Subtask Items List */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {subtasks.length === 0 ? (
                  <div className="p-3 rounded-xl bg-slate-800/30 border border-dashed border-slate-700/60 text-center">
                    <p className="text-xs text-slate-400">
                      No subtasks added yet. Break down this task into smaller steps.
                    </p>
                  </div>
                ) : (
                  subtasks.map((st) => (
                    <div
                      key={st.id}
                      className={`group flex items-center justify-between p-2.5 rounded-xl border transition ${
                        st.completed
                          ? "bg-slate-800/30 border-slate-800/80 text-slate-500"
                          : "bg-slate-800/60 border-slate-700/60 hover:border-slate-600 text-slate-200"
                      }`}
                    >
                      <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => handleToggleSubtask(st.id)}
                          className="rounded border-slate-600 text-indigo-600 focus:ring-0 focus:ring-offset-0 bg-slate-700 cursor-pointer w-4 h-4"
                        />
                        <span
                          className={`text-xs sm:text-sm truncate ${
                            st.completed ? "line-through text-slate-500" : ""
                          }`}
                        >
                          {st.text}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(st.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-700/40 transition opacity-70 group-hover:opacity-100"
                        title="Delete subtask"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons - Always visible sticky footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md flex-shrink-0">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition transform active:scale-95 flex items-center gap-2"
            >
              {modalMode === "edit" ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

