import React from "react";

const ImagePopup = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white p-4 rounded-xl shadow-xl max-w-[90%] max-h-[90%]">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-black text-xl font-bold bg-rose-500 w-12 h-12 font-extrabold text-5xl rounded-3xl text-center"
        >
          &times;
        </button>
        <img
          src={imageUrl}
          alt="Zoomed product"
          className="max-w-full max-h-[70vh] rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImagePopup;