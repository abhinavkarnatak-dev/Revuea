const VARIANT_CLASSES = {
  purple:
    "bg-gradient-to-b from-purple-400 to-purple-700 text-white hover:opacity-80",
  green:
    "bg-gradient-to-b from-green-400 to-green-700 text-white hover:opacity-80",
  red: "bg-gradient-to-b from-red-400 to-red-700 text-white hover:opacity-80",
  white: "bg-white text-black border border-gray-300 hover:bg-gray-200",
  cancel: "bg-gray-700 text-white hover:bg-gray-600",
  normal: "bg-purple-600 px-4 py-2 hover:bg-purple-700 text-white text-sm",
  theme: "text-xl p-3 hover:bg-gray-900/40 hover:text-purple-500",
};

const Button = ({
  children,
  variant = "purple",
  width = "w-auto",
  type = "button",
  marTop = "",
  marBot = "",
  disabled,
  onClick,
  className = "",
  ...props
}) => {
  const baseStyles =
    "h-8 md:h-10 text-xs md:text-base p-2 rounded-lg transition-all duration-300 font-outfit-400 cursor-pointer flex items-center justify-center";

  const allClasses = `${width} ${marTop} ${marBot} ${baseStyles} ${
    VARIANT_CLASSES[variant] || ""
  } ${className}`;

  return (
    <button
      type={type}
      disabled={disabled}
      className={allClasses}
      {...props}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;