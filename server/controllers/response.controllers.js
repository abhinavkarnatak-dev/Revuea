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

const getResponsesHandler = async (req, res) => {
  const { formId } = req.params;

  try {
    const responses = await prisma.response.findMany({
      where: { formId: Number(formId) },
      include: {
        answers: {
          include: {
            question: {
              select: {
                id: true,
                questionText: true,
                type: true,
                options: true,
              },
            },
          },
        },
      },
    });

    if (!responses.length) {
      return res
        .status(404)
        .json({ success: false, message: "No responses found" });
    }

    const grouped = {};

    responses.forEach((resp) => {
      resp.answers.forEach((ans) => {
        const q = ans.question;
        if (!grouped[q.id]) {
          grouped[q.id] = {
            questionId: q.id,
            questionText: q.questionText,
            type: q.type,
            options: q.options,
            answers: [],
          };
        }

        grouped[q.id].answers.push(
          ans.answerText ??
            (ans.selectedOption !== null ? q.options[ans.selectedOption] : null)
        );
      });
    });

    return res.status(200).json({
      success: true,
      data: Object.values(grouped),
    });
  } catch (err) {
    console.error("Get responses error");
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

    const csvRows = form.responses.map((response) => {
      const row = {};

      form.questions.forEach((q) => {
        const answer = response.answers.find((a) => a.quesId === q.id);
        if (q.type === "SCALE") {
          row[q.questionText] =
            answer?.selectedOption !== null &&
            answer?.selectedOption !== undefined
              ? q.options[answer.selectedOption]
              : "";
        } else {
          row[q.questionText] = answer?.answerText ?? "";
        }
      });

      row["Timestamp"] = response.timestamp.toISOString();
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
    console.error("Export CSV error");
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { submitResponseHandler, getResponsesHandler, exportResponsesHandler };