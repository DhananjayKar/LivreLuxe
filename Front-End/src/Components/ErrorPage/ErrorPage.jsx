import React from "react";
import { Link } from "react-router-dom";
import svg403 from "../Assets/403.svg";
import svg404 from "../Assets/404.svg";
import svg503 from "../Assets/503.svg";
import png204 from "../Assets/204.png";

const ErrorPage = ({ code = 404, message = "Page Not Found" }) => {
  const descriptions = {
    403: "You don't have permission to access this page for now.",
    404: "The page you are looking for doesn't exist.",
    500: "Oops! Something went wrong on our end.",
    503: "Service is temporarily unavailable. Please try again later.",
    204: "You haven't placed any orders yet!"
  };

  const svgMap = {
  403: svg403,
  404: svg404,
  503: svg503,
  204: png204,
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <img src={svgMap[code] || svgMap[404]}  alt="Error Illustration" className="max-w-xs mb-6" />
      <h1 className="text-6xl font-bold text-red-600">{code}</h1>
      <p className="text-2xl mt-4">{message}</p>
      <p className="mt-2 text-gray-500">{descriptions[code]}</p>
      <Link to="/" replace className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Go to Home
      </Link>
    </div>
  );
};

export default ErrorPage;