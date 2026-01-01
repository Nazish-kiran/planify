"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useAnimation } from "framer-motion";
import "./home.css";
import Marquee from "@/components/Home/Marquee";
import Navbar from "@/components/Home/Navbar";
import DividerBtn from "@/components/ui/DividerBtn";
import StatsCard from "@/components/Home/StatsCard";


export default function Home() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const text = `Planzio AI is your intelligent assistant that helps you stay organized, set meaningful goals, and create adaptive plans tailored to your lifestyle, empowering you to achieve success efficiently.`;

  const stats = [
    {
      title: "Integrated Tasks Processed",
      number: "298+",
      iconSrc: "/images/icon-about-item-1.svg",
      bottomImageSrc: "/images/about-item-image-1.png",
    },
    {
      title: "Students Benefiting",
      number: "978+",
      iconSrc: "/images/icon-about-item-2.svg",
      bottomImageSrc: "/images/about-item-image-2.png",
    },
    {
      title: "Handled by AI Bots",
      number: "300%",
      iconSrc: "/images/icon-about-item-3.svg",
      bottomImageSrc: "/images/about-item-image-3.png",
    },
    {
      title: "Efficiency Improvement",
      number: "95X",
      iconSrc: "/images/icon-about-item-4.svg",
      bottomImageSrc: "/images/about-item-image-4.png",
    },
  ];

  const AnimatedText = ({ text }) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const [scrollDir, setScrollDir] = useState("down"); // track scroll direction

    useEffect(() => {
      let lastScrollY = window.scrollY;

      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        setScrollDir(currentScrollY > lastScrollY ? "down" : "up");
        lastScrollY = currentScrollY;
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && scrollDir === "down") {
            controls.start((i) => ({
              opacity: 1,
              y: 0,
              transition: { delay: i * 0.01, duration: 0.9 },
            }));
          } else if (!entry.isIntersecting) {
            controls.start({ opacity: 0, y: 20 }); // reset when out of view
          }
        },
        { threshold: 0.1 } // trigger when 10% visible
      );

      if (ref.current) observer.observe(ref.current);
      return () => ref.current && observer.unobserve(ref.current);
    }, [controls, scrollDir]);

    return (
      <p
        ref={ref}
        className="text-5xl leading-13.75 font-light   text-center mb-5 text-white"
      >
        {text.split(" ").map((word, index) => (
          <motion.span key={index} custom={index} animate={controls}>
            {word}{" "}
          </motion.span>
        ))}
      </p>
    );
  };

  return (
    <>
      <div className="bg-[#060606] text-white  ">
        <Head>
          <title>PLANZIO AI - Plan Your Life with AI</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>

        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <section
          className="relative bg-no-repeat pt-72"
          style={{
            backgroundImage: 'url("/images/hero-bg-shape.png")',
            backgroundPosition: "top center",
          }}
        >
          <div className="max-w-3xl m-auto">
            <h1 className="m-auto text-7xl text-center font-semibold leading-15 mb-5  ">
              Plan Your Life with{" "}
              <span className=" bg-gradient-to-r from-[#A93E17] via-[#15399A] to-[#A93E17] bg-clip-text text-transparent">
                AI-Powered Planners
              </span>
            </h1>
            <p className="text-md text-center mb-10 text-[#a7aabb]  ">
              Turn your goals, routines, and ambitions into actionable plans
              with AI. Whether it&apos;s studies, business, or personal growth —
              Planify helps you stay ahead.
            </p>
            <div className="flex gap-6 justify-center">
              <Link
                href="#"
                className="secondary-btn relative border-[#A93E17] border rounded-[100px] font-semibold px-8  py-3   bg-black"
              >
                Get Started - Free
              </Link>
              <Link
                href="#"
                className="primary-btn bg-linear-to-r from-[#A93E17] via-[#15399A] to-[#A93E17] font-semibold px-6 py-3   rounded-[100px]"
              >
                View Pricing
              </Link>
            </div>
          </div>
          <h4 className="text-center   mt-20 text-xl text-[#a7aabb]">
            Lastest Updates From{" "}
            <span className=" text-[#A93E17]  "> Planzio</span>{" "}
          </h4>
          <Marquee />
        </section>

        {/* About Planner Section */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto w-full text-center px-5 gap-16">
            <DividerBtn label="about us" />
            <AnimatedText text={text} />
          </div>
        </section>
        <div className="flex flex-wrap px-10 w-full mb-30">
          {stats.map((item, index) => (
            <StatsCard
              key={index}
              title={item.title}
              number={item.number}
              iconSrc={item.iconSrc}
              bottomImageSrc={item.bottomImageSrc}
            />
          ))}
        </div>

        {/* Target Audience Section */}
        <section className="text-center">
          <DividerBtn label="who can benefit" />
          <h2 className="text-9xl mb-12 text-gradient">
            AI That Works for Everyone, Driving <br /> the {" "}
            <span className=" bg-gradient-to-r from-[#A93E17] via-[#15399A] to-[#A93E17] bg-clip-text text-transparent">
            Future Forward
            </span>
          </h2>
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
            <span className="absolute -bottom-3.75 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-linear-to-r from-transparent via-white to-transparent"></span>
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
                  <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-linear-to-b from-[#ff6a00] to-[#007bff] rounded"></span>
                </h3>
                <p className="text-lg leading-relaxed text-white/90 relative pl-5">
                  {stepData.description}
                </p>
              </div>
              <div className="flex-1 p-5 relative">
                <div className="absolute top-1/2 -right-7.5 transform -translate-y-1/2 w-0.5 h-3/4 bg-linear-to-b from-transparent via-white/20 to-transparent"></div>
                <img
                  src={stepData.image}
                  alt={stepData.step}
                  className="w-full rounded-2xl shadow-2xl border border-white/10 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
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
