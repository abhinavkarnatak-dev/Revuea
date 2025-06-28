import { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import Button from "./Button";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
      <Button
        variant="theme"
        width="w-11"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <BsSun /> : <BsMoon />}
      </Button>
    </>
  );
};

export default ThemeToggle;