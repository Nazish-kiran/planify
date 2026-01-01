"use client";
import React from "react";
import { motion } from "framer-motion";

const Marquee = () => {
  return (
    <div
      className="   rounded-2xl overflow-hidden relative py-13 mx-30 "

    >
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: "-100%" }}
        transition={{ ease: "linear", repeat: Infinity, duration: 14 }}
        className="flex gap-35"
      >
        {[
          "Early adopters are joining every day",
          "Be among the first to experience intelligent planning",
          "Launching soon — stay tuned!",
           "Early adopters are joining every day",
          "Be among the first to experience intelligent planning",
          "Launching soon — stay tuned!",
        ].map((elem, index) => {
          return (
            <span key={index} className="whitespace-nowrap">
             <span className="w-[10px] h-[10px] me-2 inline-block bg-[#15399A] rounded-full"></span> {" "}
              {elem}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Marquee;
