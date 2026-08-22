"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaGlobe } from "react-icons/fa";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center mb-8">
              <FaGlobe className="text-brand text-4xl" />
            </div>
            
            <h1 className="font-serif font-bold text-brand leading-none tracking-tighter mb-4" style={{ fontSize: 'clamp(6rem, 15vw + 1rem, 11.25rem)' }}>
              404
            </h1>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand mb-6">
              Page Not Found
            </h2>
            
            <p className="text-lg text-brown-dark/70 mb-10 max-w-lg mx-auto leading-relaxed">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let&apos;s get you back on track.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/"
                className="px-8 py-3.5 bg-brand text-white text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-brand-light transition-colors duration-200 flex items-center group w-full sm:w-auto justify-center border border-gold/40"
              >
                Back to Home
                <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/contact"
                className="px-8 py-3.5 border border-brand/20 text-brand text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-brand/5 transition-colors duration-200 w-full sm:w-auto text-center"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
