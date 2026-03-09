import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../apis";

const STATUS_OPTIONS = ["draft", "in_progress", "published"];

const STATUS_LABEL = {
  draft: "Draft",
  in_progress: "In Progress",
  published: "Published",
};

export default function Content() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [fetchedArticles, setFetchedArticles] = useState({
    data: [],
    page: 1,
    limit: 10,
    total: 0,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [globalError, setGlobalError] = useState("");

  const [selectedArticle, setSelectedArticle] = useState(null);

  // Create/Edit/View modal state
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState("create"); // create | edit | view
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft",
  });
  const [formErrors, setFormErrors] = useState({});

  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);
    return () => clearTimeout(id);
  }, [search]);

  const fetchArticles = async (pageNumber = page, query = debouncedSearch, status = statusFilter) => {
    try {
      setLoading(true);
      setGlobalError("");
      const response = await getArticles(pageNumber, {
        search: query,
        status,
      });
      if (response?.status === 200) {
        setFetchedArticles(
          response?.data || { data: [], page: pageNumber, limit: 10, total: 0 }
        );
      }
    } catch (error) {
      setFetchedArticles({ data: [], page: pageNumber, limit: 10, total: 0 });
      setGlobalError("Unable to load articles right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(page, debouncedSearch, statusFilter);
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil((fetchedArticles?.total || 0) / (fetchedArticles?.limit || 1))
  );

  const filteredArticles = useMemo(() => fetchedArticles?.data || [], [fetchedArticles?.data]);

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const getStatusBadgeClass = (status) => {
    if (status === "published") {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
    if (status === "in_progress") {
      return "bg-amber-100 text-amber-700 border-amber-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const validateForm = () => {
    const errors = {};
    const title = formData.title.trim();
    const content = formData.content.trim();

    if (!title) {
      errors.title = "Title is required.";
    } else if (title.length < 5) {
      errors.title = "Title must be at least 5 characters.";
    } else if (title.length > 150) {
      errors.title = "Title cannot exceed 150 characters.";
    }

    if (!content) {
      errors.content = "Content is required.";
    } else if (content.length < 30) {
      errors.content = "Content must be at least 30 characters.";
    }

    if (!STATUS_OPTIONS.includes(formData.status)) {
      errors.status = "Please select a valid status.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetModalState = () => {
    setFormData({ title: "", content: "", status: "draft" });
    setFormErrors({});
    setSelectedArticle(null);
  };

  const openCreateModal = () => {
    resetModalState();
    setFormMode("create");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetModalState();
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      await createArticle({
        title: formData.title.trim(),
        content: formData.content.trim(),
        status: formData.status,
      });
      closeModal();
      fetchArticles(page, debouncedSearch, statusFilter);
    } catch (err) {
      console.log(err);
      setFormErrors({ submit: "Failed to create article. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      await updateArticle(selectedArticle?.id, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        status: formData.status,
      });
      closeModal();
      fetchArticles(page, debouncedSearch, statusFilter);
    } catch (err) {
      console.log(err);
      setFormErrors({ submit: "Failed to update article. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = async (id) => {
    try {
      setActionLoadingId(id);
      const res = await getArticleById(id);
      if (res?.data) {
        setSelectedArticle(res.data);
        setFormData({
          title: res.data.title || "",
          content: res.data.content || "",
          status: res.data.status || "draft",
        });
        setFormErrors({});
        setFormMode("edit");
        setShowModal(true);
      }
    } catch (err) {
      console.log(err);
      setGlobalError("Unable to fetch article details.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openViewModal = async (id) => {
    try {
      setActionLoadingId(id);
      const res = await getArticleById(id);
      if (res?.data) {
        setSelectedArticle(res.data);
        setFormData({
          title: res.data.title || "",
          content: res.data.content || "",
          status: res.data.status || "draft",
        });
        setFormErrors({});
        setFormMode("view");
        setShowModal(true);
      }
    } catch (err) {
      console.log(err);
      setGlobalError("Unable to fetch article details.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      setActionLoadingId(id);
      await deleteArticle(id);
      fetchArticles(page, debouncedSearch, statusFilter);
    } catch (err) {
      console.log(err);
      setGlobalError("Failed to delete article.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <Layout>
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-700 p-6 shadow-xl sm:p-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Content Management</h1>
        <p className="mt-2 max-w-3xl text-sm text-cyan-100 sm:text-base">
          Create, update, and monitor your content inventory with fast search and status-based filtering.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search by title or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-800 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            />

            <select
              className="h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="published">Published</option>
            </select>
          </div>

          <button
            type="button"
            className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            onClick={openCreateModal}
          >
            New Article
          </button>
        </div>

        {globalError && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {globalError}
          </p>
        )}

        <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
          <p>
            Showing {filteredArticles.length} record(s) on this page
          </p>
          <p>
            Total: {fetchedArticles?.total || 0}
          </p>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3 pr-4 font-semibold">Title</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold">SEO Score</th>
                <th className="py-3 pr-4 font-semibold">Last Updated</th>
                <th className="py-3 pr-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-slate-100">
                    <td className="py-4 pr-4">
                      <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
                    </td>
                    <td className="py-4 pr-4">
                      <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
                    </td>
                    <td className="py-4 pr-4">
                      <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                    </td>
                    <td className="py-4 pr-4">
                      <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                    </td>
                    <td className="py-4 pr-4">
                      <div className="h-8 w-44 animate-pulse rounded bg-slate-200" />
                    </td>
                  </tr>
                ))}

              {!loading && filteredArticles.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-slate-500">
                    No articles found for the current search/filter.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b border-slate-100 hover:bg-slate-50/70">
                    <td className="py-4 pr-4 font-medium text-slate-900">{article.title}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(
                          article.status
                        )}`}
                      >
                        {STATUS_LABEL[article.status] || article.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-semibold text-emerald-700">
                      {article.seo_score ?? "-"}
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{formatDate(article.updated_at)}</td>
                    <td className="py-4 pr-4">
                      <div className="flex gap-2">
                        <button
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          onClick={() => openViewModal(article.id)}
                          disabled={actionLoadingId === article.id}
                        >
                          View
                        </button>
                        <button
                          className="rounded-lg border border-cyan-300 px-3 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-50"
                          onClick={() => openEditModal(article.id)}
                          disabled={actionLoadingId === article.id}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(article.id)}
                          disabled={actionLoadingId === article.id}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 lg:hidden">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={`mobile-skeleton-${i}`} className="animate-pulse rounded-xl border border-slate-200 p-4">
                <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
                <div className="mb-2 h-4 w-1/3 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-200" />
              </div>
            ))}

          {!loading && filteredArticles.length === 0 && (
            <p className="rounded-xl border border-slate-200 p-4 text-sm text-slate-500">
              No articles found for the current search/filter.
            </p>
          )}

          {!loading &&
            filteredArticles.map((article) => (
              <article key={article.id} className="rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">{article.title}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(
                      article.status
                    )}`}
                  >
                    {STATUS_LABEL[article.status] || article.status}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    SEO: {article.seo_score ?? "-"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Updated: {formatDate(article.updated_at)}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                    onClick={() => openViewModal(article.id)}
                    disabled={actionLoadingId === article.id}
                  >
                    View
                  </button>
                  <button
                    className="rounded-lg border border-cyan-300 px-3 py-1.5 text-xs font-semibold text-cyan-700"
                    onClick={() => openEditModal(article.id)}
                    disabled={actionLoadingId === article.id}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700"
                    onClick={() => handleDelete(article.id)}
                    disabled={actionLoadingId === article.id}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-sm text-slate-600 sm:flex-row">
          <p>
            Page {fetchedArticles?.page || page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-300 px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-300 px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-slate-900">
              {formMode === "create"
                ? "Create Article"
                : formMode === "edit"
                ? "Edit Article"
                : "View Article"}
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Title</label>
                <input
                  type="text"
                  disabled={formMode === "view"}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (formErrors.title) setFormErrors({ ...formErrors, title: "" });
                  }}
                />
                {formErrors.title && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Content</label>
                <textarea
                  disabled={formMode === "view"}
                  className="h-36 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100"
                  value={formData.content}
                  onChange={(e) => {
                    setFormData({ ...formData, content: e.target.value });
                    if (formErrors.content) {
                      setFormErrors({ ...formErrors, content: "" });
                    }
                  }}
                />
                <div className="mt-1 flex items-center justify-between">
                  {formErrors.content ? (
                    <p className="text-xs text-red-600">{formErrors.content}</p>
                  ) : (
                    <span className="text-xs text-slate-400">Minimum 30 characters</span>
                  )}
                  <span className="text-xs text-slate-400">{formData.content.length} chars</span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
                <select
                  disabled={formMode === "view"}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100"
                  value={formData.status}
                  onChange={(e) => {
                    setFormData({ ...formData, status: e.target.value });
                    if (formErrors.status) setFormErrors({ ...formErrors, status: "" });
                  }}
                >
                  <option value="draft">Draft</option>
                  <option value="in_progress">In Progress</option>
                  <option value="published">Published</option>
                </select>
                {formErrors.status && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.status}</p>
                )}
              </div>

              {selectedArticle?.seo_score !== undefined && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  SEO Score: <span className="font-semibold text-slate-900">{selectedArticle.seo_score}</span>
                </div>
              )}

              {formErrors.submit && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {formErrors.submit}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-300"
                onClick={closeModal}
              >
                Close
              </button>

              {formMode === "create" && (
                <button
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleCreate}
                  disabled={saving}
                >
                  {saving ? "Creating..." : "Create Article"}
                </button>
              )}

              {formMode === "edit" && (
                <button
                  className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  {saving ? "Updating..." : "Update Article"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
