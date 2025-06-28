import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import Button from "../../components/layout/Button";
import { motion } from "motion/react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error("All fields are required");
    setError("");

    try {
      const data = await toast.promise(loginUser(form), {
        loading: "Logging in...",
        success: "Login successful!",
        error: (err) =>
          err?.response?.data?.message || "Login failed. Please try again.",
      });

      login({ token: data.token, user: data.user ?? null });
      console.log("Navigating to /dashboard");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
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
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-10 text-center font-outfit-600">
          Welcome to{" "}
          <span className="bg-gradient-to-b from-purple-400 to-purple-700 bg-clip-text pr-1 font-outfit-800 tracking-tighter text-transparent">
            Revuea
          </span>
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs md:text-sm lg:text-base font-semibold mb-2 text-white font-outfit-400">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="name@email.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            className="w-full text-xs md:text-sm lg:text-base p-2 rounded-lg bg-[#222734] text-white focus:outline-none font-outfit-300"
          />
          <label className="block text-xs md:text-sm lg:text-base font-semibold mb-2 text-white font-outfit-400">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="w-full text-xs md:text-sm lg:text-base p-2 rounded-lg bg-[#222734] text-white focus:outline-none mb-10 font-outfit-300"
          />
          <Button type="submit" width="w-full">
            Login
          </Button>
        </form>
        <div className="text-xs md:text-sm lg:text-base text-center mt-4 font-outfit-400">
          <p className="text-white font">
            Don't have an account?{" "}
            <a href="/signup" className="text-purple-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </motion.div>
      <div className="absolute -bottom-[16rem] z-[20] size-[24rem] overflow-hidden rounded-full bg-gradient-to-t from-purple-400 to-purple-700 blur-[16em]"></div>
    </div>
  );
};

export default Login;