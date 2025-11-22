import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  generateTitle,
  generateOutline,
  generateMeta,
  generateKeyword,
  generateFullArticle,
  generatePrompts,
  getAllPrompts,
} from "../apis";

export default function AIStudio() {
  const tools = [
    { key: "title", title: "Title Generator", desc: "Generate article titles" },
    { key: "outline", title: "Outline Generator", desc: "Generate outlines" },
    { key: "meta", title: "Metadata Generator", desc: "Generate SEO metadata" },
    {
      key: "keyword",
      title: "Keyword Clustering",
      desc: "Group related keywords",
    },
    { key: "writer", title: "AI Writer", desc: "Generate full article" },
    {
      key: "prompt",
      title: "Prompt Editor",
      desc: "Create/edit custom prompts",
    },
  ];

  const [activeTool, setActiveTool] = useState(null);
  const [topic, setTopic] = useState("");
  const [template, setTemplate] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);

  // PROMPTS LIST
  const [promptList, setPromptList] = useState([]);

  // Copy function
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  // Fetch prompts on load
  const loadPrompts = async () => {
    try {
      const res = await getAllPrompts();
      if (res?.data) setPromptList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  // Handle AI tool call
  const runTool = async () => {
    if (!topic) {
      alert("Please enter a topic");
      return;
    }

    setLoading(true);
    setGenerated("");

    try {
      let response;

      switch (activeTool) {
        case "title":
          response = await generateTitle({ topic });
          break;
        case "outline":
          response = await generateOutline({ topic });
          break;
        case "meta":
          response = await generateMeta({ topic });
          break;
        case "keyword":
          response = await generateKeyword({ topic });
          break;
        case "writer":
          response = await generateFullArticle({ topic });
          break;
        case "prompt":
          if (!template) {
            alert("Template cannot be empty");
            setLoading(false);
            return;
          }
          response = await generatePrompts({ title: topic, template });
          loadPrompts(); // refresh prompts list
          break;
        default:
          break;
      }

      setGenerated(
        response?.data?.result || JSON.stringify(response?.data, null, 2)
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">AI Studio</h1>

      <div className="flex flex-row gap-2 w-full">
        {/* ===========================
      LEFT SIDE – TOOLS (50%)
  ============================ */}
        <div className="w-1/2 grid grid-cols-1 gap-2">
          {tools.map((tool) => (
            <div
              key={tool.key}
              onClick={() => {
                setActiveTool(tool.key);
                setTopic("");
                setTemplate("");
                setGenerated("");
              }}
              className="bg-white p-3   rounded-xl shadow hover:shadow-md 
                   transition cursor-pointer   "
            >
              <h2 className="text-lg font-semibold">{tool.title}</h2>
              <p className="text-gray-600 text-sm">{tool.desc}</p>
            </div>
          ))}
        </div>

        {/* ===========================
      RIGHT SIDE – PROMPT LIST (50%)
  ============================ */}
        <div className="w-1/2 bg-white p-4 rounded-xl shadow h-full">
          <h2 className="text-lg font-bold mb-3">Saved Prompts</h2>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {promptList.length === 0 && (
              <p className="text-gray-400 text-sm">No prompts available.</p>
            )}
 
            {promptList.map((p, index) => (
              <div
                key={index}
                className="border p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                 onClick={(e) => {
                      e.stopPropagation();
                      copyText(p.template);
                    }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm">{p.title}</h3>

                  <button
                    className="text-blue-600 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyText(p.template);
                    }}
                  >
                    📋
                  </button>
                </div>

                <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                  {p.template}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===========================
          MAIN MODAL
      ============================ */}
      {activeTool && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[600px] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              {tools.find((t) => t.key === activeTool)?.title}
            </h2>

            {/* Topic */}
            <label className="font-medium block mb-1">Topic</label>
            <input
              className="border p-2 rounded w-full mb-4"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. smartwatch"
            />

            {/* Template only for prompt editor */}
            {activeTool === "prompt" && (
              <>
                <label className="font-medium block mb-1">Template</label>
                <textarea
                  className="border p-2 rounded w-full h-24 mb-4"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder="Write your template..."
                />
              </>
            )}

            <div className="flex justify-end gap-3 mb-4">
              <button
                onClick={() => setActiveTool(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>

              <button
                onClick={runTool}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>

            {/* RESULT SECTION */}
            {generated && (
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold mb-2">Output</h3>

                  {/* COPY OUTPUT BUTTON */}
                  <button
                    onClick={() => copyText(generated)}
                    className="text-blue-600 text-sm"
                  >
                    📋 Copy
                  </button>
                </div>

                <pre className="bg-gray-100 p-4 rounded max-h-80 overflow-y-auto text-sm whitespace-pre-wrap">
                  {generated}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
