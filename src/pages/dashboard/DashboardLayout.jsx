import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import TaskModal from "../../components/TaskModal";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[#0b0f19] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar (Desktop + Mobile drawer) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-gradient-to-b from-[#0e1424] via-[#0b0f19] to-[#080b12]">
        {/* Top Header */}
        <Header />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Task Modal for Creating & Editing */}
      <TaskModal />
    </div>
  );
};

export default DashboardLayout;
