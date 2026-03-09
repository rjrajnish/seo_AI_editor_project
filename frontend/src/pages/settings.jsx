import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getSettings, updateSettings } from "../apis";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    default_category: "blog",
    default_seo_score: 50,
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getSettings();
      const defaults = response?.data?.defaults || {};
      setForm({
        default_category: defaults.default_category || "blog",
        default_seo_score:
          typeof defaults.default_seo_score === "number"
            ? defaults.default_seo_score
            : 50,
      });
    } catch (err) {
      setError("Unable to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    const score = Number(form.default_seo_score);
    if (Number.isNaN(score) || score < 0 || score > 100) {
      setError("Default SEO score must be between 0 and 100.");
      return;
    }

    if (!form.default_category.trim()) {
      setError("Default category is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setNotice("");

      await updateSettings({
        defaults: {
          default_category: form.default_category.trim(),
          default_seo_score: score,
        },
      });

      setNotice("Settings updated successfully.");
      setTimeout(() => setNotice(""), 2000);
    } catch (err) {
      setError("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-700 p-6 shadow-xl sm:p-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Settings</h1>
        <p className="mt-2 max-w-3xl text-sm text-cyan-100 sm:text-base">
          Configure workspace defaults used across article creation and SEO workflows.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {loading ? (
          <div className="space-y-3">
            <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:max-w-xl">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Default Category
              </label>
              <input
                value={form.default_category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, default_category: e.target.value }))
                }
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-800 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                placeholder="blog"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Default SEO Score
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.default_seo_score}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, default_seo_score: e.target.value }))
                }
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-800 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
              />
              <p className="mt-1 text-xs text-slate-500">Range: 0 to 100</p>
            </div>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            {notice && (
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {notice}
              </p>
            )}

            <div className="pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
