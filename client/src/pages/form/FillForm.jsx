import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Button from "../../components/layout/Button";
import Status from "../../components/layout/Status";
import { motion } from "motion/react";
import api from "../../services/api";

const FillForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const already = localStorage.getItem(`submitted-${formId}`);
    if (already) {
      setAlreadySubmitted(true);
      setLoading(false);
      return;
    }
    const fetchForm = async () => {
      try {
        const res = await api.get(`/form/${formId}`);
        const formData = res.data.data;

        setForm(formData);
        setAnswers(
          formData.questions.map((q) => ({
            quesId: q.id,
            answerText: "",
            selectedOption: null,
          }))
        );
      } catch (err) {
        if (err.response?.status === 404) {
          setForm("NOT_FOUND");
        } else {
          toast.error("Something went wrong while loading the form.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleChange = (index, value, isMcq = false) => {
    setAnswers((prev) => {
      const updated = [...prev];
      if (isMcq) updated[index].selectedOption = value;
      else updated[index].answerText = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      const filteredAnswers = answers.filter(
        (a) => a.answerText || a.selectedOption !== null
      );

      if (filteredAnswers.length !== form.questions.length) {
        toast.error("Please answer all the questions.");
        return;
      }

      await api.post(`/response/submit/${formId}`, {
        answers: filteredAnswers,
      });

      localStorage.setItem(`submitted-${formId}`, "true");
      setSubmitted(true);
    } catch (err) {
      toast.error("Submission failed");
    }
  };

  if (loading) {
    return <Status message="Loading form..." color="text-[#99a1af]" />;
  }

  if (alreadySubmitted) {
    return (
      <Status
        message="You have already submitted this form."
        color="text-yellow-500"
      />
    );
  }

  if (form === "NOT_FOUND") {
    return <Status message="No such form exists." color="text-red-500" />;
  }

  if (!form) {
    return (
      <Status
        message="Unexpected error occurred while loading the form."
        color="text-gray-300"
      />
    );
  }

  if (!form.isActive) {
    return (
      <Status
        message="This form is not active yet or has expired."
        color="text-red-500"
      />
    );
  }

  if (submitted) {
    return (
      <Status
        message="Thank you for submitting your response."
        color="text-green-500"
      />
    );
  }

  return (
    <div className="w-screen min-h-screen text-white bg-[#0a0b10]">
      <div className="relative w-full h-32 md:h-40 border-b border-gray-800 p-6 flex flex-col justify-center">
        <img
          src={form.theme}
          className="absolute inset-0 object-fill w-full h-full opacity-[35%] z-0"
          alt="Card Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/40 pointer-events-none z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/40 pointer-events-none z-0" />
        <h1 className="relative text-xl md:text-2xl lg:text-3xl font-bold mb-4 font-outfit-600 text-white [text-shadow:_0_1px_3px_rgba(0,0,0,1)] z-10">
          Title: {form.title}
        </h1>
        <p className="relative text-xs md:text-sm lg:text-base text-gray-300 font-outfit-500 [text-shadow:_0_1px_3px_rgba(0,0,0,1)] z-10 break-words">
          Description: {form.description}
        </p>
      </div>

      {form.questions.map((q, idx) => (
        <motion.div
          key={q.id}
          className="mt-6 px-6 py-4"
          initial={{ opacity: 0.2, y: 30 }}
          transition={{ duration: 0.5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.p
            className="text-xs md:text-sm lg:text-base mb-2 font-semibold font-outfit-500 text-white [text-shadow:_0_1px_2px_rgba(255,255,255,0.6)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * (idx + 1), duration: 0.6 }}
          >
            Q{idx + 1}. <span className="break-words">{q.questionText}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * (idx + 1), duration: 0.6 }}
          >
            {q.type === "PARAGRAPH" ? (
              <textarea
                rows={3}
                placeholder="Type your answer here..."
                className="text-xs md:text-sm lg:text-base w-full md:w-[90%] p-2 bg-[#1e2939] rounded-lg focus:outline-none font-outfit-400"
                value={answers[idx]?.answerText || ""}
                onChange={(e) => handleChange(idx, e.target.value)}
              />
            ) : (
              <div className="flex gap-3 flex-wrap">
                {q.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`mcq-${q.id}`}
                      value={i}
                      checked={answers[idx]?.selectedOption === i}
                      onChange={() => handleChange(idx, i, true)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      ))}
      <motion.div
        className="p-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Button onClick={handleSubmit} width="w-16 md:w-20">
          Submit
        </Button>
      </motion.div>
    </div>
  );
};

export default FillForm;