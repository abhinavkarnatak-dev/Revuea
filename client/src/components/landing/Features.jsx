import { FiShield } from "react-icons/fi";
import { TbChartBar } from "react-icons/tb";
import { RiFlashlightLine } from "react-icons/ri";

const Features = ({ iconType, title, description }) => {
  const iconWrapperClasses = "w-5 md:w-6 lg:w-8";

  return (
    <div className="w-[75%] md:w-[30%] h-36 md:h-44 bg-[#161922]/70 flex flex-col justify-between items-start rounded-xl p-4 cursor-pointer hover:-translate-y-1 hover:scale-[1.02] transition-all duration-200">
      <div className={iconWrapperClasses}>
        {iconType === "Shield" ? (
          <FiShield className="w-full h-full" />
        ) : iconType === "Chart" ? (
          <TbChartBar className="w-full h-full" />
        ) : (
          <RiFlashlightLine className="w-full h-full" />
        )}
      </div>
      <h3 className="bg-gradient-to-b from-purple-400 to-purple-700 bg-clip-text font-outfit-700 tracking-tighter text-transparent text-xs md:text-sm lg:text-base">
        {title}
      </h3>
      <p className="text-xs md:text-sm lg:text-base font-outfit-400 text-[#99a1af]">
        {description}
      </p>
    </div>
  );
};

export default Features;