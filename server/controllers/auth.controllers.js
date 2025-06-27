import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { sendOTPEmail } from "../utils/mailer.js";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const signupHandler = async (req, res) => {
  const inputSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const parsedInput = inputSchema.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  const { name, email, password } = parsedInput.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.pendingVerification.upsert({
      where: { email },
      update: { name, password: hashedPassword, otp },
      create: { name, email, password: hashedPassword, otp },
    });

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
      data: { email },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const verifyEmailHandler = async (req, res) => {
  const inputSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
  });

  const parsedInput = inputSchema.safeParse(req.body);

  if (!parsedInput.success) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  const { email, otp } = parsedInput.data;

  try {
    const pending = await prisma.pendingVerification.findUnique({
      where: { email },
    });

    if (!pending || pending.otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    const newUser = await prisma.user.create({
      data: {
        name: pending.name,
        email: pending.email,
        password: pending.password,
      },
    });

    await prisma.pendingVerification.delete({ where: { email } });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const loginHandler = async (req, res) => {
  const inputSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const parsedInput = inputSchema.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  const { email, password } = parsedInput.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { signupHandler, verifyEmailHandler, loginHandler };