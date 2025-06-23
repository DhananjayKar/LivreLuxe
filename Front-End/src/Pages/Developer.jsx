import React from "react";
import { FaInstagram, FaGithub, FaEnvelope, FaFacebook } from "react-icons/fa";
import logo from "../Components/Assets/logo.png";
import devPic from "../Components/Assets/developer.png";

const Developer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-6 py-10 flex justify-center items-start">
      <div className="w-full max-w-5xl group transition-transform duration-500">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <img src={logo} alt="LivreLuxe Logo" className="w-16 h-16" />
          <h1 className="text-5xl font-extrabold text-blue-700">LivreLuxe</h1>
        </div>

        {/* Developer Card */}
        <div className="flex flex-col md:flex-row items-center bg-white shadow-2xl rounded-2xl p-10 relative">
          {/* Profile Picture with Outside Blur */}
          <div className="relative group w-56 h-56 mb-6 md:mb-0 md:mr-32 hover:scale-105">
            <div className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-500 bg-blue-200 z-0" />
            <img
              src={devPic}
              alt="Developer"
              className="relative z-10 w-full h-full object-cover rounded-full border-4 border-blue-300 transition duration-500"
            />
          </div>

          {/* Developer Info */}
          <div className="text-center md:text-left space-y-4">
            <h2 className="text-3xl font-bold text-blue-800">Dhananjay Kar</h2>
            <p className="text-gray-700 max-w-md text-base leading-relaxed">
              MERN Stack Developer with a passion for crafting seamless, engaging
              user experiences. Explorer of design, lover of logic, and lifelong
              learner. Creator of LivreLuxe, a premium book e-commerce platform.
            </p>

            {/* Social Links */}
            <div className="flex justify-center md:justify-start gap-6 pt-2">
              <a
                href="https://github.com/DhananjayKar"
                target="_blank"
                rel="noreferrer"
                className="text-gray-800 hover:text-black transition-transform transform hover:scale-125"
              >
                <FaGithub size={28} />
              </a>
              <a
                href="https://www.instagram.com/kardhananjay9?igsh=YzljYTk1ODg3Zg=="
                target="_blank"
                rel="noreferrer"
                className="text-pink-600 hover:text-pink-700 transition-transform transform hover:scale-125"
              >
                <FaInstagram size={28} />
              </a>
              <a
                href="mailto:kardhananjay9@gmail.com"
                className="text-red-500 hover:text-red-600 transition-transform transform hover:scale-125"
              >
                <FaEnvelope size={28} />
              </a>
              <a
                href="https://www.facebook.com/dhananjay.kar.969"
                className="text-blue-600 hover:text-blue-700 transition-transform transform hover:scale-125"
              >
                <FaFacebook size={28} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developer;