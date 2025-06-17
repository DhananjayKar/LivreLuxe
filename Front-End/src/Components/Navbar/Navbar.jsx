import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../Context/AuthProvider";
import { signOut } from 'firebase/auth';
import { auth } from "../../Pages/Authentic/firebaseConfig";
import logo from "../Assets/logo.png";
import cart from "../Assets/cart.png";
import userIcon from "../Assets/user.png";
import {Link, useLocation} from "react-router-dom";
import { useCart } from '../../Context/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
const menuRef = useRef(null);
const { firebaseUser } = useAuth();
const [hovering, setHovering] = useState(false);
const location = useLocation();

useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

useEffect(() => {
  const lastScrollY = { current: window.scrollY };
  let timeout;

  const handleScroll = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setMenuOpen(false);
      }
      lastScrollY.current = currentScrollY;
    }, 200);
  };

  window.addEventListener("scroll", handleScroll);
  return () => {
    window.removeEventListener("scroll", handleScroll);
    clearTimeout(timeout);
  };
}, []);

const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

const { cartItems } = useCart();
const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="w-full bg-teal-200 flex justify-between items-center px-6 py-4">
      <Link to="/"><div className="flex items-center space-x-3">
        <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
        <h3 className="text-xl font-semibold">LivreLuxe</h3>
      </div></Link>
      <div className="flex items-center space-x-4 relative">
        <Link to="/auth" onClick={() => { localStorage.setItem("authRedirect", location.pathname);
        }} >
          { !firebaseUser &&
        <button type="button" className="bg-white px-3 py-1 rounded hover:bg-gray-100">
          Login
        </button>}
        </Link>

          <div className="relative w-fit">
            { firebaseUser &&
      <Link to="/cart">
        <img src={cart} alt="Cart" className="w-8 h-8" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        )}
      </Link>
            }
    </div>

         <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="focus:outline-none"
      >
        {firebaseUser ? (
          <>
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              <img
                src={firebaseUser?.photoURL || userIcon}
                alt="User"
                className={`w-9 h-9 rounded-full border object-cover transition-all duration-300 ${
                  hovering ? "scale-150 shadow-lg" : ""
                }`}
                onError={(e) => {
                  if (e.target.src !== userIcon) {
                    e.target.src = userIcon;
                  }
                }}
              />
              {hovering && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white text-sm px-3 py-1 rounded-xl shadow border mt-1 z-50">
                  {firebaseUser.displayName || "User"}
                </div>
              )}
            </div>
            </>
        ) : (
        <img
          src={userIcon}
          alt="User Icon"
          className="w-8 h-8 rounded-full object-cover border-2 border-white"
        />
        )}
      </button>

      {menuOpen && (
        <ul className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg py-2 z-10 transition-opacity duration-200">
          <Link to="/sell-item">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            Sell an item
          </li>
          </Link>
          
          <Link to="/orders">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            Your Orders
          </li>
          </Link>
          
          <Link to="/cart">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Your Cart
            </li>
          </Link>
          <Link to="/categories">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Categories
            </li>
          </Link>
          { firebaseUser &&
          <li className="px-4 py-2 hover:bg-red-400 hover:rounded-xl cursor-pointer"><button
              onClick={handleLogout}
              className="hover:scale-110"
            >
              Logout
            </button>
          </li>
          }
        </ul>
      )}
    </div>
      </div>
    </nav>
  );
}