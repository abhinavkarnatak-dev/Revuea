import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import { motion } from "motion/react";

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const iconWrapperClasses = "w-5";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.header
      className={`fixed w-screen h-20 bg-[#0a0b10] px-8 shadow-md flex items-center justify-between ${
        showMenu ? "" : "border-b border-gray-800"
      } z-20`}
      initial={{ opacity: 0.2, y: -10 }}
      transition={{ duration: 0.3 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="flex flex-row gap-1 justify-center items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="w-7 lg:w-9"
        />
        <h1 className="text-xl lg:text-2xl bg-gradient-to-b from-purple-400 to-purple-700 bg-clip-text font-outfit-800 tracking-tighter text-transparent font-outfit-600">
          Revuea
        </h1>
      </motion.div>

      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {/* <ThemeToggle /> */}
        <button
          className="md:hidden text-white"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {showMenu ? (
            <div className={iconWrapperClasses}>
              <FaTimes className="w-full h-full" />
            </div>
          ) : (
            <div className={iconWrapperClasses}>
              <FaBars className="w-full h-full" />
            </div>
          )}
        </button>

        <div
          ref={menuRef}
          className={`${
            showMenu ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-center gap-4 absolute md:static top-20 right-0 bg-[#0a0b10] md:bg-transparent w-full md:w-auto p-4 md:p-0 border-b md:border-none border-gray-800 shadow-md md:shadow-none transition-all duration-300`}
        >
          {isAuthenticated ? (
            <div
              ref={profileMenuRef}
              className="flex flex-col md:flex-row items-center gap-2 relative w-full md:w-auto"
            >
              <FaUserCircle
                size={32}
                className="cursor-pointer"
                onClick={() => {
                  setShowProfileMenu((prev) => !prev);
                }}
              />
              {(showProfileMenu || showMenu) && (
                <div className="flex flex-col w-full md:w-auto md:absolute md:top-14 md:-right-6 bg-[#1e222e] text-white py-2 rounded-lg shadow-md transition-opacity duration-300 font-outfit-400 text-sm md:text-base">
                  <Link
                    to="/user/profile"
                    className="block px-4 py-2 hover:text-purple-400 border-b border-gray-700 text-white text-center"
                    onClick={() => {
                      setShowMenu(false);
                      setShowProfileMenu(false);
                    }}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                      setShowProfileMenu(false);
                    }}
                    className="block w-full text-center px-4 py-2 hover:text-red-400 cursor-pointer text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <Link to="/login" onClick={() => setShowMenu(false)}>
                <Button variant="white" width="w-full md:w-20">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setShowMenu(false)}>
                <Button width="w-full md:w-20">Signup</Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Navbar;