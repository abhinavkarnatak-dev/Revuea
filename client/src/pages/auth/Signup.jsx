import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../services/authService";
import { toast } from "react-hot-toast";
import Button from "../../components/layout/Button";
import { motion } from "motion/react";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return toast.error("All fields are required");

    try {
      const response = await toast.promise(signupUser(form), {
        loading: "Checking account...",
        success: "OTP sent to your email",
        error: (err) =>
          err?.response?.data?.message || "Signup failed. Please try again.",
      });
      localStorage.setItem("revuea_signup_email", form.email);
      setTimeout(() => {
        navigate("/verify", { state: { email: form.email } });
      }, 1000);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#0a0b10] relative overflow-hidden">
      <motion.div
        className="w-[85%] md:w-3/5 lg:2/5 bg-[#161922] p-14 rounded-2xl"
        initial={{ opacity: 0.2, y: 30 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-xl md:text-2xl lg:text-3xl font-outfit-600 text-white mb-10 text-center">
          Create an account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-white font-outfit-400 text-xs md:text-sm lg:text-base">
            Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-[#222734] text-white focus:outline-none font-outfit-300 text-xs md:text-sm lg:text-base"
          />

          <label className="block text-white font-outfit-400 text-xs md:text-sm lg:text-base">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="name@email.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            className="w-full p-2 rounded-lg bg-[#222734] text-white focus:outline-none font-outfit-300 text-xs md:text-sm lg:text-base"
          />

          <label className="block text-white font-outfit-400 text-xs md:text-sm lg:text-base">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            className="w-full p-2 rounded-lg bg-[#222734] text-white focus:outline-none mb-10 font-outfit-300 text-xs md:text-sm lg:text-base"
          />

          <Button type="submit" width="w-full">
            Signup
          </Button>
        </form>

        <div className="text-center mt-4 font-outfit-400 text-xs md:text-sm lg:text-base">
          <p className="text-white">
            Already have an account?{" "}
            <a href="/login" className="text-purple-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </motion.div>
      <div className="absolute -bottom-[16rem] z-[20] size-[24rem] overflow-hidden rounded-full bg-gradient-to-t from-purple-400 to-purple-700 blur-[16em]"></div>
    </div>
  );
};

export default Signup;