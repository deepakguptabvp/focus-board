import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaBriefcase,
  FaBullseye,
  FaDownload,
  FaUpload,
  FaUndo,
  FaTrash,
  FaCheckCircle,
  FaFire,
  FaChartLine,
} from "react-icons/fa";
import { useTasks } from "../../context/TaskContext";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
];

const Profile = () => {
  const {
    profile,
    updateProfile,
    tasks,
    allTasksCount,
    completedCount,
    completionRate,
    exportData,
    importData,
    resetToDemo,
  } = useTasks();

  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoal || 5);
  const [saveMessage, setSaveMessage] = useState("");
  const [importError, setImportError] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      role,
      email,
      bio,
      avatar,
      dailyGoal: Number(dailyGoal) || 5,
    });
    setSaveMessage("Profile saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const success = importData(content);
      if (success) {
        setSaveMessage("Tasks imported successfully!");
        setImportError("");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setImportError("Invalid JSON backup file.");
      }
    };
    reader.readAsText(file);
  };

  // Subtask analytics
  const totalSubtasks = tasks.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0);
  const completedSubtasks = tasks.reduce(
    (acc, t) => acc + (t.subtasks?.filter((s) => s.completed).length || 0),
    0
  );

  return (
    <div className="p-4 sm:p-8 mx-auto space-y-8 animate-fade-in">
      {/* Title */}
      {/* <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Profile & Productivity Hub
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your personal details, productivity targets, and export/import task backups.
        </p>
      </div> */}

      {/* Productivity Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
          <FaCheckCircle className="text-emerald-400 text-lg mx-auto mb-1" />
          <p className="text-2xl font-black text-white">{completedCount}</p>
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Tasks Finished</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
          <FaChartLine className="text-indigo-400 text-lg mx-auto mb-1" />
          <p className="text-2xl font-black text-white">{completionRate}%</p>
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Completion Rate</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
          <FaFire className="text-amber-400 text-lg mx-auto mb-1" />
          <p className="text-2xl font-black text-white">{completedSubtasks}/{totalSubtasks}</p>
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Subtasks Done</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
          <FaBullseye className="text-purple-400 text-lg mx-auto mb-1" />
          <p className="text-2xl font-black text-white">{dailyGoal}</p>
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Daily Goal</p>
        </div>
      </div>

      {/* Main Profile Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-base sm:text-lg font-bold text-white mb-6 pb-3 border-b border-slate-800 flex items-center gap-2">
          <FaUser className="text-indigo-400 text-sm" /> Personal Information
        </h3>

        {saveMessage && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <FaCheckCircle /> {saveMessage}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Profile Avatar
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <img
                src={avatar}
                alt="Selected avatar"
                className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-500/40"
              />
              <div className="space-y-2">
                <span className="text-xs text-slate-400 block">Choose from presets:</span>
                <div className="flex items-center gap-2">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(p)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition ${
                        avatar === p ? "border-indigo-500 scale-110" : "border-slate-700 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={p} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Job Title / Role */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Role / Title
              </label>
              <div className="relative">
                <FaBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Daily Goal Target */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Daily Task Goal
              </label>
              <div className="relative">
                <FaBullseye className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Bio / Focus Statement
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition transform active:scale-95"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Data Management & Backups */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-base sm:text-lg font-bold text-white mb-2">
          Data Management & Backups
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Your tasks and preferences are stored locally in your browser. Export backups or transfer data between devices seamlessly.
        </p>

        {importError && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold">
            {importError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Export JSON */}
          <button
            onClick={exportData}
            className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 text-slate-200 transition group"
          >
            <FaDownload className="text-indigo-400 text-xl mb-2 group-hover:-translate-y-1 transition-transform" />
            <span className="text-xs font-bold">Export Backup</span>
            <span className="text-[10px] text-slate-400 mt-1">Download tasks as JSON</span>
          </button>

          {/* Import JSON */}
          <label className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 text-slate-200 transition group cursor-pointer">
            <FaUpload className="text-purple-400 text-xl mb-2 group-hover:-translate-y-1 transition-transform" />
            <span className="text-xs font-bold">Import Backup</span>
            <span className="text-[10px] text-slate-400 mt-1">Restore from JSON file</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Reset Demo Data */}
          <button
            onClick={resetToDemo}
            className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 transition group"
          >
            <FaUndo className="text-amber-400 text-xl mb-2 group-hover:rotate-45 transition-transform" />
            <span className="text-xs font-bold">Reset Demo Data</span>
            <span className="text-[10px] text-slate-400 mt-1">Restore realistic starter tasks</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;