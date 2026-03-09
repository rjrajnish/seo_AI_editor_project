import { useState } from "react";
import Layout from "../components/Layout";
import { getSEO_Intelligence } from "../apis";

export default function SEOIntelligence() {
  const [keyword, setKeyword] = useState("");
  const [seo_data, setSeoData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSeoIntelligence = async () => {
    if (!keyword.trim() || loading) return;
    try {
      setError("");
      setLoading(true);
      const data = {
        keyword: keyword.trim(),
      };
      const response = await getSEO_Intelligence(data);
      setSeoData(response?.data);
    } catch (error) {
      console.error(error);
      setError("Unable to fetch SEO insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-800 p-6 shadow-xl sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            SEO Intelligence
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-cyan-100 sm:text-base">
            Analyze keyword demand, competition level, related terms, ranking suggestions, and simulated SERP patterns.
          </p>
        </div>

        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            fetchSeoIntelligence();
          }}
        >
          <input
            type="text"
            placeholder="Enter keyword or phrase..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="h-12 flex-1 rounded-xl border border-cyan-300/30 bg-white/95 px-4 text-sm text-slate-800 outline-none placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
          />
          <button
            type="submit"
            disabled={!keyword.trim() || loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-slate-900" />
                Analyzing...
              </>
            ) : (
              "Analyze Keyword"
            )}
          </button>
        </form>

        {error && (
          <p className="mt-3 rounded-lg border border-red-300/40 bg-red-100/20 px-3 py-2 text-sm text-red-100">
            {error}
          </p>
        )}
      </section>

      {loading ? (
        <section className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
              />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
        </section>
      ) : (
        <section className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Estimated Volume
              </h3>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {seo_data?.estimated_volume || "-"}
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Competition
              </h3>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {seo_data?.competition || "-"}
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Related Keywords
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {seo_data?.related_keywords?.length ? (
                  seo_data.related_keywords.map((item, index) => (
                    <span
                      key={`${item?.keyword || "keyword"}-${index}`}
                      className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
                    >
                      {item?.keyword}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No related keywords yet.</p>
                )}
              </div>
            </article>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Industry Suggestions
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {seo_data?.industry_categories?.length ? (
                  seo_data.industry_categories.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="rounded-lg bg-slate-50 px-3 py-2"
                    >
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">No suggestions yet.</li>
                )}
              </ul>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Ranking Suggestions
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {seo_data?.ranking_suggestions?.length ? (
                  seo_data.ranking_suggestions.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="rounded-lg bg-slate-50 px-3 py-2"
                    >
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">No ranking suggestions yet.</li>
                )}
              </ul>
            </article>
          </div>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              SERP Simulation (Top Results)
            </h3>
            <div className="mt-4 space-y-3">
              {seo_data?.serp_simulation?.length ? (
                seo_data.serp_simulation.map((item, index) => (
                  <div
                    key={`${item?.url || item?.title || "serp"}-${index}`}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <h4 className="font-semibold text-slate-900">{item?.title}</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      Type: {item?.type} | Words: {item?.words} | Strength: {item?.strength}
                    </p>
                    <a
                      href={item?.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block break-all text-sm text-cyan-700 hover:text-cyan-900 hover:underline"
                    >
                      {item?.url}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Run an analysis to see top-result simulation.
                </p>
              )}
            </div>
          </article>
        </section>
      )}
    </Layout>
  );
}
