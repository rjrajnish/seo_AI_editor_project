import React, { useState } from "react";
import { loginUser, registerUser } from "../apis";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

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
      setLoginLoading(true);
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
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setRegisterLoading(true);
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
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 sm:px-8">
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-16 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl">
        <aside className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 p-10 text-white lg:flex">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-100">
              SEO AI Editor
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight">
              Manage your content workflow from one secure workspace.
            </h1>
            <p className="mt-5 max-w-md text-sm text-blue-50/90">
              Sign in to continue optimizing your SEO performance, or create an
              account to get started with AI-powered content tools.
            </p>
          </div>
          <div className="space-y-3 text-sm text-blue-50/95">
            <p>Secure authentication</p>
            <p>Team-ready role management</p>
            <p>Fast, responsive interface</p>
          </div>
        </aside>

        <main className="w-full bg-white/95 p-6 sm:p-8 lg:w-1/2 lg:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {activeTab === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {activeTab === "login"
                ? "Enter your credentials to access your dashboard."
                : "Fill in your details to set up a new workspace profile."}
            </p>
          </div>

          <div className="mb-8 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === "login"
                  ? "bg-white text-slate-900 shadow"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === "register"
                  ? "bg-white text-slate-900 shadow"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>

          {activeTab === "login" && (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!loginLoading) handleLogin();
              }}
            >
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                  placeholder="you@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>

              {loginError && (
                <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loginLoading ? "Signing in..." : "Login"}
              </button>
            </form>
          )}

          {activeTab === "register" && (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!registerLoading) handleRegister();
              }}
            >
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                  placeholder="John Doe"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                  placeholder="you@company.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                    placeholder="Create password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Role
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
              </div>

              {regError && (
                <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {regError}
                </p>
              )}

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {registerLoading ? "Creating account..." : "Register"}
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
