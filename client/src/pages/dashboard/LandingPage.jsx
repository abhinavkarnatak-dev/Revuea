import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";
import { features, steps } from "../../utils/lpData";
import Features from "../../components/landing/Features";
import Steps from "../../components/landing/Steps";
import Button from "../../components/layout/Button";
import { motion } from "motion/react";

const LandingPage = () => {
  return (
    <>
      <motion.div
        className="relative w-full flex flex-col gap-6 justify-center items-center md:items-start mt-30 pl-0 md:pl-20"
        initial={{ opacity: 0.2, y: 30 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="hidden md:block w-[50%] absolute top-1/2 left-[80%] transform -translate-x-1/2 -translate-y-1/2 mt-10 p-2 pl-4"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <img
            src="/assets/lpImg.png"
            alt=""
            className="opacity-70 w-full"
          />
        </motion.div>
        <motion.div
          className="inline-flex md:hidden w-44 h-5 items-center space-x-2 bg-purple-200 text-purple-800 px-4 py-2 rounded-full text-[9px] font-outfit-500 mb-24"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Sprout className="w-3 md:w-4 h-3 md:h-4" />
          <span>Feedback That Shapes Culture</span>
        </motion.div>
        <motion.div
          className="w-[90%] md:w-full flex flex-col justify-center items-center md:items-start gap-2 md:gap-4 lg:gap-5 mt-0 md:mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h1 className="w-full md:w-[62%] text-3xl md:text-4xl lg:text-5xl font-outfit-600 text-center md:text-start">
            Revolutionize Culture with Anonymous Feedback
          </h1>
          <h2 className="w-full md:w-[62%] text-xl md:text-2xl lg:text-3xl bg-gradient-to-b from-gray-300 to-gray-500 bg-clip-text pr-1 font-outfit-700 tracking-tighter text-transparent text-center md:text-start">
            Start building an environment where everyone is heard — honestly,
            and safely
          </h2>
          <motion.p
            className="w-[65%] md:w-[60%] text-xs md:text-base lg:text-lg text-[#99a1af] font-outfit-400 text-center md:text-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Revuea helps you uncover what people truly feel—so you can take
            action that actually matters.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link to="/signup" className="block">
              <Button width="w-22 md:w-28 lg:w-32" marTop="mt-8">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div
        className="w-screen min-h-screen flex flex-col justify-start items-center"
        initial={{ opacity: 0.2, y: 30 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h1
          className="text-xl md:text-3xl lg:text-4xl font-outfit-600 mt-32 md:mt-44"
          initial={{ opacity: 0.2, y: 100 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why Revuea?
        </motion.h1>

        <motion.div
          className="w-full flex flex-col md:flex-row gap-8 justify-center items-center mt-14 lg:mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          {features.map((feature, index) => (
            <Features
              iconType={feature.iconType}
              key={index}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </motion.div>

        <motion.h1
          className="text-xl md:text-3xl lg:text-4xl font-outfit-600 mt-32 md:mt-40"
          initial={{ opacity: 0.2, y: 50 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h1>
        <motion.div
          className="w-full flex flex-col gap-4 justify-center items-center mt-14 lg:mt-20"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <Steps
              key={index}
              stepNo={step.step}
              title={step.title}
              description={step.description}
            />
          ))}
        </motion.div>
        <motion.div
          className="w-full h-70 bg-gradient-to-b from-[#0a0b10] to-purple-700/50 flex flex-col justify-start items-center mt-30"
          initial={{ opacity: 0.2, y: 30 }}
          transition={{ duration: 0.5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.h1
            className="text-lg md:text-2xl lg:text-4xl font-outfit-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to collect honest feedback?
          </motion.h1>
          <motion.h3
            className="text-xs md:text-base lg:text-lg font-outfit-400 text-[#99a1af]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Start building trust with every response.
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            z
          >
            <Link to="/signup">
              <Button width="w-22 md:w-28 lg:w-32" marTop="mt-8" marBot="mb-20">
                Get Started
              </Button>
            </Link>
          </motion.div>
          <div className="border-t border-white w-full h-full flex justify-center items-center">
            <p className="text-xs md:text-base lg:text-lg font-outfit-400 text-[#99a1af]">
              © 2025 Revuea. All rights reserved.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default LandingPage;