import { useState } from "react";

export default function Layout({ children }) {
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar (fixed) */}
      <aside
        className={`bg-gray-900 text-white p-6 transition-all duration-300 h-screen sticky top-0 w-60`}
      >
        <h1 className="text-2xl font-bold mb-10 whitespace-nowrap overflow-hidden">
          CMS
        </h1>

        <nav className="space-y-4 text-gray-300">
          <a href="/" className="block hover:text-white">Dashboard</a>
          <a href="/content" className="block hover:text-white">Content</a>
          <a href="/ai-studio" className="block hover:text-white">AI Studio</a>
          <a href="/seo-intelligence" className="block hover:text-white">SEO Intelligence</a>
          <a href="/analytics" className="block hover:text-white">Analytics</a>
          <a href="/settings" className="block hover:text-white">Settings</a>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header (fixed) */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6 sticky top-0 z-10">
          <span className="text-2xl font-bold"></span>
          <span className="text-gray-600">User: Rajnish</span>
        </header>

        {/* Scrollable Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
