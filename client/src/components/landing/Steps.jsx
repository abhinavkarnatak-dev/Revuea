const Steps = (props) => {
  return (
    <div className="w-[80%] md:w-[80%] lg:w-[65%] h-22 md:h-28 bg-[#161922]/70 flex flex-row gap-2 rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-all duration-200">
      <div className="w-[10%] flex justify-center md:justify-center items-center">
        <p className="text-base md:text-xl lg:text-3xl bg-gradient-to-b from-purple-400 to-purple-700 bg-clip-text font-outfit-700 tracking-tighter text-transparent text-center">
          {props.stepNo}
        </p>
      </div>
      <div className="w-[90%] flex flex-col gap-2 justify-center items-start">
        <h3 className="text-xs md:text-sm lg:text-base text-white font-outfit-700">
          {props.title}
        </h3>
        <p className="text-xs md:text-sm lg:text-base font-outfit-400 text-[#99a1af]">
          {props.description}
        </p>
      </div>
    </div>
  );
};

export default Steps;