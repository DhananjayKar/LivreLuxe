import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth, provider } from "./firebaseConfig";
import "./AuthPage.css";
import { Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setUsername("");
    setPassword("");
  };

  const sendTokenToBackend = async (usernameOptional) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      await fetch("http://localhost:5000/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          username: usernameOptional || user.displayName,
        }),
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created!");
      await sendTokenToBackend(username);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      await sendTokenToBackend();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      alert("Signed in with Google!");
      await sendTokenToBackend(result.user.displayName);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-box ${!isLogin ? "rotate" : ""}`}>
        
        <div className="auth-left">
          <h1 className="text-4xl font-bold mb-4">
            {isLogin ? "Welcome Back!" : "Join Us Today!"}
          </h1>
          <p className="text-lg text-gray-700">
            {isLogin
              ? "Access your account and explore your personal library."
              : "Create an account to start your reading journey with us."}
          </p>
        </div>

        
        <div className={`auth-right`}>
          <div className={`auth-form-wrapper ${!isLogin ? "rotate" : ""}`}>
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="auth-form">
              <h2 className="text-2xl font-bold mb-4 text-center">
                {isLogin ? "Login" : "Sign Up"}
              </h2>

              {!isLogin && (
                <input
                  className="auth-input border-2 rounded"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}
              <input
                className="auth-input border-2 rounded"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative w-full mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 pr-10 border-2 rounded"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </span>
              </div>
              {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

              <button type="submit" className="auth-btn bg-blue-600 hover:bg-blue-700">
                {isLogin ? "Login" : "Sign Up"}
              </button>

              <p
                className="text-sm text-blue-500 text-center cursor-pointer mt-2"
                onClick={handleToggle}
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Login"}
              </p>

              <button
                type="button"
                onClick={handleGoogle}
                className="auth-btn bg-red-500 hover:bg-red-600 mt-3"
              >
                Sign in with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;