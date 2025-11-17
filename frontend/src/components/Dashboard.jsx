import { useState } from "react";
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
  function TotalArticle() {
    return (
      <div className="col-span-1 md:col-span-1 bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Total Articles</h3>
        <div className="flex items-center justify-between text-center">
          <div className="text-5xl font-bold">125</div>
          <div className="text-2xl text-gray-500">
            23 <p className="text-sm">Needs Improvement</p>
          </div>
        </div>
      </div>
    );
  }
  function MonthlyTraffic() {
     const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const data = {
    labels,
    datasets: [
      {
        label: "Monthly Visits",
        data: [1800, 2200, 2000, 2600, 3000, 2700, 3500],
        borderColor: "rgba(59,130,246,1)",        // blue-500
        backgroundColor: "rgba(59,130,246,0.15)", // light area fill
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: "rgba(59,130,246,1)"
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#4b5563" },
      },
      y: {
        grid: { color: "#e5e7eb" },
        ticks: { color: "#4b5563", beginAtZero: true },
      },
    },
  };

  return (
    <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Monthly Traffic</h3>

      <div className="h-48">
        <Line data={data} options={options} />
      </div>
    </div>
  );
  }

  function RecentActivity() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow h-[auto]">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ul className="list-disc ml-6 space-y-2 text-sm">
            <li>
              You optimized "Top 10 Project Management Tools (2025)" on
              2024-04-03
            </li>
            <li>You edited "The Future of Remote Work Trends" on 2024-04-09</li>
            <li>
              You published "Ultimate Guide to SaaS Security" on 2024-04-01
            </li>
             <li>
              You optimized "Top 10 Project Management Tools (2025)" on
              2024-04-03
            </li>
            <li>You edited "The Future of Remote Work Trends" on 2024-04-09</li>
            <li>
              You published "Ultimate Guide to SaaS Security" on 2024-04-01
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ul className="list-disc ml-6 space-y-2 text-sm">
            <li>
              You optimized "Top 10 Project Management Tools (2025)" on
              2024-04-03
            </li>
            <li>You edited "The Future of Remote Work Trends" on 2024-04-09</li>
            <li>
              You published "Ultimate Guide to SaaS Security" on 2024-04-01
            </li>
          </ul>
        </div>
      </div>
    );
  }

  function AIAlerts() {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">AI Alerts</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <strong>2024-04-02</strong> Suggestion: Add '2025 office setup'
            section to your article
          </li>
          <li>
            <strong>2024-09-25</strong> New content recommendations are
            available
          </li>
          <li>
            <strong>2024-09-20</strong> Metadata improvement tips have been
            updated
          </li>
        </ul>
      </div>
    );
  }

  function KeyOppertunity() {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Keyword Opportunities</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>best productivity tools</li>
          <li>cloud storage comparison</li>
          <li>how to improve website SEO</li>
        </ul>
      </div>
    );
  }


//   ---------main code---------
  return (
    <div className="flex   bg-gray-100">
      <main className="flex-1 ">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-gray-600">User: Rajnish</p>
        </header>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Articles */}
          <TotalArticle />
          {/* Monthly Traffic */}
          <MonthlyTraffic />
        </div>

        {/* Lower Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Keyword Opportunities */}
          <KeyOppertunity />
          {/* AI Alerts */}
          <AIAlerts />
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </main>
    </div>
  );
}
