import prisma from "../prisma/client.js";
import { z } from "zod";

const getProfileHandler = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Get profile error");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", err });
  }
};

const updateProfileHandler = async (req, res) => {
  const inputSchema = z.object({
    name: z.string().min(1),
  });

  const parsed = inputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: "Invalid name" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        name: parsed.data.name,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Name updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Update name error");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { getProfileHandler, updateProfileHandler };