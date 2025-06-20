import { z } from "zod";
import prisma from "../prisma/client.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const createFormHandler = async (req, res) => {
  const questionSchema = z.object({
    questionText: z.string(),
    type: z.enum(["PARAGRAPH", "SCALE"]),
    options: z.array(z.string()).optional(),
  });

  const inputSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(3),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    questions: z.array(questionSchema),
  });

  const parsed = inputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  const { title, description, startTime, endTime, questions } = parsed.data;

  try {
    const form = await prisma.form.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        creatorId: req.user.id,
        questions: {
          create: questions.map((q) => ({
            questionText: q.questionText,
            type: q.type,
            options: q.type === "SCALE" ? q.options || [] : [],
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Form created successfully",
      data: {
        formId: form.id,
        questions: form.questions,
      },
    });
  } catch (err) {
    console.error("Form creation error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getUserFormsHandler = async (req, res) => {
  try {
    const forms = await prisma.form.findMany({
      where: {
        creatorId: req.user.id,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: forms,
    });
  } catch (error) {
    console.error("Error fetching user forms:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching forms",
    });
  }
};

const getFormByIdHandler = async (req, res) => {
  const { formId } = req.params;

  try {
    const form = await prisma.form.findUnique({
      where: {
        id: Number(formId),
      },
      include: {
        questions: true,
      },
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    const now = new Date();

    const isActive =
      now >= new Date(form.startTime) && now <= new Date(form.endTime);

    return res.status(200).json({
      success: true,
      data: {
        ...form,
        isActive,
      },
    });
  } catch (error) {
    console.error("Error fetching form");
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const endFormHandler = async (req, res) => {
  const { formId } = req.params;

  try {
    const form = await prisma.form.findUnique({
      where: { id: Number(formId) },
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    if (form.creatorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to end this form",
      });
    }

    const updatedForm = await prisma.form.update({
      where: { id: Number(formId) },
      data: {
        endTime: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Form ended successfully",
      data: {
        id: updatedForm.id,
        endTime: updatedForm.endTime,
      },
    });
  } catch (error) {
    console.error("Error ending form");
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deleteFormHandler = async (req, res) => {
  const { formId } = req.params;

  try {
    const form = await prisma.form.findUnique({
      where: { id: Number(formId) },
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    if (form.creatorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this form",
      });
    }

    await prisma.form.delete({
      where: { id: Number(formId) },
    });

    return res.status(200).json({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (err) {
    console.error("Delete form error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getFormAnalyticsHandler = async (req, res) => {
  const { formId } = req.params;

  try {
    const form = await prisma.form.findUnique({
      where: { id: Number(formId) },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    const analytics = form.questions.map((question) => {
      if (question.type === "PARAGRAPH") {
        const responses = question.answers.map((ans) => ans.answerText);
        return {
          questionId: question.id,
          questionText: question.questionText,
          type: question.type,
          responses,
        };
      } else if (question.type === "SCALE") {
        const optionCounts = {};

        // Initialize all options to 0
        question.options.forEach((_, index) => {
          optionCounts[index] = 0;
        });

        question.answers.forEach((ans) => {
          if (
            ans.selectedOption !== null &&
            ans.selectedOption in optionCounts
          ) {
            optionCounts[ans.selectedOption]++;
          }
        });

        return {
          questionId: question.id,
          questionText: question.questionText,
          type: question.type,
          responses: optionCounts,
        };
      }
    });

    return res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      data: analytics,
    });
  } catch (err) {
    console.error("Form analytics error");
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getGeminiSummaryHandler = async (req, res) => {
  const { formId } = req.params;

  try {
    const form = await prisma.form.findUnique({
      where: { id: Number(formId) },
      include: {
        questions: {
          where: { type: "PARAGRAPH" },
          include: { answers: true },
        },
      },
    });

    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompts = form.questions
      .map((q) => {
        const responses = q.answers.map((a) => `- ${a.answerText}`).join("\n");
        return `Question: ${q.questionText}\n${responses}\n\n`;
      })
      .join("\n");

    const finalPrompt = `
Here are multiple paragraph-style feedback responses from a form:

${prompts}

Summarize the key insights and feedback in simple and short English, covering common themes. Use bullet points if necessary.
`;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const summary = response.text();

    return res.status(200).json({
      success: true,
      message: "Summary generated successfully",
      data: { summary },
    });
  } catch (err) {
    console.error("Gemini summary error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export {
  createFormHandler,
  getUserFormsHandler,
  getFormByIdHandler,
  endFormHandler,
  deleteFormHandler,
  getFormAnalyticsHandler,
  getGeminiSummaryHandler,
};