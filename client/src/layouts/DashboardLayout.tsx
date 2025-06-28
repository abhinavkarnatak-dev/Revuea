import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col w-screen min-h-screen bg-white dark:bg-[#0a0b10] text-white relative overflow-hidden">
      <Navbar />
      <Outlet />
      <div className="absolute -bottom-[16rem] left-1/2 transform -translate-x-1/2 z-[20] size-[24rem] overflow-hidden rounded-full bg-gradient-to-t from-purple-400 to-purple-700 blur-[20em]"></div>
    </div>
  );
};

export default DashboardLayout;