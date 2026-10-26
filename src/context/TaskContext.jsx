import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";

const TaskContext = createContext();

export const CATEGORIES = ["All", "Work", "Development", "Design", "Personal", "Health"];
export const PRIORITIES = ["all", "high", "medium", "low"];
export const STATUSES = ["all", "todo", "in_progress", "completed"];

const DEFAULT_PROFILE = {
  name: "Guest User",
  role: "Workspace Member",
  email: "guest@focusboard.io",
  bio: "Welcome to FocusBoard! Organize tasks, track daily milestones, and boost productivity.",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  dailyGoal: 5,
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved =
        localStorage.getItem("focusboard_tasks_v1") ||
        localStorage.getItem("workmatrix_tasks_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy mock task IDs if present in localStorage
          const legacyMockIds = ["task-1", "task-2", "task-3", "task-4", "task-5"];
          return parsed.filter((task) => !legacyMockIds.includes(task.id));
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const saved =
        localStorage.getItem("focusboard_profile_v1") ||
        localStorage.getItem("workmatrix_profile_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === "Deepak Gupta") {
          return DEFAULT_PROFILE;
        }
        return parsed;
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // UI & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate"); // 'dueDate' | 'priority' | 'newest' | 'title'
  const [viewMode, setViewMode] = useState("list"); // default to 'list'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [editingTask, setEditingTask] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("focusboard_tasks_v1", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("focusboard_profile_v1", JSON.stringify(profile));
  }, [profile]);

  // Confetti trigger
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#a855f7", "#ec4899", "#10b981", "#3b82f6"],
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Actions
  const addTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title.trim(),
      description: taskData.description?.trim() || "",
      priority: taskData.priority || "medium",
      category: taskData.category || "Work",
      status: taskData.status || "todo",
      dueDate: taskData.dueDate || new Date().toISOString().split("T")[0],
      subtasks: taskData.subtasks || [],
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id, updatedFields) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const updated = { ...task, ...updatedFields, updatedAt: new Date().toISOString() };
          if (updated.status === "completed" && task.status !== "completed") {
            triggerCelebration();
          }
          return updated;
        }
        return task;
      })
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTaskStatus = (id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const newStatus = task.status === "completed" ? "todo" : "completed";
          if (newStatus === "completed") {
            triggerCelebration();
          }
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const moveTaskStatus = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          if (newStatus === "completed" && task.status !== "completed") {
            triggerCelebration();
          }
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = (task.subtasks || []).map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          // If all subtasks are finished, check if task status should update or celebrate
          const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every((s) => s.completed);
          if (allDone && task.status !== "completed") {
            triggerCelebration();
          }
          return {
            ...task,
            subtasks: updatedSubtasks,
            status: allDone ? "completed" : task.status,
          };
        }
        return task;
      })
    );
  };

  const openCreateModal = (initialStatus = "todo") => {
    setEditingTask({
      title: "",
      description: "",
      priority: "medium",
      category: "Work",
      status: initialStatus,
      dueDate: new Date().toISOString().split("T")[0],
      subtasks: [],
    });
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => t.status !== "completed"));
  };

  const markAllCompleted = () => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        status: "completed",
        subtasks: (t.subtasks || []).map((s) => ({ ...s, completed: true })),
      }))
    );
    triggerCelebration();
  };

  const resetToDemo = () => {
    setTasks([]);
    setProfile(DEFAULT_PROFILE);
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `focusboard-backup-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importData = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        setTasks(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateProfile = (updated) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Filtered & Sorted Tasks calculation
  const filteredTasks = tasks.filter((task) => {
    // Search Filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category Filter
    const matchesCategory = selectedCategory === "All" || task.category === selectedCategory;

    // Priority Filter
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority;

    // Status Filter
    const matchesStatus =
      selectedStatus === "all"
        ? true
        : selectedStatus === "pending"
        ? task.status !== "completed"
        : task.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  // Sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate || "9999-12-31") - new Date(b.dueDate || "9999-12-31");
    }
    if (sortBy === "priority") {
      const pWeights = { high: 3, medium: 2, low: 1 };
      return (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0);
    }
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Computed metrics for Dashboard
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  
  const todayStr = new Date().toISOString().split("T")[0];
  const overdueCount = tasks.filter((t) => t.status !== "completed" && t.dueDate && t.dueDate < todayStr).length;
  const dueTodayCount = tasks.filter((t) => t.status !== "completed" && t.dueDate === todayStr).length;

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks: sortedTasks,
        allTasksCount: totalCount,
        completedCount,
        inProgressCount,
        todoCount,
        overdueCount,
        dueTodayCount,
        completionRate,
        profile,
        updateProfile,
        // Filters & Search
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
        // Modals & Navigation
        isModalOpen,
        modalMode,
        editingTask,
        openCreateModal,
        openEditModal,
        closeModal,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        // Actions
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        moveTaskStatus,
        toggleSubtask,
        clearCompleted,
        markAllCompleted,
        resetToDemo,
        exportData,
        importData,
        triggerCelebration,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
