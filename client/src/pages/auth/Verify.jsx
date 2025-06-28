import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import Button from "../../components/layout/Button";
import { motion } from "motion/react";

const Verify = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();

  const email =
    location.state?.email || localStorage.getItem("revuea_signup_email") || "";
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const data = await toast.promise(verifyOtp({ email, otp }), {
        loading: "Verifying OTP...",
        success: "Account verified successfully!",
        error: (err) => err?.response?.data?.message || "Verification failed",
      });

      login({ token: data.token, user: data.user });
      localStorage.removeItem("revuea_signup_email");
      navigate("/dashboard");
    } catch (err) {
      console.error("OTP verification error:", err);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#0a0b10]">
      <motion.div
        className="w-[85%] md:w-3/5 lg:2/5 bg-[#161922] p-14 rounded-2xl"
        initial={{ opacity: 0.2, y: 30 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-sm md:text-xl lg:text-2xl font-outfit-600 text-white mb-6 text-center">
          Enter OTP sent to your email
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d{0,6}$/.test(val)) setOtp(val);
            }}
            placeholder="Enter 6-digit OTP"
            className="w-full p-2 rounded-lg bg-[#222734] text-white focus:outline-none font-outfit-300 text-center tracking-widest text-sm md:text-base lg:text-lg"
          />
          <Button type="submit" width="w-full">
            Verify
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Verify;