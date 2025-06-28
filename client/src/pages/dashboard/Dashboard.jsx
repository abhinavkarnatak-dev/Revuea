import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import FormInfoCard from "../../components/forms/FromInfoCard";
import CreateFormModal from "../../components/forms/CreateFormModal";
import EditFormModal from "../../components/forms/EditFormModal";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Button from "../../components/layout/Button";
import { motion } from "motion/react";

const Colors = [
  "#4ade80",
  "#60a5fa",
  "#f472b6",
  "#fbbf24",
  "#a78bfa",
  "#f87171",
];

const Dashboard = () => {
  const { token } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [selectedForm, setSelectedForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [analytics, setAnalytics] = useState(null);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const openModal = async (form) => {
    try {
      const res = await axios.get(`/api/form/${form.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedForm(res.data.data);
      setIsModalOpen(true);
      setSelectedTab("overview");
      setAnalytics(null);
      setSummary("");
    } catch {
      toast.error("Failed to fetch form data");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
  };

  const handleEditForm = async (formId) => {
    try {
      const res = await axios.get(`/api/form/${formId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditFormData(res.data.data);
      setIsEditOpen(true);
    } catch {
      toast.error("Failed to fetch form data for editing");
    }
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditFormData(null);
  };

  const handleFormUpdated = () => {
    fetchForms();
    closeEditModal();
  };

  const fetchAnalytics = async () => {
    if (!selectedForm) return;
    try {
      const res = await axios.get(`/api/form/${selectedForm.id}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data.data);
    } catch {
      toast.error("Failed to load analytics");
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setSummaryLoading(true);
      const res = await axios.get(`/api/form/${selectedForm.id}/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data.data.summary);
    } catch (err) {
      toast.error("Failed to generate summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchForms = async () => {
    try {
      const res = await axios.get("/api/form/my-forms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForms(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      toast.error("Error fetching forms");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (!selectedForm) return;
    try {
      const response = await axios.get(
        `/api/response/form/${selectedForm.id}/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `form-${selectedForm.id}-responses.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV");
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    if (selectedTab === "analytics") fetchAnalytics();
  }, [selectedTab]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (isCreateOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isCreateOpen]);

  return (
    <>
      {isModalOpen && selectedForm && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 overflow-hidden"
          onClick={closeModal}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div
            className="w-[90%] h-[80%] bg-[#0f111a] rounded-lg text-white flex relative border border-gray-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-5 text-xl text-gray-400 font-outfit-400 hover:text-red-500 transition-all duration-300 z-10 cursor-pointer"
              onClick={closeModal}
            >
              ×
            </button>

            <div className="w-1/4 md:w-1/4 border-r border-gray-700 flex flex-col justify-between p-1 pt-3 md:p-6">
              <div className="flex flex-col items-center gap-4 font-outfit-400">
                <button
                  onClick={() => setSelectedTab("overview")}
                  className={`block text-xs md:text-sm lg:text-base w-[90%] md:w-full px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedTab === "overview"
                      ? "bg-purple-600"
                      : "hover:bg-gray-800"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setSelectedTab("analytics")}
                  className={`block text-xs md:text-sm lg:text-base w-[90%] md:w-full px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedTab === "analytics"
                      ? "bg-purple-600"
                      : "hover:bg-gray-800"
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => setSelectedTab("summary")}
                  className={`block text-xs md:text-sm lg:text-base w-[90%] md:w-full px-2 md:px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedTab === "summary"
                      ? "bg-purple-600"
                      : "hover:bg-gray-800"
                  }`}
                >
                  Summary
                </button>
              </div>
              <div className="flex flex-col gap-3 p-2 md:p-0">
                {new Date(selectedForm.endTime) > new Date() && (
                  <Button
                    variant="white"
                    width="w-full"
                    onClick={() => {
                      setEditFormData(selectedForm);
                      setIsEditOpen(true);
                      closeModal();
                    }}
                  >
                    Edit
                  </Button>
                )}
                <div className="flex flex-col md:flex-row gap-3 font-outfit-400">
                  {new Date(selectedForm.endTime) > new Date() && (
                    <>
                      <Button
                        width="w-full md:w-1/2"
                        onClick={() => {
                          const link = `${window.location.origin}/form/${selectedForm.id}/fill`;

                          if (
                            navigator.clipboard &&
                            navigator.clipboard.writeText
                          ) {
                            navigator.clipboard
                              .writeText(link)
                              .then(() => toast.success("Copied to clipboard"))
                              .catch(() => fallbackCopy(link));
                          } else {
                            fallbackCopy(link);
                          }

                          function fallbackCopy(text) {
                            const textArea = document.createElement("textarea");
                            textArea.value = text;
                            textArea.style.position = "fixed";
                            textArea.style.top = "-9999px";
                            document.body.appendChild(textArea);
                            textArea.focus();
                            textArea.select();
                            try {
                              document.execCommand("copy");
                              toast.success("Copied to clipboard");
                            } catch (err) {
                              toast.error("Copy failed");
                            }
                            document.body.removeChild(textArea);
                          }
                        }}
                      >
                        Share
                      </Button>

                      <Button
                        variant="red"
                        width="w-full md:w-1/2"
                        onClick={async () => {
                          try {
                            await axios.patch(
                              `/api/form/${selectedForm.id}/end`,
                              {},
                              {
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                            toast.success("Form ended");
                            fetchForms();
                            closeModal();
                          } catch {
                            toast.error("Couldn't end form");
                          }
                        }}
                      >
                        End
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="w-3/4 overflow-y-auto">
              <div className="relative border-b border-gray-700 p-6">
                <img
                  src={selectedForm.theme}
                  className="absolute inset-0 object-fill w-full h-full opacity-[35%] z-0"
                  alt="Card Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/40 pointer-events-none z-0" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/40 pointer-events-none z-0" />
                <h2 className="relative text-xl md:text-2xl lg:text-3xl font-bold mb-2 font-outfit-600 [text-shadow:_0_1px_3px_rgba(0,0,0,1)] z-10">
                  Title: {selectedForm.title}
                </h2>
                <p className="relative mb-2 text-xs md:text-sm lg:text-base text-gray-300 font-outfit-400 [text-shadow:_0_1px_3px_rgba(0,0,0,1)] z-10">
                  Description: {selectedForm.description}
                </p>
                <p className="relative text-xs text-gray-400 font-outfit-400 [text-shadow:_0_1px_3px_rgba(0,0,0,1)] z-10">
                  Created on:{" "}
                  {new Date(selectedForm.startTime).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
                <p className="relative text-xs text-gray-400 mb-4 font-outfit-400 [text-shadow:_0_1px_3px_rgba(0,0,0,1)] z-10">
                  {new Date(selectedForm.endTime) < new Date()
                    ? "Closed on: "
                    : "Closes on: "}
                  {new Date(selectedForm.endTime).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
              </div>
              {selectedTab === "overview" ? (
                <div className="p-6">
                  <h4 className="text-sm md:text-base lg:text-lg font-outfit-500 mt-2 mb-2">
                    Questions
                  </h4>
                  <ul className="list-disc ml-5 font-outfit-400 break-words">
                    {selectedForm.questions.map((q, i) => (
                      <li key={i} className="text-xs md:text-sm lg:text-base">
                        {q.questionText}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : selectedTab === "analytics" ? (
                <div className="p-6">
                  <h2 className="text-base md:text-lg lg:text-xl font-bold mt-2 mb-4 font-outfit-500">
                    Analytics
                  </h2>
                  {analytics ? (
                    analytics.map((q) => {
                      const totalResponses = Object.values(q.responses).reduce(
                        (sum, count) => sum + count,
                        0
                      );

                      return (
                        <div
                          key={q.questionId}
                          className="w-[90%] mb-4 bg-gray-500/15 rounded-lg"
                        >
                          <p className="text-xs md:text-sm font-semibold border-b border-gray-800 p-4 font-outfit-500 break-words">
                            {q.questionText}
                          </p>
                          {q.type === "PARAGRAPH" ? (
                            q.responses.length === 0 ? (
                              <div className="text-xs p-4 font-outfit-400">
                                No responses
                              </div>
                            ) : (
                              <ul className="text-xs list-disc ml-5 font-outfit-400 p-4">
                                {q.responses.map((resp, i) => (
                                  <li key={i}>{resp}</li>
                                ))}
                              </ul>
                            )
                          ) : (
                            <div className="flex flex-col md:flex-row justify-between gap-8 text-xs p-4 font-outfit-400">
                              <div className="w-full md:w-1/2">
                                {Object.entries(q.responses).map(
                                  ([opt, count]) => (
                                    <p key={opt} className="mb-1">
                                      <span className="font-medium">
                                        {q.options?.[parseInt(opt)] ??
                                          `Option ${parseInt(opt) + 1}`}
                                        :
                                      </span>{" "}
                                      {count} response{count !== 1 ? "s" : ""}
                                    </p>
                                  )
                                )}
                              </div>

                              <div className="w-full md:w-1/2 h-64">
                                {" "}
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={Object.entries(q.responses).map(
                                        ([opt, count]) => ({
                                          name:
                                            q.options?.[parseInt(opt)] ??
                                            `Option ${parseInt(opt) + 1}`,
                                          value:
                                            totalResponses > 0
                                              ? (count / totalResponses) * 100
                                              : 0,
                                        })
                                      )}
                                      dataKey="value"
                                      nameKey="name"
                                      cx="50%"
                                      cy="50%"
                                      outerRadius={60}
                                      label={({ name, value }) =>
                                        totalResponses > 0
                                          ? `${name}: ${value.toFixed(1)}%`
                                          : name
                                      }
                                    >
                                      {Object.keys(q.responses).map(
                                        (_, index) => (
                                          <Cell
                                            key={`cell-${index}`}
                                            fill={Colors[index % Colors.length]}
                                          />
                                        )
                                      )}
                                    </Pie>
                                    <Tooltip
                                      formatter={(value) =>
                                        totalResponses > 0
                                          ? `${value.toFixed(1)}%`
                                          : "0%"
                                      }
                                    />
                                    <Legend />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs md:text-sm lg:text-base text-gray-400 font-outfit-400">
                      Loading analytics...
                    </p>
                  )}
                  {analytics &&
                    analytics.length > 0 &&
                    analytics.some(
                      (q) =>
                        (q.type === "PARAGRAPH" && q.responses.length > 0) ||
                        (q.type !== "PARAGRAPH" &&
                          Object.values(q.responses).reduce(
                            (sum, count) => sum + count,
                            0
                          ) > 0)
                    ) && (
                      <Button
                        variant="green"
                        onClick={handleExportCSV}
                        width="w-22 md:w-25"
                      >
                        Export CSV
                      </Button>
                    )}
                </div>
              ) : (
                <div className="p-6">
                  <h2 className="text-base md:text-lg lg:text-xl font-bold mt-2 mb-4 font-outfit-500">
                    Summary
                  </h2>
                  <Button
                    onClick={handleGenerateSummary}
                    disabled={summaryLoading}
                    width="w-32 md:w-39"
                    marTop="mt-5"
                  >
                    Generate Summary
                  </Button>

                  <div className="w-[90%] mt-4 bg-gray-800 p-4 rounded-lg min-h-[100px] font-outfit-400">
                    {summaryLoading ? (
                      <p className="text-xs md:text-sm text-gray-400">
                        Generating summary...
                      </p>
                    ) : summary ? (
                      <p className="text-xs md:text-sm whitespace-pre-line">
                        {summary}
                      </p>
                    ) : (
                      <p className="text-xs md:text-sm text-gray-500 italic">
                        Click above to generate a summary.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <div className="p-8 mt-20">
        <motion.div
          className="flex flex-col mb-6 gap-4 font-outfit-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-base md:text-2xl lg:text-3xl font-semibold">
              Welcome, {user?.name}!
            </h1>
            <div className="block md:hidden">
              <Button onClick={() => setIsCreateOpen(true)} width="w-10">
                +
              </Button>
            </div>
            <div className="hidden md:block">
              <Button onClick={() => setIsCreateOpen(true)} width="w-27">
                Create Form
              </Button>
            </div>
          </div>
          <div className="px-2 py-6">
            <div className="flex flex-row gap-2 font-outfit-500">
              {["all", "active", "closed"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg text-xs md:text-sm transition-all duration-200 cursor-pointer ${
                    filter === type
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <p className="text-xs md:text-sm lg:text-base text-gray-400 text-center font-outfit-400">
            Loading...
          </p>
        ) : (
          (() => {
            const now = new Date();
            const filteredForms = forms.filter((form) => {
              const isEnded = new Date(form.endTime) < now;
              if (filter === "active") return !isEnded;
              if (filter === "closed") return isEnded;
              return true;
            });

            if (filteredForms.length === 0) {
              return (
                <p className="text-xs md:text-sm lg:text-base text-gray-500 text-center font-outfit-400">
                  {filter === "all"
                    ? "No forms found. Create a form to get started."
                    : `No ${filter} forms found.`}
                </p>
              );
            }

            return (
              <motion.div
                className="flex flex-wrap justify-start items-center gap-4 px-4"
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {filteredForms
                  .sort((a, b) => b.id - a.id)
                  .map((form) => {
                    return (
                      <FormInfoCard
                        key={form.id}
                        id={form.id}
                        title={form.title}
                        description={form.description}
                        endTime={form.endTime}
                        onClick={() => openModal(form)}
                        onEdit={handleEditForm}
                        onDelete={async (id) => {
                          try {
                            await axios.delete(`/api/form/${id}`, {
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            toast.success("Form deleted");
                            fetchForms();
                          } catch (err) {
                            toast.error("Failed to delete form");
                          }
                        }}
                        theme={form.theme}
                      />
                    );
                  })}
              </motion.div>
            );
          })()
        )}
      </div>
      <CreateFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onFormCreated={() => {
          fetchForms();
        }}
      />
      <EditFormModal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        onFormUpdated={handleFormUpdated}
        formData={editFormData}
      />
    </>
  );
};

export default Dashboard;