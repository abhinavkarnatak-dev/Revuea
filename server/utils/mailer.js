import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: "Revuea",
    to,
    subject: "Your OTP for Revuea Signup",
    html: `
      <div style="font-family:sans-serif;">
        <h2>Verify your email</h2>
        <p>Your OTP for verifying your account on <b>Revuea</b> is:</p>
        <h3 style="color:#4f46e5;">${otp}</h3>
        <p>This OTP is valid for a few minutes. If you didn't request this, please ignore.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};