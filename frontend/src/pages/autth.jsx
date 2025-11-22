import React, { useState } from "react";
import { loginUser, registerUser } from "../apis";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("");
  const [regError, setRegError] = useState("");

  // Email validation
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = async () => {
    try {
      setLoginError("");

      // Email Validation
      if (!validateEmail(loginEmail)) {
        setLoginError("Please enter a valid email.");
        return;
      }

      const response = await loginUser({
        email: loginEmail,
        password: loginPassword,
      });

      // If API sends success + token
      if (response?.data?.token) {
        const token = response.data.token;

        // Save token as user_token
        localStorage.setItem("user_token", token);

        // Redirect to dashboard
        window.location.href = "/";
        return;
      }

      // Backend sent error but no exception
      setLoginError(response?.data?.message || "Login failed. Try again.");
    } catch (error) {
      // Handle server errors
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";

      setLoginError(msg);
    }
  };

  const handleRegister = async () => {
    try {
      // Email validation
      if (!validateEmail(regEmail)) {
        setRegError("Please enter a valid email.");
        return;
      }

      // Empty fields check
      if (!regName || !regPassword || !regRole) {
        setRegError("All fields are required.");
        return;
      }

      setRegError("");

      const payload = {
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
      };

      const response = await registerUser(payload);

      // If backend returns success
      if (response?.status === 200) {
        alert("Registration Successful");

        // Optionally redirect user to login tab
        setActiveTab("login");

        // Optionally clear form
        setRegName("");
        setRegEmail("");
        setRegPassword("");
        setRegRole("");

        return;
      }
      // console.log("response",response)
      // If backend returns error message without throwing
      setRegError("Registration failed.");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";

      setRegError(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`w-1/2 py-2 text-lg font-semibold ${
              activeTab === "login"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 text-lg font-semibold ${
              activeTab === "register"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            {loginError && (
              <p className="text-red-600 text-sm mb-3">{loginError}</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login Now
            </button>
          </div>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Full Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Create password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Role</label>
              <select
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            {regError && (
              <p className="text-red-600 text-sm mb-3">{regError}</p>
            )}

            <button
              onClick={handleRegister}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Register Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
