// src/pages/Analytics.jsx
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

export default function Analytics() {
  // sample time labels and values
  const labels = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

  const trafficData = {
    labels,
    datasets: [
      {
        label: "Sessions",
        data: [1200, 2100, 1600, 2800, 3300, 3800, 4400],
        fill: true,
        tension: 0.35,
        backgroundColor: "rgba(59,130,246,0.12)", // blue-500 12%
        borderColor: "rgba(59,130,246,1)",
        pointBackgroundColor: "rgba(59,130,246,1)",
        pointRadius: 4,
      },
    ],
  };

  const rankingData = {
    labels,
    datasets: [
      {
        label: "Avg. Ranking Score",
        data: [45, 60, 55, 72, 68, 80, 92],
        fill: false,
        tension: 0.35,
        borderColor: "rgba(34,197,94,1)", // green-500
        backgroundColor: "rgba(34,197,94,0.08)",
        pointRadius: 4,
      },
    ],
  };

  const doughnutData = {
    labels: ["Informational", "Navigational", "Transactional", "Commercial"],
    datasets: [
      {
        data: [25, 25, 25, 25],
        backgroundColor: [
          "rgba(59,130,246,1)",
          "rgba(96,165,250,0.8)",
          "rgba(34,197,94,1)",
          "rgba(14,165,233,0.8)",
        ],
        hoverOffset: 8,
      },
    ],
  };

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
        ticks: { color: "#4b5563" },
      },
      y: {
        grid: { color: "#e6edf3" },
        ticks: { color: "#4b5563", beginAtZero: true },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {},
    },
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Top Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Traffic Overview */}
        <div className="bg-white p-6 rounded-xl shadow h-[300px]">
          <h3 className="text-lg font-semibold mb-4">Traffic Overview</h3>
          <div className="h-full">
            <Line data={trafficData} options={lineOptions} />
          </div>
        </div>

        {/* Keyword Rankings */}
        <div className="bg-white p-6 rounded-xl shadow h-[300px]">
          <h3 className="text-lg font-semibold mb-4">Keyword Rankings</h3>
          <div className="h-full">
            <Line data={rankingData} options={lineOptions} />
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Top Pages */}
        <div className="bg-white p-6 rounded-xl shadow md:col-span-2">
            <div className="flex justify-between"> <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
          <h3 className="text-lg font-semibold mb-4">Avarage CTR: 3.52%</h3></div>
         
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-600 border-b bg-gray-100">
                <th className="py-2">Page Title</th>
                <th className="py-2">Views</th>
                <th className="py-2">CTR</th>
                <th className="py-2">Avg.</th>
                <th className="py-2">Svs.</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="py-2">Page Title 1</td>
                <td className="py-2">35,210</td>
                <td className="py-2">4.25%</td>
                <td className="py-2">11</td>
                <td className="py-2">—</td>
              </tr>

              <tr className="border-b">
                <td className="py-2">Page Title 2</td>
                <td className="py-2">26,170</td>
                <td className="py-2">4.25%</td>
                <td className="py-2">12</td>
                <td className="py-2">—</td>
              </tr>

              <tr className="border-b">
                <td className="py-2">Page Title 3</td>
                <td className="py-2">17,735</td>
                <td className="py-2">3.70%</td>
                <td className="py-2">10</td>
                <td className="py-2">—</td>
              </tr>

         
              <tr className="border-b">
                <td className="py-2">Page Title 4</td>
                <td className="py-2">7,739</td>
                <td className="py-2">4.25%</td>
                <td className="py-2">9</td>
                <td className="py-2">—</td>
              </tr>
        
              <tr  >
                <td className="py-2">Page Title 4</td>
                <td className="py-2">7,739</td>
                <td className="py-2">4.25%</td>
                <td className="py-2">9</td>
                <td className="py-2">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Average CTR + Doughnut */}
        <div className="space-y-6">
           

          <div className="bg-white p-6 rounded-xl shadow h-[340px] ">
            <h3 className="text-lg font-semibold mb-4">Average Position</h3>
            <div className="h-[260px]  flex justify-center items-center text-2xl font-semibold text-gray-600  ">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search Intent Distribution */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">
            Search Intent Distribution
          </h3>

          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Informational — 25%
            </li>

            <li className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-300 rounded-full"></span>
              Navigational — 25%
            </li>

            <li className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Transactional — 25%
            </li>

            <li className="flex items-center gap-2">
              <span className="w-3 h-3 bg-sky-400 rounded-full"></span>
              Commercial — 25%
            </li>
          </ul>
        </div>

        {/* Empty / Future widgets */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Notes</h3>
          <p className="text-sm text-gray-600">
            Add widgets like device breakdown, geo, etc.
          </p>
        </div>
      </div>
    </Layout>
  );
}
