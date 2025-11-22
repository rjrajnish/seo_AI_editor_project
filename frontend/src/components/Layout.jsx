import { useEffect, useRef, useState } from "react";
import {jwtDecode} from "jwt-decode"
export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    window.location.href = "/auth"; // redirect
  };

  const showProfile=jwtDecode(localStorage.getItem("user_token"));
 
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
          <a href="/" className="block hover:text-white">
            Dashboard
          </a>
          <a href="/seo-intelligence" className="block hover:text-white">
            SEO Intelligence
          </a>

          <a href="/ai-studio" className="block hover:text-white">
            AI Studio
          </a>
          <a href="/content" className="block hover:text-white">
            Content (Article)
          </a>
          <a href="/analytics" className="block hover:text-white">
            Analytics
          </a>
          <a href="/settings" className="block hover:text-white">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header (fixed) */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6 sticky top-0 z-10">
          <span className="text-2xl font-bold"></span>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-700 font-medium hover:text-black"
            >
              User:  {showProfile?.user_name} ▾
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md py-2 z-20">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={() => alert("Profile Page Coming Soon!")}
                >
                  Profile
                </button>

                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
