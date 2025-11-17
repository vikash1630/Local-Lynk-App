// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);
  const [error, setError] = useState("");

  // Guest handler (sign out backend session then redirect to homepage)
  const handleGuest = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    try {
      setLoadingGuest(true);
      await fetch("http://localhost:5000/api/auth/signout", {
        credentials: "include",
        method: "POST",
      });
      // navigate to home (client-side)
      navigate("/");
    } catch (err) {
      console.error("Guest signout failed:", err);
      alert("Could not continue as guest (network error).");
    } finally {
      setLoadingGuest(false);
    }
  };

  // AJAX login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      setError("Please enter email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important if server sets cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const redirectUrl = data?.redirectUrl ?? "/";
        navigate(redirectUrl);
      } else {
        setError(data?.error || data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      setError("Network error — is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 via-white to-blue-50">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Log in to your{" "}
          <span className="text-indigo-600 font-semibold">LocalLynk</span> account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="grow h-px bg-slate-200" />
          <span className="px-3 text-slate-400 text-sm">or</span>
          <div className="grow h-px bg-slate-200" />
        </div>

        <p className="text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-600 font-medium hover:underline">
            Sign up
          </a>
        </p>

        <p className="text-center text-sm text-slate-600 mt-4">
          Or continue as{" "}
          <button
            type="button"
            onClick={handleGuest}
            disabled={loadingGuest}
            className="text-indigo-600 font-medium cursor-pointer hover:underline disabled:opacity-50"
          >
            {loadingGuest ? "Continuing..." : "Guest"}
          </button>
        </p>
      </div>
    </div>
  );
}
