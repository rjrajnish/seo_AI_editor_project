import { useState } from "react";
import Layout from "../components/Layout";  

export default function SEOIntelligence() {
      const [keyword, setKeyword] = useState("");
  return (
    <Layout>
        <h1 className="text-2xl font-bold mb-6">SEO Intelligence</h1>

      {/* Search Row */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter keyword or phrase..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border p-3 rounded flex-1"
        />
        <button className="bg-blue-600 text-white px-6 rounded hover:bg-blue-700">
          Analyze
        </button>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        {/* Volume */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Estimated Volume</h3>
          <p className="text-3xl font-bold">40k - 60k</p>
        </div>

        {/* Competition */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Competition</h3>
          <p className="text-3xl font-bold">40k - 60k</p>
        </div>

        {/* Related Keywords */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Related Keywords</h3>
          <ul className="text-gray-700 space-y-1">
            <li>- best smartwatch 2025</li>
            <li>- budget smartwatch</li>
            <li>- smartwatch battery life</li>
            <li>- android compatible smartwatch</li>
          </ul>
        </div>

      </div>

      {/* Middle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Industry Suggestions */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Industry Suggestions</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Add comparison table (original images)</li>
            <li>Add schema markup (ProductReview)</li>
            <li>Increase content to 1200+ words</li>
            <li>Acquire backlinks from tech blogs</li>
          </ul>
        </div>

        {/* Ranking Suggestions */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Ranking Suggestions</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Add comparison table (original images)</li>
            <li>Add schema markup (ProductReview)</li>
          </ul>
        </div>

      </div>

      {/* SERP Simulation */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">SERP Simulation (Top Results)</h3>

        <div className="space-y-4">

          <div className="border p-4 rounded-xl bg-gray-200">
            <h4 className="font-semibold">Result 1 Title - Example Site</h4>
            <p className="text-sm text-gray-600">
              Type: ecommerce | Words: 1000 | Strength: strong
            </p>
          </div>

          <div className="border p-4 rounded-xl bg-gray-200">
            <h4 className="font-semibold">Result 2 Title - Example Site</h4>
            <p className="text-sm text-gray-600">
              Type: ecommerce | Words: 1200 | Strength: strong
            </p>
          </div>

          <div className="border p-4 rounded-xl bg-gray-200">
            <h4 className="font-semibold">Result 3 Title - Example Site</h4>
            <p className="text-sm text-gray-600">
              Type: ecommerce | Words: 900 | Strength: medium
            </p>
          </div>

        </div>
      </div>
    </Layout>
  );
}
