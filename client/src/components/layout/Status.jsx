const Status = ({ message, color = "text-white" }) => {
  return (
    <div className="w-screen h-screen bg-[#0a0b10] flex justify-center text-base md:text-lg lg:text-xl text-center pt-10 font-outfit-500">
      <p className={`${color}`}>{message}</p>
    </div>
  );
};

export default Status;