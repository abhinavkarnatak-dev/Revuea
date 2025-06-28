import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { backgrounds } from "../../utils/bgImg";
import Button from "../layout/Button";
import { motion } from "motion/react";

const CreateFormModal = ({ isOpen, onClose, onFormCreated }) => {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [questions, setQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("PARAGRAPH");
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [theme, setTheme] = useState("");

  const [loading, setLoading] = useState(false);

  const handleAddQuestion = () => {
    if (!newQuestionText) {
      toast.error("Question is required");
      return;
    }

    if (newQuestionType === "MCQ") {
      const filteredOptions = newOptions
        .map((opt) => opt.trim())
        .filter(Boolean);
      if (filteredOptions.length < 2) {
        toast.error("At least 2 choice options required");
        return;
      }

      setQuestions((prev) => [
        ...prev,
        {
          questionText: newQuestionText,
          type: newQuestionType,
          options: filteredOptions,
        },
      ]);
    } else {
      setQuestions((prev) => [
        ...prev,
        {
          questionText: newQuestionText,
          type: newQuestionType,
        },
      ]);
    }

    setNewQuestionText("");
    setNewQuestionType("PARAGRAPH");
    setNewOptions(["", ""]);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setQuestions([]);
    setNewQuestionText("");
    setNewQuestionType("PARAGRAPH");
    setNewOptions(["", ""]);
    setTheme("");
  };

  const handleCreate = async () => {
    if (!title || !description || !startTime || !endTime) {
      toast.error("Fill all fields");
      return;
    } else if (questions.length === 0) {
      toast.error("Add at least one question");
      return;
    } else if (theme === "") {
      toast.error("Select a theme");
      return;
    }

    try {
      setLoading(true);
      const startUTC = new Date(startTime).toISOString();
      const endUTC = new Date(endTime).toISOString();

      const res = await axios.post(
        "/api/form/create",
        {
          title,
          description,
          startTime: startUTC,
          endTime: endUTC,
          questions,
          theme: theme,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Form created successfully!");
      onFormCreated(res.data.data);
      resetForm();
      onClose();
    } catch (err) {
      console.error("Form creation error", err?.response?.data || err);
      toast.error("Failed to create form");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...newOptions];
    updated[index] = value;
    setNewOptions(updated);
  };

  const addNewOptionField = () => {
    setNewOptions((prev) => [...prev, ""]);
  };

  const removeOptionField = (index) => {
    setNewOptions((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex flex-row justify-center items-center overflow-y-auto"
      onClick={() => {
        onClose();
        resetForm();
      }}
    >
      <motion.div
        className="bg-[#0f111a] p-6 rounded-tl-lg rounded-bl-lg text-white w-[60%] md:w-[55%] h-[93%] overflow-y-auto border border-gray-800"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-base md:text-lg lg:text-xl mb-4 font-outfit-600">
          Create New Form
        </h2>

        <div className="space-y-4 font-outfit-400">
          <label htmlFor="title" className="text-xs md:text-sm lg:text-base">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => {
              if (e.target.value.length <= 20) setTitle(e.target.value);
            }}
            className="w-full p-2 rounded-lg bg-gray-800 text-white outline-none text-xs md:text-sm lg:text-base"
          />
          <p className="text-right text-xs text-gray-400">
            {title.length}/20 characters
          </p>
          <label
            htmlFor="description"
            className="text-xs md:text-sm lg:text-base"
          >
            Description
          </label>
          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) => {
              if (e.target.value.length <= 100) setDescription(e.target.value);
            }}
            className="w-full p-2 rounded-lg bg-gray-800 text-white outline-none resize-none text-xs md:text-sm lg:text-base"
          />
          <p className="text-right text-xs text-gray-400">
            {description.length}/100 characters
          </p>

          <label
            htmlFor="startTime"
            className="text-xs md:text-sm lg:text-base"
          >
            Start Time
          </label>
          <input
            type="datetime-local"
            value={startTime}
            min={new Date().toISOString().slice(0, 16)}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 text-white outline-none text-xs md:text-sm lg:text-base"
          />

          <label htmlFor="endTime" className="text-xs md:text-sm lg:text-base">
            End Time
          </label>
          <input
            type="datetime-local"
            value={endTime}
            min={new Date().toISOString().slice(0, 16)}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 text-white outline-none text-xs md:text-sm lg:text-base"
          />

          <div className="border-t border-gray-700 pt-4 mt-4 flex flex-col">
            <h3 className="font-outfit-500 text-xs md:text-base lg:text-lg mb-2">
              Add Question
            </h3>

            <input
              type="text"
              placeholder="Question"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 text-white outline-none mb-2 text-xs md:text-sm lg:text-base"
            />

            <select
              value={newQuestionType}
              onChange={(e) => setNewQuestionType(e.target.value)}
              className="w-[67%] md:w-[70%] lg:w-full p-2 rounded-lg bg-gray-800 text-white outline-none text-xs md:text-sm lg:text-base"
            >
              <option value="PARAGRAPH">Paragraph</option>
              <option value="MCQ">Multiple Choice</option>
            </select>

            {newQuestionType === "MCQ" && (
              <div className="mt-3 space-y-2">
                {newOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 p-2 rounded-lg bg-gray-800 text-white outline-none text-xs md:text-sm lg:text-base"
                    />
                    {newOptions.length > 2 && (
                      <button
                        onClick={() => removeOptionField(i)}
                        className="text-red-400"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addNewOptionField}
                  className="text-xs md:text-sm text-purple-400 hover:underline cursor-pointer"
                >
                  + Add Option
                </button>
              </div>
            )}
            <Button
              variant="normal"
              onClick={handleAddQuestion}
              width="w-27 md:w-33 lg:w-33"
              marTop="mt-4"
            >
              Add Question
            </Button>
          </div>

          {questions.length > 0 && (
            <div className="w-full mt-6 space-y-2 max-h-40 overflow-y-auto">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="w-[90%] bg-gray-800 p-3 rounded-lg flex justify-start">
                    <div className="w-full">
                      <p className="text-sm font-medium break-words max-w-full">
                        {q.questionText}
                      </p>
                      <p className="w-30 text-xs text-gray-400">
                        Type:{" "}
                        {q.type === "MCQ" ? "Multiple Choice" : "Paragraph"}
                      </p>
                      {q.type === "MCQ" && (
                        <ul className="list-disc ml-4 text-xs text-gray-300 mt-1">
                          {q.options.map((opt, idx) => (
                            <li key={idx}>{opt}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setQuestions((prev) => prev.filter((_, j) => j !== index))
                    }
                    className="w-[10%] text-red-400 text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 font-outfit-400">
          <Button variant="cancel" width="w-14 md:w-20" onClick={onClose}>
            Cancel
          </Button>
          <Button
            width="w-18 md:w-24"
            disabled={loading}
            onClick={handleCreate}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </motion.div>
      <motion.div
        className="w-[30%] md:w-[25%] h-[93%] bg-[#0f111a] p-4 md:p-5 lg:p-6 rounded-tr-lg rounded-br-lg flex flex-col gap-4 items-center border border-gray-800"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-xs md:text-base lg:text-lg font-outfit-600 text-center">
          Choose Theme
        </h2>
        <div className="flex flex-wrap gap-3 justify-center overflow-y-scroll lg:overflow-y-hidden">
          {backgrounds.map((bg, i) => (
            <div
              key={i}
              className={`relative w-22 md:w-28 h-16 md:h-20 lg:w-[47%] lg:h-[14%] rounded-lg overflow-hidden border-2 hover:scale-105 transition-all duration-300 ${
                theme === bg ? "border-purple-500" : "border-transparent"
              } cursor-pointer`}
              onClick={() => setTheme(bg)}
            >
              <img
                src={bg}
                alt="theme"
                className="w-full h-full object-cover"
              />
              {theme === bg && (
                <div className="absolute inset-0 bg-black/60 flex justify-center items-center">
                  <span className="text-white text-base md:text-lg lg:text-xl font-bold">
                    ✔
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateFormModal;