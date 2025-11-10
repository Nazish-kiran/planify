"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Background video slow zoom animation is handled by Tailwind
    const sliderInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(sliderInterval);
  }, []);
  const handleSwipe = () => {
    // Handle swipe to features
    window.location.href = "/features";
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/themes", label: "Themes" },
    { href: "/pricing", label: "Pricing" },
    { href: "/planner", label: "Planner" },
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <div className="bg-[#060606] text-white">
        <Head>
          <title>PLANZIO AI – Plan Your Life with AI</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>

        {/* Navbar */}
        <nav className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 transition-transform duration-300 hover:scale-102">
              <img
                src="/planzio.png"
                alt="Planify Logo"
                className="h-10 w-10 rounded-full shadow-lg shadow-white/20"
              />
              <span className="text-xl font-semibold text-white text-shadow shadow-white/30">
                PLANZIO AI
              </span>
            </div>

            <ul
              className={`flex flex-col md:flex-row items-center gap-6 md:gap-8 transition-all duration-300 ${
                isMenuOpen ? "flex" : "hidden md:flex"
              }`}
            >
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-700 font-medium transition-colors duration-300 hover:text-black hover:underline underline-offset-4"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <Link
                href="/features"
                className="hidden md:block bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition"
              >
                Get Started
              </Link>
              <button
                className="flex flex-col gap-1 cursor-pointer md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span
                  className={`w-6 h-0.5 bg-white rounded transition-all duration-300 ${
                    isMenuOpen ? "transform translate-y-1.5 rotate-45" : ""
                  }`}
                ></span>
                <span
                  className={`w-6 h-0.5 bg-white rounded transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`w-6 h-0.5 bg-white rounded transition-all duration-300 ${
                    isMenuOpen ? "transform -translate-y-1.5 -rotate-45" : ""
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section
          className="min-h-screen flex items-center justify-start px-20 relative bg-no-repeat "
          style={{
            backgroundImage: 'url("/images/hero-bg-shape.png")',
            backgroundPosition: "top center",
          }}
        >
          <div className="max-w-2xl animate-fade-in-up">
            <span className="bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-sm inline-block mb-5">
              ORGANIZE YOUR LIFE SMARTLY
            </span>
            <h1 className="text-5xl font-bold leading-tight mb-5">
              Plan Your Life with
              <br />
              AI-Powered Planners
            </h1>
            <p className="text-lg font-light mb-10 text-gray-300">
              Turn your goals, routines, and ambitions into actionable plans
              with AI. Whether it&apos;s studies, business, or personal growth —
              Planify helps you stay ahead.
            </p>
            <div className="flex gap-5">
              <a href="#" className="btn-glow text-base px-10 py-4">
                Get Started – Free
              </a>
              <a href="#" className="btn-outline text-base px-10 py-4">
                View Pricing
              </a>
            </div>
          </div>
        </section>

        {/* About Planner Section */}
        <section className="py-24 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-5 flex items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl mb-8 text-gradient">
                Your AI-Powered Life Planner
              </h2>
              <p className="text-lg leading-relaxed mb-5 text-white/90">
                PLANZIO AI is not just another planner – it&apos;s your personal
                AI assistant that helps you organize your life, set goals, and
                achieve them with smart planning. Our advanced AI technology
                understands your needs and creates personalized plans that adapt
                to your lifestyle.
              </p>
              <p className="text-lg leading-relaxed text-white/90">
                Whether you&apos;re a student aiming for academic excellence, a
                professional building your career, or an entrepreneur growing
                your business, PLANZIO AI is designed to help you succeed.
              </p>
            </div>
            <div className="flex-1 p-5">
              <div className="relative w-full overflow-hidden rounded-2xl">
                <div
                  className="flex w-[200%] transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 50}%)` }}
                >
                  <img
                    src="/Black Modern Gradient Programmer Presentation.png"
                    alt="Planner Preview 1"
                    className="w-1/2 h-80 object-cover rounded-2xl shadow-2xl border border-white/10"
                  />
                  <img
                    src="/black.png"
                    alt="Planner Preview 2"
                    className="w-1/2 h-80 object-cover rounded-2xl shadow-2xl border border-white/10"
                  />
                </div>
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2.5 z-10">
                  <button
                    className={`w-3 h-3 rounded-full border-2 border-white/80 transition-all duration-300 ${
                      currentSlide === 0
                        ? "bg-white/80 scale-120"
                        : "bg-transparent"
                    }`}
                    onClick={() => setCurrentSlide(0)}
                  ></button>
                  <button
                    className={`w-3 h-3 rounded-full border-2 border-white/80 transition-all duration-300 ${
                      currentSlide === 1
                        ? "bg-white/80 scale-120"
                        : "bg-transparent"
                    }`}
                    onClick={() => setCurrentSlide(1)}
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience Section */}
        <section className="py-24 text-center">
          <h2 className="text-4xl mb-12 text-gradient">Who Can Benefit?</h2>
          <div className="max-w-6xl mx-auto px-5 flex justify-center gap-8 flex-wrap">
            {[
              {
                icon: "/Organize your studies and achieve academic excellence.make img for this.jpg",
                title: "Students",
                description:
                  "Organize your studies and achieve academic excellence",
              },
              {
                icon: "/Professionals_Balance work life and personal growth.pic for this.jpg",
                title: "Professionals",
                description: "Balance work life and personal growth",
              },
              {
                icon: "/Entrepreneurs_Plan and grow your business effectively.pic.jpg",
                title: "Entrepreneurs",
                description: "Plan and grow your business effectively",
              },
              {
                icon: "/Freelancers_Manage multiple projects and deadlines,pic_.jpg",
                title: "Freelancers",
                description: "Manage multiple projects and deadlines",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex-1 min-w-64 max-w-72 p-8 glass-card border border-white/10 rounded-2xl backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2.5"
              >
                <div className="w-20 h-20 mx-auto mb-5 rounded-full overflow-hidden border-2 border-white/10">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl mb-4 text-white">{item.title}</h3>
                <p className="text-white/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-black/30">
          <h2 className="text-4xl text-center mb-16 text-gradient relative">
            How It Works
            <span className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></span>
          </h2>

          {[
            {
              step: "Step 1: AI Analysis",
              description:
                "Tell Planzio your goals, routines, and constraints. Our AI analyzes patterns in your inputs and identifies the optimal starting point for planning.",
              image:
                "/Step 1_ AI Analysis_Tell Planzio your goals, routines, and constraints. Our AI analyzes patterns in your inputs and identifies the optimal starting point for planning.make  a pic of it web asking question .try .jpg",
              reverse: false,
            },
            {
              step: "Step 2: Smart Planning",
              description:
                "Planzio generates a personalized plan: tasks, priorities, and a schedule tailored to your day-to-day life so you can take consistent action.",
              image:
                "/Step 2_ Smart Planning_Planzio generates a personalized plan_ tasks, priorities, and a schedule tailored to your day-to-day life so you can take consistent action.plz make a pic of this in astheiic theme.jpg",
              reverse: true,
            },
            {
              step: "Step 3: Adaptive Learning",
              description:
                "The AI observes your progress and preferences, then adapts its suggestions — rescheduling tasks and refining priorities as needed.",
              image: "/adapt-icon.jpg",
              reverse: false,
            },
            {
              step: "Step 4: Progress Tracking",
              description:
                "Track completion rates, streaks, and trends with built-in analytics. Planzio highlights wins and flags areas that need more focus.",
              image: "/tracking-icon.jpg",
              reverse: true,
            },
            {
              step: "Step 5: Continuous Improvement",
              description:
                "Receive suggestions for habit improvements, time-block tweaks, and goal refinements — helping you iterate towards better results over time.",
              image: "/insights-icon.jpg",
              reverse: false,
            },
          ].map((stepData, index) => (
            <div
              key={index}
              className={`max-w-6xl mx-auto mb-20 p-10 glass-card border border-white/10 rounded-3xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden group ${
                stepData.reverse ? "flex-row-reverse" : "flex"
              } items-center gap-16`}
            >
              <div className="flex-1">
                <h3 className="text-2xl mb-5 text-white relative pl-5">
                  {stepData.step}
                  <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-[#ff6a00] to-[#007bff] rounded"></span>
                </h3>
                <p className="text-lg leading-relaxed text-white/90 relative pl-5">
                  {stepData.description}
                </p>
              </div>
              <div className="flex-1 p-5 relative">
                <div className="absolute top-1/2 right-[-30px] transform -translate-y-1/2 w-0.5 h-3/4 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                <img
                  src={stepData.image}
                  alt={stepData.step}
                  className="w-full rounded-2xl shadow-2xl border border-white/10 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </section>

        {/* Swipe Button Section */}
        <section className="py-16 flex justify-center items-center">
          <div
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full w-72 h-16 relative cursor-pointer transition-all duration-300 hover:bg-white/15 hover:scale-102 overflow-hidden"
            onClick={handleSwipe}
          >
            <div className="absolute left-0 top-0 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center cursor-grab transition-all duration-300 active:bg-white/30 active:cursor-grabbing">
              <span className="text-white text-xl">→</span>
            </div>
            <div className="absolute w-full text-center text-white/80 text-lg font-medium pointer-events-none transition-opacity duration-300">
              Swipe to Features
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 pt-16 mt-24">
          <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h3 className="text-xl mb-5 font-semibold">PLANZIO AI</h3>
              <p className="text-gray-600 mb-5">
                Plan your life with AI-powered intelligence
              </p>
              <div className="flex gap-4">
                {[
                  "/twitter-icon.png",
                  "/linkedin-icon.png",
                  "/instagram-icon.png",
                ].map((icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition"
                  >
                    <Image src={icon} alt="Social" width={20} height={20} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-black text-lg mb-5">Company</h4>
              <ul className="space-y-2.5 text-gray-700">
                {["About Us", "Careers", "Blog", "Press"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-black transition">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-black text-lg mb-5">Product</h4>
              <ul className="space-y-2.5 text-gray-700">
                {["Features", "Pricing", "Integrations", "API"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-black transition">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-black text-lg mb-5">Resources</h4>
              <ul className="space-y-2.5 text-gray-700">
                {[
                  "Documentation",
                  "Tutorials",
                  "Support",
                  "Privacy Policy",
                ].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-black transition">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center mt-10 pt-5 border-t border-gray-200">
            <p className="text-gray-500">
              &copy; 2025 PLANZIO AI. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
