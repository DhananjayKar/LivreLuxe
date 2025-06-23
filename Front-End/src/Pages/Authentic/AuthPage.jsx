import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AuthPage.css";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const sendTokenToBackend = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!data.success) toast.error("Token rejected by backend.");
    } catch (err) {
      console.error("Backend error:", err);
      toast.error("Failed to reach backend.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");
    if (!isLogin && username.trim().length < 3) return toast.error("Username too short.");

    try {
      const userCred = isLogin
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password);

      if (!isLogin) {
        await updateProfile(userCred.user, { displayName: username });
      }

      const token = await userCred.user.getIdToken();
      await sendTokenToBackend(token);

      const name = userCred.user.displayName || userCred.user.email;
      toast.success(`${isLogin ? "Welcome back" : "Welcome"}, ${name.split(" ")[0]}!`);
      navigate("/");
    } catch (err) {
      console.error("Auth error:", err.message);
      toast.error("Authentication failed. Try with Google.");
    }
  };

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      await sendTokenToBackend(token);

      const name = result.user.displayName || result.user.email;
      toast.success(`Welcome, ${name.split(" ")[0]}!`);
      navigate("/");
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      toast.error("Google sign-in failed.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Side */}
        <div className="auth-left">
          <h1>{isLogin ? "Welcome Back!" : "Join LivreLuxe!"}</h1>
          <div>
          {isLogin ? (
            <>
              <p className="text-2xl font-bold mb-2">Welcome back, reader!</p>
              <p className="text-base leading-relaxed">
                Your bookshelf missed you. Let’s pick up where you left off — or maybe discover something completely new today?
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold mb-2">Hey, welcome to LivreLuxe!</p>
              <p className="text-base leading-relaxed">
                You just stepped into a world of stories, ideas, and imagination. <br />
                Sign up, explore our shelf, and start your own reading journey — no pressure, just pages 📖✨
              </p>
            </>
          )}
          </div>
        </div>

        {/* Right Side */}
        <div className={`auth-right animated-${animationKey % 2 === 0 ? "even" : "odd"}`}>
          <div className="form-box">
            <h2>{isLogin ? "Login to Your Account" : "Create an Account"}</h2>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 pr-10 border rounded-lg"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 text-xl cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
            </form>

            <div className="divider">or</div>

            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 px-5 py-2 rounded-xl bg-white/20 backdrop-blur-md text-black border border-white/30 shadow-md transition-all duration-300 hover:bg-red-600 hover:text-white hover:rounded-full"
            >
              Sign in with Google
            </button>

            <p className="switch-text">
              {isLogin ? "Need an account?" : "Already have an account?"}{" "}
              <span
                onClick={() => {
                  setIsLogin(!isLogin);
                  setAnimationKey((prev) => prev + 1);
                }}
              >
                {isLogin ? "Sign up" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;