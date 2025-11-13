// src/components/SignUp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate?.() ?? null;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);

  const handleGuest = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    try {
      setLoadingGuest(true);
      // Sign out any existing session on the backend (if your backend supports it)
      const res = await fetch("http://localhost:5000/api/auth/signout", {
        credentials: "include",
        method: "POST",
      });

      // optional: parse JSON if backend returns something
      try {
        await res.json();
      } catch {
        /* ignore if no JSON */
      }

      setIsLoggedIn(false);

      // redirect to desired page for guest users
      if (navigate) navigate("/"); // client-side if using react-router
      else window.location.href = "/";
    } catch (err) {
      console.error("Guest signout failed:", err);
      setIsLoggedIn(false);
      alert("Could not continue as guest (network error).");
    } finally {
      setLoadingGuest(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault(); // stop page refresh
    setLoadingSignup(true);

    const form = e.target;
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const dob = form.dob.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // basic client-side validation
    if (!username || !email || !dob || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      setLoadingSignup(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      setLoadingSignup(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // if your backend needs cookies
        body: JSON.stringify({ username, email, dob, password, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        // redirect to login (react-router) or fallback
        if (navigate) navigate("/login");
        else window.location.href = "/login";
      } else {
        // show backend error message if provided
        alert(data?.error || data?.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Network error — is the backend running on http://localhost:5000 ?");
    } finally {
      setLoadingSignup(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 via-white to-blue-50">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
          Create Account ✨
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Join <span className="text-indigo-600 font-semibold">LocalLynk</span> today
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loadingSignup}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
          >
            {loadingSignup ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="grow h-px bg-slate-200" />
          <span className="px-3 text-slate-400 text-sm">or</span>
          <div className="grow h-px bg-slate-200" />
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </a>
        </p>

        {/* Guest User */}
        <p className="text-center text-sm text-slate-600 mt-4">
          Or continue as{" "}
          <button
            type="button"
            onClick={handleGuest}
            disabled={loadingGuest}
            className="text-indigo-600 font-medium hover:underline cursor-pointer disabled:opacity-50"
          >
            {loadingGuest ? "Continuing..." : "Guest"}
          </button>
        </p>
      </div>
    </div>
  );
}
