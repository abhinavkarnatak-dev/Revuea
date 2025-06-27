import prisma from "../prisma/client.js";
import { z } from "zod";
import { Parser } from "json2csv";

const submitResponseHandler = async (req, res) => {
  const { formId } = req.params;

  const answerSchema = z.object({
    quesId: z.number(),
    answerText: z.string().nullable().optional(),
    selectedOption: z.number().nullable().optional(),
  });

  const inputSchema = z.object({
    answers: z.array(answerSchema).min(1),
  });

  const parsed = inputSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  try {
    const form = await prisma.form.findUnique({
      where: { id: Number(formId) },
    });

    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    const response = await prisma.response.create({
      data: {
        formId: form.id,
      },
    });

    const answerData = parsed.data.answers.map((ans) => ({
      quesId: ans.quesId,
      answerText: ans.answerText,
      selectedOption: ans.selectedOption,
      respId: response.id,
    }));

    await prisma.answer.createMany({ data: answerData });

    return res
      .status(201)
      .json({ success: true, message: "Response submitted successfully" });
  } catch (error) {
    console.error("Submit response error");
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const exportResponsesHandler = async (req, res) => {
  const { formId } = req.params;

  try {
    const form = await prisma.form.findUnique({
      where: { id: Number(formId) },
      include: {
        questions: true,
        responses: {
          include: {
            answers: {
              include: {
                question: true,
              },
            },
          },
        },
      },
    });

    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    if (!form.responses || form.responses.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No responses to export" });
    }

    const csvRows = form.responses.map((response, index) => {
      const row = {};
      row["Response No."] = index + 1;

      form.questions.forEach((q) => {
        const answer = response.answers.find((a) => a.quesId === q.id);

        if (!answer) {
          row[q.questionText] = "";
          return;
        }

        if (q.type === "MCQ") {
          const optionIndex = answer.selectedOption;
          row[q.questionText] =
            optionIndex !== null &&
            optionIndex !== undefined &&
            Array.isArray(q.options) &&
            q.options[optionIndex] !== undefined
              ? q.options[optionIndex]
              : "";
        } else {
          row[q.questionText] = answer.answerText ?? "";
        }
      });

      return row;
    });

    const parser = new Parser();
    const csv = parser.parse(csvRows);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="form-${formId}-responses.csv"`
    );

    return res.status(200).send(csv);
  } catch (err) {
    console.error("Export CSV error:", err); // Full stack trace
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { submitResponseHandler, exportResponsesHandler };