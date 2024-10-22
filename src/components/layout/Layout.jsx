import { useState } from "react";
import { MatchEditProvider } from "../../contexts/MatchEditContext";
import { PageProvider } from "../../contexts/PageContext";
import Header from "./Header";
import Sidebar from "./sidebar/Sidebar";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
      <MatchEditProvider>
        <PageProvider>
          <div
            className={`flex h-screen bg-[#1F1F21] text-white p-5 pb-0 pr-0`}
          >
            {/* Sidebar */}
            <Sidebar
              isOpen={isSidebarOpen}
              closeSidebar={() => setIsSidebarOpen(false)}
            />

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-auto rounded-2xl rounded-b-none rounded-se-none">
              {/* Header (now includes navigation buttons) */}
              <Header toggleSidebar={toggleSidebar} />

              {/* Page content */}
              <main className="flex-1 overflow-x-auto overflow-y-auto bg-[#161618] p-4">
                {children}
              </main>
            </div>
          </div>
        </PageProvider>
      </MatchEditProvider>
  );
}
