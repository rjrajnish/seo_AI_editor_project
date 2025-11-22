import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../apis";

export default function Content() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [fetchedArticles, setFetchedArticles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Create/Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState("create"); // create | edit
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft",
  });
  const [page, setPage] = useState(1);

  const fetchArticles = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const response = await getArticles(pageNumber);
      if (response?.status === 200) {
        setFetchedArticles(response?.data);
      }
    } catch (error) {
      setFetchedArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(page);
  }, [page]);
  const totalPages = Math.ceil(
    (fetchedArticles?.total || 0) / (fetchedArticles?.limit || 1)
  );

  // ================
  // HANDLE CREATE
  // ================
  const handleCreate = async () => {
    if (!formData.title || !formData.content) {
      alert("All fields are required");
      return;
    }
    try {
      await createArticle(formData);
      setShowModal(false);
      fetchArticles();
    } catch (err) {
      console.log(err);
      alert("Failed to create article");
    }
  };

  // ================
  // HANDLE UPDATE
  // ================
  const handleUpdate = async () => {
     if (!formData.title || !formData.content) {
      alert("All fields are required");
      return;
    }
    try {
      await updateArticle(selectedArticle?.id, formData);
      setShowModal(false);
      fetchArticles();
    } catch (err) {
      console.log(err);
      alert("Failed to update article");
    }
  };

  // ================
  // OPEN EDIT MODAL
  // ================
  const openEditModal = async (id) => {
    try {
      const res = await getArticleById(id);
      if (res?.data) {
        setSelectedArticle(res.data);
        setFormData({
          title: res.data.title,
          content: res.data.content,
          status: res.data.status,
        });
        setFormMode("edit");
        setShowModal(true);
      }
    } catch (err) {
      console.log(err);
      alert("Unable to fetch article details");
    }
  };

  // ================
  // VIEW ARTICLE
  // ================
  const openViewModal = async (id) => {
    try {
      const res = await getArticleById(id);
      if (res?.data) {
        setSelectedArticle(res.data);
        setFormMode("view");
        setShowModal(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================
  // DELETE
  // ================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;

    try {
      await deleteArticle(id);
      fetchArticles();
    } catch (err) {
      console.log(err);
      alert("Failed to delete article");
    }
  };
 
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
            <option value={"in_progress"}>In Progress</option>
            <option>Published</option>
          </select>

          <button
            className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              setFormMode("create");
              setFormData({ title: "", content: "", status: "draft" });
              setShowModal(true);
            }}
          >
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
            {fetchedArticles?.data
              ?.filter(
                (a) =>
                  a.title.toLowerCase().includes(search.toLowerCase()) &&
                  (statusFilter === "All" ||
                    a.status === statusFilter?.toLowerCase())
              )
              .map((a, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-3 flex items-center gap-2">
                    <span className="text-lg">›</span> {a.title}
                  </td>

                  <td className="py-3">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        {
                          draft: "bg-gray-200",
                          in_progress: "bg-yellow-200",
                          published: "bg-green-200",
                        }[a.status]
                      }`}
                    >
                      {a.status?.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3 font-bold text-green-600">
                    {a.seo_score}
                  </td>

                  <td className="py-3 text-gray-600">{a.updated_at}</td>

                  <td className="py-3 flex gap-2">
                    <button
                      className="p-2 border rounded"
                      onClick={() => openEditModal(a.id)}
                    >
                      ✏️
                    </button>

                    <button
                      className="p-2 border rounded"
                      onClick={() => openViewModal(a.id)}
                    >
                      👁️
                    </button>

                    <button
                      className="p-2 border rounded"
                      onClick={() => handleDelete(a.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6 text-gray-600">
          {/* Previous */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`p-2 h-10 w-10 border rounded-full ${
              page === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
          >
            ‹
          </button>

          <span>
            Page {fetchedArticles?.page} of {totalPages} Showing{" "}
            {fetchedArticles?.data?.length} of {fetchedArticles?.total}
          </span>

          {/* Next */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`p-2 h-10 w-10 border rounded-full ${
              page === totalPages
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
          >
            ›
          </button>
        </div>
      </div>

      {/* === CREATE / EDIT / VIEW MODAL === */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[500px] shadow">
            <h2 className="text-xl font-bold mb-4">
              {formMode === "create"
                ? "Create Article"
                : formMode === "edit"
                ? "Edit Article"
                : "View Article"}
            </h2>

            {/* Title */}
            <label className="block mb-2 font-medium">Title</label>
            <input
              type="text"
              disabled={formMode === "view"}
              className="border p-2 rounded w-full mb-4"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            {/* Content */}
            <label className="block mb-2 font-medium">Content</label>
            <textarea
              disabled={formMode === "view"}
              className="border p-2 rounded w-full mb-4 h-32"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />

            {/* Status */}
            <label className="block mb-2 font-medium">Status</label>
            <select
              disabled={formMode === "view"}
              className="border p-2 rounded w-full mb-4"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="published">Published</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>

              {formMode === "create" && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={handleCreate}
                >
                  Create
                </button>
              )}

              {formMode === "edit" && (
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
