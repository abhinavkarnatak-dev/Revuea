import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const LandingPageLayout = () => {
  return (
    <div className="flex flex-col w-screen min-h-screen bg-white dark:bg-[#0a0b10] text-white relative overflow-hidden">
      <Navbar />
      <Outlet />
      <div className="absolute top-1/2 -translate-y-2/3 left-1/2 transform -translate-x-1/2 z-20 size-[24rem] overflow-hidden rounded-full bg-gradient-to-t from-purple-400 to-purple-700 blur-[16em] pointer-events-none"></div>
    </div>
  );
};

export default LandingPageLayout;