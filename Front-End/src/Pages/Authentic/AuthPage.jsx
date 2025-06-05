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
import { toast } from "react-hot-toast";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [redirectTo, setRedirectTo] = useState("/");

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setUsername("");
    setPassword("");
  };
  
  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already in use.";
      case "auth/invalid-email":
        return "Please enter a valid email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  const sendTokenToBackend = async (usernameOptional) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      await fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
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
      toast.success("Account created!");
      await sendTokenToBackend(username);
      navigate(redirectTo);
    } catch (err) {
      setError(getFriendlyError(err.code));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login.successful!");
      await sendTokenToBackend();
      navigate(redirectTo);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        toast.error("This account hasn't been signed in. Sign up first.");
      } else {
        setError(getFriendlyError(err.code));
      }
    }
  };
  
  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const isNewUser = result._tokenResponse?.isNewUser;
  
      if (isNewUser) {
        toast.error("This account hasn't been signed in. Sign up first.");
        await auth.signOut();
        return;
      }
  
      toast.success("Signed in with Google!");
      await sendTokenToBackend(result.user.displayName);
      navigate(redirectTo);
    } catch (err) {
      setError(getFriendlyError(err.code));
    }
  };
  
  useEffect(() => {
    const redirectPath = localStorage.getItem("authRedirect") || "/";
    setRedirectTo(redirectPath);
  }, []);

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
                  onChange={(e) => setUsername(e.target.value.trim())}
                />
              )}
              <input
                className="auth-input border-2 rounded"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
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