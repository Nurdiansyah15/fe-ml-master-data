import { useState } from "react";
import { PageProvider } from "../../contexts/PageContext";
import Sidebar from "./sidebar/Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <PageProvider>
      <div className={`flex h-screen bg-gray-800 text-white p-5`}>
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
        />

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-auto rounded-2xl border border-gray-700">
          {/* Header (now includes navigation buttons) */}
          <Header toggleSidebar={toggleSidebar} />

          {/* Page content */}
          <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-900 p-4">
            {children}
          </main>
        </div>
      </div>
    </PageProvider>
  );
}
