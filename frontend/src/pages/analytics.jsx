import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const analyticsByRange = {
  "30d": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    sessions: [4200, 4700, 5200, 6100],
    ranking: [64, 68, 71, 74],
    topPages: [
      {
        title: "SEO Checklist for SaaS Startups",
        views: 18750,
        ctr: 4.8,
        avgPosition: 9.2,
        trafficShare: 22,
      },
      {
        title: "How to Build Topic Clusters in 2026",
        views: 14360,
        ctr: 4.1,
        avgPosition: 10.8,
        trafficShare: 17,
      },
      {
        title: "Meta Description Optimization Guide",
        views: 11840,
        ctr: 3.7,
        avgPosition: 12.2,
        trafficShare: 14,
      },
      {
        title: "AI Content Brief Template",
        views: 9260,
        ctr: 4.2,
        avgPosition: 11.4,
        trafficShare: 11,
      },
      {
        title: "Internal Linking Strategy Playbook",
        views: 7815,
        ctr: 3.5,
        avgPosition: 13.1,
        trafficShare: 9,
      },
    ],
    intent: [38, 21, 18, 23],
  },
  "90d": {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    sessions: [9800, 11200, 12400, 13900, 15200, 16600],
    ranking: [56, 60, 62, 66, 69, 73],
    topPages: [
      {
        title: "SEO Checklist for SaaS Startups",
        views: 49810,
        ctr: 4.3,
        avgPosition: 10.2,
        trafficShare: 20,
      },
      {
        title: "How to Build Topic Clusters in 2026",
        views: 44175,
        ctr: 3.9,
        avgPosition: 11.8,
        trafficShare: 18,
      },
      {
        title: "Programmatic SEO: End-to-End Framework",
        views: 38990,
        ctr: 3.6,
        avgPosition: 13.1,
        trafficShare: 16,
      },
      {
        title: "Meta Description Optimization Guide",
        views: 30145,
        ctr: 3.4,
        avgPosition: 13.7,
        trafficShare: 12,
      },
      {
        title: "Internal Linking Strategy Playbook",
        views: 25770,
        ctr: 3.2,
        avgPosition: 14.6,
        trafficShare: 10,
      },
    ],
    intent: [40, 19, 17, 24],
  },
  "12m": {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    sessions: [8200, 8400, 9100, 9800, 11200, 12400, 13900, 15200, 16600, 18050, 19400, 21200],
    ranking: [48, 50, 52, 56, 60, 62, 66, 69, 73, 75, 78, 81],
    topPages: [
      {
        title: "SEO Checklist for SaaS Startups",
        views: 192340,
        ctr: 4.0,
        avgPosition: 11.1,
        trafficShare: 18,
      },
      {
        title: "How to Build Topic Clusters in 2026",
        views: 175620,
        ctr: 3.7,
        avgPosition: 12.4,
        trafficShare: 16,
      },
      {
        title: "Programmatic SEO: End-to-End Framework",
        views: 158910,
        ctr: 3.5,
        avgPosition: 13.3,
        trafficShare: 14,
      },
      {
        title: "Technical SEO Monitoring Setup",
        views: 137280,
        ctr: 3.2,
        avgPosition: 14.1,
        trafficShare: 12,
      },
      {
        title: "Internal Linking Strategy Playbook",
        views: 120440,
        ctr: 3.1,
        avgPosition: 15.0,
        trafficShare: 10,
      },
    ],
    intent: [42, 18, 16, 24],
  },
};

export default function Analytics() {
  const [range, setRange] = useState("90d");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("views");
  const [sortOrder, setSortOrder] = useState("desc");

  const currentData = analyticsByRange[range];

  const totals = useMemo(() => {
    const sessions = currentData.sessions;
    const rankings = currentData.ranking;

    const totalSessions = sessions.reduce((acc, value) => acc + value, 0);
    const latestSessions = sessions[sessions.length - 1] || 0;
    const previousSessions = sessions[sessions.length - 2] || 0;
    const sessionsTrend = previousSessions
      ? ((latestSessions - previousSessions) / previousSessions) * 100
      : 0;

    const avgRanking =
      rankings.reduce((acc, value) => acc + value, 0) / (rankings.length || 1);
    const latestRank = rankings[rankings.length - 1] || 0;
    const previousRank = rankings[rankings.length - 2] || 0;
    const rankTrend = latestRank - previousRank;

    const avgCtr =
      currentData.topPages.reduce((acc, page) => acc + page.ctr, 0) /
      (currentData.topPages.length || 1);

    return {
      totalSessions,
      latestSessions,
      sessionsTrend,
      avgRanking,
      rankTrend,
      avgCtr,
    };
  }, [currentData]);

  const topPages = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = currentData.topPages.filter((page) =>
      page.title.toLowerCase().includes(query)
    );

    const sorted = [...filtered].sort((a, b) => {
      const left = a[sortBy];
      const right = b[sortBy];

      if (typeof left === "string") {
        return sortOrder === "asc"
          ? left.localeCompare(right)
          : right.localeCompare(left);
      }

      return sortOrder === "asc" ? left - right : right - left;
    });

    return sorted;
  }, [currentData.topPages, search, sortBy, sortOrder]);

  const trafficData = useMemo(
    () => ({
      labels: currentData.labels,
      datasets: [
        {
          label: "Sessions",
          data: currentData.sessions,
          fill: true,
          tension: 0.35,
          backgroundColor: "rgba(8,145,178,0.12)",
          borderColor: "#0891b2",
          pointBackgroundColor: "#0891b2",
          pointRadius: 3,
          borderWidth: 2,
        },
      ],
    }),
    [currentData]
  );

  const rankingData = useMemo(
    () => ({
      labels: currentData.labels,
      datasets: [
        {
          label: "Avg Ranking Score",
          data: currentData.ranking,
          fill: false,
          tension: 0.35,
          borderColor: "#16a34a",
          backgroundColor: "rgba(22,163,74,0.08)",
          pointRadius: 3,
          borderWidth: 2,
        },
      ],
    }),
    [currentData]
  );

  const doughnutData = useMemo(
    () => ({
      labels: ["Informational", "Navigational", "Transactional", "Commercial"],
      datasets: [
        {
          data: currentData.intent,
          backgroundColor: ["#0284c7", "#06b6d4", "#16a34a", "#0ea5e9"],
          hoverOffset: 6,
          borderWidth: 0,
        },
      ],
    }),
    [currentData]
  );

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b" },
      },
      y: {
        grid: { color: "#e2e8f0" },
        ticks: { color: "#64748b", beginAtZero: true },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { color: "#475569" } },
      tooltip: {},
    },
    cutout: "65%",
  };

  const changeSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const formatTrend = (value, suffix = "%") => {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}${suffix}`;
  };

  return (
    <Layout>
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-900 to-sky-700 p-6 shadow-xl sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Analytics</h1>
            <p className="mt-2 max-w-3xl text-sm text-cyan-100 sm:text-base">
              Track SEO growth, ranking trends, and page-level performance with a single responsive analytics workspace.
            </p>
          </div>

          <div className="inline-flex w-fit rounded-xl bg-white/15 p-1">
            {[
              { key: "30d", label: "30 Days" },
              { key: "90d", label: "90 Days" },
              { key: "12m", label: "12 Months" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setRange(item.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  range === item.key
                    ? "bg-white text-slate-900"
                    : "text-cyan-100 hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Sessions</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totals.totalSessions.toLocaleString()}
          </p>
          <p className="mt-2 text-xs font-semibold text-emerald-600">
            {formatTrend(totals.sessionsTrend)} vs previous period
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Latest Sessions</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totals.latestSessions.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-slate-500">Current interval snapshot</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Average Ranking</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totals.avgRanking.toFixed(1)}
          </p>
          <p className="mt-2 text-xs font-semibold text-emerald-600">
            {formatTrend(totals.rankTrend, " pts")} in latest interval
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Average CTR</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totals.avgCtr.toFixed(2)}%
          </p>
          <p className="mt-2 text-xs text-slate-500">Based on tracked top pages</p>
        </article>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Traffic Overview</h3>
          <div className="mt-4 h-72">
            <Line data={trafficData} options={lineOptions} />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Keyword Rankings</h3>
          <div className="mt-4 h-72">
            <Line data={rankingData} options={lineOptions} />
          </div>
        </article>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Top Pages</h3>

            <div className="flex w-full gap-2 sm:w-auto">
              <input
                type="text"
                placeholder="Search pages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 sm:w-64"
              />
            </div>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4">
                    <button type="button" onClick={() => changeSort("title")}>Page Title</button>
                  </th>
                  <th className="py-2 pr-4">
                    <button type="button" onClick={() => changeSort("views")}>Views</button>
                  </th>
                  <th className="py-2 pr-4">
                    <button type="button" onClick={() => changeSort("ctr")}>CTR</button>
                  </th>
                  <th className="py-2 pr-4">
                    <button type="button" onClick={() => changeSort("avgPosition")}>Avg Position</button>
                  </th>
                  <th className="py-2 pr-4">
                    <button type="button" onClick={() => changeSort("trafficShare")}>Traffic Share</button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page) => (
                  <tr key={page.title} className="border-b border-slate-100 hover:bg-slate-50/70">
                    <td className="py-3 pr-4 font-medium text-slate-800">{page.title}</td>
                    <td className="py-3 pr-4 text-slate-700">{page.views.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-slate-700">{page.ctr.toFixed(2)}%</td>
                    <td className="py-3 pr-4 text-slate-700">{page.avgPosition.toFixed(1)}</td>
                    <td className="py-3 pr-4 text-slate-700">{page.trafficShare}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 lg:hidden">
            {topPages.map((page) => (
              <div key={page.title} className="rounded-xl border border-slate-200 p-3">
                <h4 className="text-sm font-semibold text-slate-800">{page.title}</h4>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <p>Views: {page.views.toLocaleString()}</p>
                  <p>CTR: {page.ctr.toFixed(2)}%</p>
                  <p>Avg Pos: {page.avgPosition.toFixed(1)}</p>
                  <p>Share: {page.trafficShare}%</p>
                </div>
              </div>
            ))}
          </div>

          {topPages.length === 0 && (
            <p className="mt-3 text-sm text-slate-500">No pages matched your search.</p>
          )}
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Search Intent Mix</h3>
          <div className="mt-4 h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>

          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Informational: {currentData.intent[0]}%</li>
            <li>Navigational: {currentData.intent[1]}%</li>
            <li>Transactional: {currentData.intent[2]}%</li>
            <li>Commercial: {currentData.intent[3]}%</li>
          </ul>
        </article>
      </section>
    </Layout>
  );
}
