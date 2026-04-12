import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  clearError,
} from "../../redux/slices/authSlice";
import API from "../../services/Api";
import { Eye, EyeOff } from "lucide-react";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLocalError("");
    dispatch(clearError());

    if (!email || !password) {
      setLocalError("Please fill out all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError("Please enter a valid email address");
      return;
    }

    try {
      dispatch(loginStart());

      const loginData = { email: email.trim(), password };
      const res = await API.loginAccountAPI(loginData);

      const userData = res.data?.admin || res.data?.user;
      const token = res.data?.token;

      if (!userData || !token) {
        throw new Error("Invalid login response");
      }

      dispatch(loginSuccess({ user: userData, token }));
      navigate("/dashboard");
    } catch (error) {
      const msg =
        error?.response?.data?.error || // 👈 this matches your API response
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred";

      dispatch(loginFailure(msg));
      setLocalError(msg);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0eb397]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-left">DermaScan+ Admin</h2>

        {displayError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {displayError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CC99]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CC99] pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
                style={{ color: "#00CC99" }}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00CC99] text-white py-2 px-4 rounded-lg hover:bg-[#00aa80] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-300 text-xs">
          © {new Date().getFullYear()} DermaScan+ Admin Portal
        </p>
      </div>
    </div>
  );
};

export default LoginAdmin;
