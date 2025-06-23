import React, { useEffect } from "react";
import call from "../Assets/call.png";
import mail from "../Assets/email.png";
import map from "../Assets/map.png";
import github from "../Assets/github.png";
import facebook from "../Assets/facebook.png";
import instagram from "../Assets/instagram.png";
import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";

export default function Footer() {
  
  const navigate = useNavigate();

  useEffect(() => {
    const element = document.getElementById("dev-trigger");
    if (!element) return;

    let pressTimer;

    const startPress = () => {
      pressTimer = setTimeout(() => {
        navigate("/developer");
      }, 1000);
    };

    const cancelPress = () => {
      clearTimeout(pressTimer);
    };
    
    element.addEventListener("mousedown", startPress);
    element.addEventListener("mouseup", cancelPress);
    element.addEventListener("mouseleave", cancelPress);

    element.addEventListener("touchstart", startPress);
    element.addEventListener("touchend", cancelPress);

    return () => {
      element.removeEventListener("mousedown", startPress);
      element.removeEventListener("mouseup", cancelPress);
      element.removeEventListener("mouseleave", cancelPress);
      element.removeEventListener("touchstart", startPress);
      element.removeEventListener("touchend", cancelPress);
    };
  }, [navigate]);
  
  return (
    <footer className="bg-blue-400 pt-10">
      <div className="flex flex-wrap justify-evenly gap-8 px-6">
        <div className="max-w-sm">
          <h2 className="text-xl font-bold">LivreLuxe</h2>
          <div className="underline w-12 h-1 bg-black rounded-xl my-2"></div>
          <p className="text-sm">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta nam tempore rerum quaerat, maxime nobis autem ullam enim asperiores. Ipsam eaque provident sint ad, voluptates praesentium eligendi.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Quick Links</h2>
          <div className="underline w-12 h-1 bg-black rounded-xl my-2"></div>
          <ul className="text-sm space-y-1">
            <Link to="/sell-item"><li>Sell an Item</li></Link>
            <Link to="/categories"><li>Categories</li></Link>
            <Link to="/cart"><li>Your Cart</li></Link>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold">Reach Us</h2>
          <div className="underline w-12 h-1 bg-black rounded-xl my-2"></div>
          <div className="flex items-start gap-2 mb-2">
            <img src={map} alt="map icon" className="w-5 h-5 mt-1" />
            <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <img src={call} alt="call icon" className="w-5 h-5" />
            <p className="text-sm">+91 XXXXX XXXX3</p>
          </div>
          <div className="flex items-center gap-2">
            <img src={mail} alt="email icon" className="w-5 h-5" />
            <p className="text-sm">xxxxx.xxxxx@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="bg-[#f8f8f8] text-gray-700 text-center py-4 mt-8 px-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm mb-2 md:mb-0">&copy;2025 <span id="dev-trigger" className="font-semibold cursor-pointer">Dhananjay Kar</span> - All Rights Reserved.</p>
        <div className="flex space-x-4">
          <a href="https://www.instagram.com/kardhananjay9?igsh=YzljYTk1ODg3Zg==">
            <img src={instagram} alt="instagram icon" className="w-5 h-5" />
          </a>
          <a href="https://www.facebook.com/dhananjay.kar.969">
            <img src={facebook} alt="facebook icon" className="w-5 h-5" />
          </a>
          <a href="https://github.com/DhananjayKar">
            <img src={github} alt="github icon" className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}