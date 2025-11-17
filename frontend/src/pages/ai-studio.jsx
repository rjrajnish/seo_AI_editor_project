import Layout from "../components/Layout";

export default function AIStudio() {
  const tools = [
    { title: "AI Writer", desc: "Generate articles or blog posts" },
    { title: "Title Generator", desc: "Generate titles for articles" },
    { title: "Outline Generator", desc: "Generate outlines for articles" },
    {
      title: "Metadata Generator",
      desc: "Generate meta descriptions and tags",
    },
    { title: "Keyword Clustering", desc: "Group related keywords" },
    { title: "Prompt Editor", desc: "Create and edit custom prompts" },
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">AI Studio</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">{tool.title}</h2>
            <p className="text-gray-600">{tool.desc}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
