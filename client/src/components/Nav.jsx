// src/components/Nav.jsx
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const LINKS = [
    { to: "/", label: "Home" },
    { to: "/discover", label: "Discover" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
];

export default function Nav() {
    const [open, setOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 👇 Check cookies or token when component mounts
    useEffect(() => {
        fetch("http://localhost:5000/api/auth/check", {
            credentials: "include",   // this sends the real cookie
        })
            .then((res) => res.json())
            .then((data) => setIsLoggedIn(data.authenticated))
            .catch(() => setIsLoggedIn(false));
    }, []);


    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-40 sticky top-0 z-50 m-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: brand */}
                    <div className="flex items-center gap-4">
                        <a href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow">
                                LL
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-lg font-semibold text-slate-900 leading-none ">LocalLynk</div>

                            </div>
                        </a>

                    </div>

                    {/* Center: desktop nav */}
                    <nav className="hidden md:flex md:items-center md:space-x-8">
                        {LINKS.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `relative px-1 py-2 inline-block text-sm font-medium transition-colors duration-150
                   ${isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900"}`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className="select-none">{label}</span>
                                        <span
                                            aria-hidden="true"
                                            className={
                                                "absolute left-0 -bottom-1 h-[3px] bg-indigo-600 transition-all duration-300 " +
                                                (isActive ? "w-full" : "w-0 group-hover:w-full")
                                            }
                                        />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right controls */}
                    <div className="flex items-center gap-3">
                        {/* Search (small) */}
                        <div className="hidden sm:flex items-center bg-slate-50 border border-slate-100 rounded-md px-2 py-1">
                            <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                            </svg>
                            <input
                                aria-label="Search"
                                className="bg-transparent text-sm placeholder:text-slate-400 outline-none w-40"
                                placeholder="Search places..."
                                type="search"
                            />
                        </div>

                        {/* Add Listing CTA */}
                        <a
                            href="/add-listing"
                            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-700 transition"
                        >
                            Add Listing
                        </a>

                        {/* Profile avatar with dropdown mock */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen((s) => !s)}
                                aria-expanded={profileOpen}
                                aria-haspopup="true"
                                className="inline-flex items-center p-1 rounded-full hover:ring-2 hover:ring-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-9 h-9 text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2a5 5 0 100 10 5 5 0 000-10zm-7 18a7 7 0 0114 0H5z"
                                        clipRule="evenodd"
                                    />
                                </svg>

                            </button>

                            {/* simple dropdown — replace links with actual actions */}
                            {/* Profile dropdown */}
                            {profileOpen && (
                                <div
                                    role="menu"
                                    aria-label="Profile options"
                                    className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1"
                                >
                                    {isLoggedIn ? (
                                        <>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            >
                                                Settings
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    // clear cookie and simulate signout
                                                    document.cookie = "token=; Max-Age=0; path=/;";
                                                    setIsLoggedIn(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                                            >
                                                Sign out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="px-4 py-2 text-sm text-slate-500">Guest Account</div>
                                            <Link
                                                to="/login"
                                                className="block px-4 py-2 text-sm text-indigo-600 hover:bg-slate-50"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/signup"
                                                className="block px-4 py-2 text-sm text-indigo-600 hover:bg-slate-50"
                                            >
                                                Sign Up
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setOpen((s) => !s)}
                                aria-controls="mobile-menu"
                                aria-expanded={open}
                                className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            >
                                <span className="sr-only">Open menu</span>
                                {open ? (
                                    // X icon
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    // Hamburger
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu (slide down) */}
            <div
                id="mobile-menu"
                className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${open ? "max-h-[480px]" : "max-h-0"}`}
            >
                <div className="px-4 pt-2 pb-4 space-y-1">
                    {LINKS.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? "text-indigo-700 bg-indigo-50" : "text-slate-700 hover:bg-slate-50"
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}

                    <a
                        href="/add-listing"
                        className="block mt-1 px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white text-center hover:bg-indigo-700"
                    >
                        Add Listing
                    </a>

                    <div className="pt-2 border-t border-slate-100 mt-2">
                        <a href="/profile" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
                            My Profile
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
