import { useState } from "react";
import Layout from "../components/Layout";

export default function Settings() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);

  const settings = [
    {
      title: "User Profile",
      desc: "Manage your account information",
      content: "Here you can update your name, email, password, and personal info."
    },
    {
      title: "API Keys",
      desc: "Configure API keys for integrations",
      content: "Add, update, or delete API keys used by external services."
    },
    {
      title: "Article Defaults",
      desc: "Set default options for new articles",
      content: "Choose default SEO settings, templates, and writing patterns."
    },
    {
      title: "SEO Rules",
      desc: "Establish guidelines for SEO optimization",
      content: "Define meta rules, keyword density, readability metrics, etc."
    },
    {
      title: "System Logs",
      desc: "View and manage system logs",
      content: "Track system activity, errors, warnings, and user logs."
    },
  ];

  const openSettingModal = (item) => {
    setSelectedSetting(item);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedSetting(null);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((item, index) => (
          <div
            key={index}
            onClick={() => openSettingModal(item)}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          
          {/* Modal box */}
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative">
            
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-semibold mb-4">
              {selectedSetting?.title}
            </h2>

            <p className="text-gray-700 mb-6">{selectedSetting?.content}</p>

            <div className="text-right">
              <button
                onClick={closeModal}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
