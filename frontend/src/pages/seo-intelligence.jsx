import { useState } from "react";
import Layout from "../components/Layout";
import { getSEO_Intelligence } from "../apis";

export default function SEOIntelligence() {
  const [keyword, setKeyword] = useState("");
  const [seo_data, setSeoData] = useState({});
  const fetchSeoIntelligence = async () => {
    if (!keyword) return;
    try {
      const data = {
        keyword: keyword,
      };
      const response = await getSEO_Intelligence(data);

      setSeoData(response?.data);
      console.log(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(seo_data);
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
        <button
          disabled={!keyword}
          onClick={() => fetchSeoIntelligence(keyword)}
          className="bg-blue-600 text-white px-6 rounded hover:bg-blue-700"
        >
          Analyze
        </button>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Volume */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-bold text-gray-600 mb-2">
            Estimated Volume
          </h3>
          <p className="text-3xl font-bold">{seo_data?.estimated_volume} </p>
        </div>

        {/* Competition */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-bold text-gray-600 mb-2">
            Competition
          </h3>
          <p className="text-3xl font-bold">{seo_data?.competition} </p>
        </div>

        {/* Related Keywords */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Related Keywords</h3>
          <ul className="text-gray-700 space-y-1">
            {seo_data?.related_keywords?.map((item, index) => (
              <li key={index}>{item?.keyword}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Middle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Industry Suggestions */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Industry Suggestions</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            {seo_data?.industry_categories?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Ranking Suggestions */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Ranking Suggestions</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            {seo_data?.ranking_suggestions?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* SERP Simulation */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">
          SERP Simulation (Top Results)
        </h3>

        <div className="space-y-4">
          {seo_data?.serp_simulation?.map((item, index) => (
            <div className="border p-4 rounded-xl bg-gray-200">
              <h4 className="font-semibold"> {item?.title} </h4>
              <p className="text-sm text-gray-600">
                Type:  {item?.type} | Words:  {item?.words}| Strength: {item?.strength}
              </p>
              <a  href={item?.url} target="_blank" className="text-black">{item?.url}</a>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
