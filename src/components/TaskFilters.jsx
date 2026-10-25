import React from "react";
import {
  FaSearch,
  FaTimes,
  FaList,
  FaThLarge,
  FaSortAmountDown,
  FaFilter,
} from "react-icons/fa";
import { useTasks, CATEGORIES } from "../context/TaskContext";
import CustomSelect from "./CustomSelect";

const TaskFilters = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
  } = useTasks();

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "All" ||
    selectedPriority !== "all" ||
    selectedStatus !== "all";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedPriority("all");
    setSelectedStatus("all");
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl space-y-4">
      {/* Top row: Search bar & View mode toggles */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title, description..."
            className="w-full pl-9 pr-8 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>

        {/* View Switchers & Sort */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* Sort Selector */}
          <CustomSelect
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: "dueDate", label: "Sort: Due Date" },
              { value: "priority", label: "Sort: Priority" },
              { value: "newest", label: "Sort: Recently Added" },
              { value: "title", label: "Sort: Title (A-Z)" },
            ]}
            align="right"
            className="py-1.5"
          />

          {/* View Mode Buttons (List & Grid) */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Detailed List View"
            >
              <FaList />
              <span>List</span>
            </button>

            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Card Grid View"
            >
              <FaThLarge />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Category Pills & Secondary Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Priority & Status Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority filter */}
          <CustomSelect
            value={selectedPriority}
            onChange={setSelectedPriority}
            options={[
              { value: "all", label: "All Priorities" },
              { value: "high", label: "High Priority" },
              { value: "medium", label: "Medium Priority" },
              { value: "low", label: "Low Priority" },
            ]}
            className="py-1.5"
          />

          {/* Status filter */}
          <CustomSelect
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "pending", label: "Pending Only" },
              { value: "todo", label: "To Do" },
              { value: "in_progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
            ]}
            className="py-1.5"
          />

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition flex items-center gap-1"
            >
              <FaTimes className="text-[10px]" /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
