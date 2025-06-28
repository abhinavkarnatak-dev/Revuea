import { BsTrash, BsPencil } from "react-icons/bs";

const FormInfoCard = (props) => {
  const isEnded = new Date(props.endTime).getTime() < new Date().getTime();
  const iconWrapperClasses = "w-7 md:w-8";

  return (
    <div
      className="relative group w-full md:w-[48%] lg:w-80 h-48 md:h-44 lg:h-48 bg-[#161922] p-4 rounded-lg shadow hover:shadow-lg transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:scale-[1.02] cursor-pointer border border-gray-800 drop-shadow-xl overflow-hidden"
      onClick={() => props.onClick(props.id)}
    >
      <img
        src={props.theme}
        className="absolute inset-0 object-cover w-full h-full"
        alt="Card Background"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />

      <div className="absolute top-3 right-3 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all z-20">
        <div
          className={`text-sm cursor-pointer text-white p-2 rounded-lg hover:bg-purple-700/20 ${iconWrapperClasses}`}
          onClick={(e) => {
            e.stopPropagation();
            props.onEdit?.(props.id);
          }}
        >
          <BsPencil className="w-full h-full" />
        </div>
        <div
          className={`text-sm cursor-pointer text-red-500 p-2 rounded-lg hover:bg-purple-700/20 ${iconWrapperClasses}`}
          onClick={(e) => {
            e.stopPropagation();
            props.onDelete?.(props.id);
          }}
        >
          <BsTrash className="w-full h-full" />
        </div>
      </div>

      <div className="flex flex-col gap-1 z-10">
        <h3 className="text-lg md:text-xl font-semibold bg-gradient-to-b from-purple-400 to-purple-700 bg-clip-text font-outfit-600 tracking-tighter text-transparent">
          {props.title}
        </h3>
        <p className="relative text-xs font-outfit-400 text-white truncate max-w-[70%] [text-shadow:_0_1px_3px_rgba(0,0,0,1)] z-10">
          {props.description}
        </p>
      </div>

      {!isEnded && (
        <p className="relative text-xs md:text-sm text-gray-400 font-outfit-400 [text-shadow:_0_1px_3px_rgba(0,0,0,1)] z-10">
          <span className="font-outfit-600">Closes on: </span>{" "}
          {new Date(props.endTime).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })}
        </p>
      )}
      <p
        className={`relative text-xs md:text-sm font-outfit-400 z-10 ${
          isEnded ? "text-red-500" : "text-green-500"
        } [text-shadow:_0_1px_3px_rgba(0,0,0,1)] z-10`}
      >
        {isEnded ? "Closed" : "Active"}
      </p>
    </div>
  );
};

export default FormInfoCard;