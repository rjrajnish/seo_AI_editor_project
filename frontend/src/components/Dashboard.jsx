import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardLayout() {
  const [range, setRange] = useState("6m");

  const trafficByRange = {
    "6m": {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [1800, 2200, 2100, 2600, 2950, 3400],
    },
    "12m": {
      labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [1300, 1400, 1700, 1950, 2300, 2100, 1800, 2200, 2100, 2600, 2950, 3400],
    },
  };

  const recentActivities = [
    { title: "Optimized 'Top 10 Project Management Tools (2026)'", date: "2026-03-05", action: "Optimized" },
    { title: "Edited 'The Future of Remote Work Trends'", date: "2026-03-03", action: "Edited" },
    { title: "Published 'Ultimate Guide to SaaS Security'", date: "2026-03-01", action: "Published" },
    { title: "Refreshed internal links on 'Best CRM Platforms'", date: "2026-02-28", action: "Updated" },
  ];

  const aiAlerts = [
    { date: "2026-03-06", message: "6 articles missing schema markup", level: "High" },
    { date: "2026-03-04", message: "Meta descriptions too short in 4 articles", level: "Medium" },
    { date: "2026-03-02", message: "New ranking opportunities detected in SaaS cluster", level: "Low" },
  ];

  const keywordOpportunities = [
    "best productivity tools",
    "cloud storage comparison",
    "website seo checklist",
    "ai content strategy",
    "seo audit template",
    "content refresh process",
  ];

  const trafficTotal = useMemo(
    () => trafficByRange[range].values.reduce((acc, val) => acc + val, 0),
    [range]
  );

  const stats = useMemo(
    () => [
      {
        title: "Total Articles",
        value: "125",
        note: "23 need improvements",
        trend: "+8.2%",
        tone: "text-emerald-600",
      },
      {
        title: "Organic Visits",
        value: trafficTotal.toLocaleString(),
        note: `${range === "6m" ? "Last 6 months" : "Last 12 months"}`,
        trend: "+12.4%",
        tone: "text-emerald-600",
      },
      {
        title: "AI Alerts",
        value: `${aiAlerts.length}`,
        note: "1 high-priority issue",
        trend: "-2 from last week",
        tone: "text-amber-600",
      },
      {
        title: "Keyword Gaps",
        value: `${keywordOpportunities.length}`,
        note: "Ready-to-target opportunities",
        trend: "+3 new",
        tone: "text-sky-600",
      },
    ],
    [aiAlerts.length, keywordOpportunities.length, range, trafficTotal]
  );

  const chartData = useMemo(
    () => ({
      labels: trafficByRange[range].labels,
      datasets: [
        {
          label: "Monthly Visits",
          data: trafficByRange[range].values,
          borderColor: "#0891b2",
          backgroundColor: "rgba(8,145,178,0.12)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: "#0891b2",
          borderWidth: 2,
        },
      ],
    }),
    [range]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0f172a",
          titleColor: "#f8fafc",
          bodyColor: "#cbd5e1",
          displayColors: false,
        },
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
    }),
    []
  );

  const getAlertBadge = (level) => {
    if (level === "High") {
      return "bg-red-100 text-red-700 border-red-200";
    }
    if (level === "Medium") {
      return "bg-amber-100 text-amber-700 border-amber-200";
    }
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  };

  return (
    <div className="min-h-full bg-slate-50">
      <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Monitor content performance, SEO opportunities, and AI suggestions in one place.
            </p>
          </div>
          <div className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            {new Date().toLocaleDateString()}
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-sm font-medium text-slate-500">{item.title}</p>
              <div className="mt-3 flex items-end justify-between gap-2">
                <p className="text-3xl font-bold text-slate-900">{item.value}</p>
                <span className={`text-xs font-semibold ${item.tone}`}>{item.trend}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">{item.note}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Monthly Traffic</h3>
              <div className="inline-flex w-fit rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setRange("6m")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                    range === "6m" ? "bg-white text-slate-900 shadow" : "text-slate-600"
                  }`}
                >
                  Last 6 months
                </button>
                <button
                  type="button"
                  onClick={() => setRange("12m")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                    range === "12m" ? "bg-white text-slate-900 shadow" : "text-slate-600"
                  }`}
                >
                  Last 12 months
                </button>
              </div>
            </div>
            <div className="h-72">
              <Line data={chartData} options={chartOptions} />
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">AI Alerts</h3>
            <div className="mt-4 space-y-3">
              {aiAlerts.map((alert) => (
                <div key={`${alert.date}-${alert.message}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-slate-500">{alert.date}</p>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${getAlertBadge(
                        alert.level
                      )}`}
                    >
                      {alert.level}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{alert.message}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
            <ul className="mt-4 space-y-3">
              {recentActivities.map((item) => (
                <li
                  key={`${item.date}-${item.title}`}
                  className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">{item.action}</p>
                    <span className="text-xs text-slate-500">{item.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.title}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Keyword Opportunities</h3>
            <p className="mt-1 text-sm text-slate-500">
              Prioritize these terms to improve rankings in your next content cycle.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {keywordOpportunities.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
