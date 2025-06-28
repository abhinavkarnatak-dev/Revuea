import React from "react";
import Button from "../components/layout/Button";

const NotFound = () => {
  return (
    <div className="bg-[#0a0b10] w-screen h-screen flex flex-col gap-8 justify-center items-center">
      <div className="flex flex-col gap-4 justify-center items-center">
        <h1 className="text-2xl md:text-4xl lg:text-6xl text-white font-outfit-600">
          404 - Page Not Found
        </h1>
        <p className="text-xs md:text-base lg:text-lg text-[#9ca3af] font-outfit-500">
          Oops! The page you're looking for doesn't exist.
        </p>
      </div>
      <a href="/dashboard">
        <Button variant="white" width="w-18 md:w-22">
          Go Home
        </Button>
      </a>
    </div>
  );
};

export default NotFound;