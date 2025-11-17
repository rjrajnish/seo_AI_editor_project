 
import { useState } from "react";
import Layout from "../components/Layout";

export default function Content() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const articles = [
    { title: "How to Optimize Images for SEO", status: "Draft", score: 50, updated: "5 days ago" },
    { title: "The Ultimate Guide to On-Page SEO", status: "Published", score: 61, updated: "Apr 20, 2024" },
    { title: "Top 10 JavaScript Frameworks to Use", status: "In Progress", score: 72, updated: "Apr 10, 2024" },
    { title: "AI in Digital Marketing: Trends in 2025", status: "Published", score: 65, updated: "Apr 10, 2024" },
    { title: "Beginner’s Guide to Docker Containers", status: "Draft", score: 75, updated: "Apr 5, 2024" },
    { title: "Improving Page Speed for Better SEO", status: "Published", score: 82, updated: "Apr 5, 2024" },
    { title: "Best Practices for Writing Meta Descriptions", status: "In Progress", score: 70, updated: "Apr 5, 2024" },
    { title: "Responsive Web Design Principles", status: "In Progress", score: 68, updated: "Apr 5, 2024" }
  ];

  return (
    <Layout>
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Content</h1>

        {/* Search + Filter Row */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-72"
          />

          <select
            className="border p-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Draft</option>
            <option>In Progress</option>
            <option>Published</option>
          </select>

          <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            New Article
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-3">TITLE</th>
              <th className="py-3">STATUS</th>
              <th className="py-3">SEO SCORE</th>
              <th className="py-3">LAST UPDATED</th>
              <th className="py-3">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {articles
              .filter((a) =>
                a.title.toLowerCase().includes(search.toLowerCase()) &&
                (statusFilter === "All" || a.status === statusFilter)
              )
              .map((a, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 cursor-pointer">
                  <td className="py-3 flex items-center gap-2">
                    <span className="text-lg">›</span> {a.title}
                  </td>

                  <td className="py-3">
                    <span
                      className={`px-2 py-1 text-sm rounded ${{
                        Draft: "bg-gray-200",
                        "In Progress": "bg-yellow-200",
                        Published: "bg-green-200"
                      }[a.status]}`}
                    >
                      {a.status}
                    </span>
                  </td>

                  <td className="py-3 font-bold text-green-600">{a.score}</td>
                  <td className="py-3 text-gray-600">{a.updated}</td>

                  <td className="py-3 flex gap-2">
                    <button className="p-2 border rounded">✏️</button>
                    <button className="p-2 border rounded">📊</button>
                    <button className="p-2 border rounded">↗️</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6 text-gray-600">
          <button className="p-2">‹</button>
          <span>1 - 8 of 86</span>
          <button className="p-2">›</button>
        </div>
      </div>
    </Layout>
  );
}