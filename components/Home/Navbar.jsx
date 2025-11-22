"use client";

import React from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";



const navLinks = [
  { href: "/", label: "Home" },
  { href: "/planner", label: "Planner" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/themes", label: "Templates" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
  return (
    <nav className="px-10 py-7 absolute w-full top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/images/logo-dark.png"
            alt="Planify Logo"
            className="w-45"
          />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-8 bg-[#FFFFFF0F] rounded-[30px] backdrop-blur-md px-8 py-4">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="font-manrope text-white hover:text-gray-200 transition-colors duration-300"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger & Get Started */}
        <div className="flex items-center gap-4">
          <Link
            href="/features"
            className="primary-btn hidden lg:block bg-black bg-gradient-to-r from-[#A93E17] via-[#15399A] to-[#A93E17] font-semibold px-6 py-3 font-[manrope] rounded-[100px]  "
          >
            Get Started
          </Link>

          {/* Hamburger Button */}
          <button
            className="lg:hidden text-white text-3xl"
            onClick={() => setIsMenuOpen(true)}
          >
            <HiMenu />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 flex transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Drawer Panel */}
        <div
          className={`ml-auto h-full w-72 bg-[#111111] backdrop-blur-md shadow-lg p-6 flex flex-col transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-semibold text-white font-manrope">
              MENU
            </span>
            <button
              className="text-white text-3xl"
              onClick={() => setIsMenuOpen(false)}
            >
              <HiX />
            </button>
          </div>

          <ul className="flex flex-col gap-6">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-white font-manrope text-lg hover:text-gray-200 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/features"
            className="mt-auto bg-gradient-to-r from-[#A93E17] via-[#15399A] to-[#A93E17] text-white text-center py-3 rounded-lg font-manrope "
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
