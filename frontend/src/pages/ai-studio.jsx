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
  const [error, setError] = useState("");
  const [copyNotice, setCopyNotice] = useState("");

  // PROMPTS LIST
  const [promptList, setPromptList] = useState([]);

  // Copy function
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyNotice("Copied to clipboard");
      setTimeout(() => setCopyNotice(""), 1500);
    } catch (err) {
      console.log(err);
      setCopyNotice("Copy failed");
      setTimeout(() => setCopyNotice(""), 1500);
    }
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
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    if (activeTool === "prompt" && !template.trim()) {
      setError("Template cannot be empty.");
      return;
    }

    setError("");
    setLoading(true);
    setGenerated("");

    try {
      let response;

      switch (activeTool) {
        case "title":
          response = await generateTitle({ topic: topic.trim() });
          break;
        case "outline":
          response = await generateOutline({ topic: topic.trim() });
          break;
        case "meta":
          response = await generateMeta({ topic: topic.trim() });
          break;
        case "keyword":
          response = await generateKeyword({ topic: topic.trim() });
          break;
        case "writer":
          response = await generateFullArticle({ topic: topic.trim() });
          break;
        case "prompt":
          response = await generatePrompts({
            title: topic.trim(),
            template: template.trim(),
          });
          loadPrompts();
          break;
        default:
          break;
      }

      setGenerated(
        Array.isArray(response?.data?.result)
          ? response.data.result.join("\n")
          : response?.data?.result || JSON.stringify(response?.data, null, 2)
      );
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating output.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-900 to-sky-700 p-6 shadow-xl sm:p-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">AI Studio</h1>
        <p className="mt-2 max-w-3xl text-sm text-cyan-100 sm:text-base">
          Generate SEO-ready titles, outlines, metadata, keyword clusters, full drafts, and custom prompts from one workspace.
        </p>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tools.map((tool) => (
              <button
                key={tool.key}
                type="button"
                onClick={() => {
                  setActiveTool(tool.key);
                  setTopic("");
                  setTemplate("");
                  setGenerated("");
                  setError("");
                }}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                  AI Tool
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  {tool.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{tool.desc}</p>
                <p className="mt-4 text-sm font-semibold text-slate-900 group-hover:text-cyan-700">
                  Open tool
                </p>
              </button>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-6 xl:h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Saved Prompts</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {promptList.length}
            </span>
          </div>

          <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
            {promptList.length === 0 && (
              <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                No prompts available.
              </p>
            )}

            {promptList.map((p, index) => (
              <div
                key={`${p.title}-${index}`}
                className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="line-clamp-1 text-sm font-semibold text-slate-800">
                    {p.title}
                  </h3>
                  <button
                    type="button"
                    className="rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800"
                    onClick={() => copyText(p.template)}
                  >
                    Copy
                  </button>
                </div>
                <p className="mt-2 line-clamp-3 text-xs text-slate-600">
                  {p.template}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {copyNotice && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {copyNotice}
        </div>
      )}

      {activeTool && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setActiveTool(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {tools.find((t) => t.key === activeTool)?.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Provide your input and generate AI output instantly.
            </p>

            <label className="mb-1 mt-5 block text-sm font-semibold text-slate-700">
              Topic
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. smartwatch"
            />

            {activeTool === "prompt" && (
              <>
                <label className="mb-1 mt-4 block text-sm font-semibold text-slate-700">
                  Template
                </label>
                <textarea
                  className="h-28 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder="Write your template..."
                />
              </>
            )}

            {error && (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setActiveTool(null)}
                className="rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
              >
                Close
              </button>

              <button
                onClick={runTool}
                disabled={loading}
                className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>

            {generated && (
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">Output</h3>
                  <button
                    onClick={() => copyText(generated)}
                    className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Copy Output
                  </button>
                </div>

                <pre className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm whitespace-pre-wrap text-slate-800">
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
