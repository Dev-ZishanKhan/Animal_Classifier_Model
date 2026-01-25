"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface TopPrediction {
  animal: string;
  probability: string;
}

interface PredictionResult {
  predicted_class: string;
  confidence: string;
  top_3_predictions: TopPrediction[];
}

export default function Home() {
  // --- States ---
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Theme State (Default: System Theme)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Check system theme preference on mount
  useEffect(() => {
    setIsMounted(true);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://iazishan-animal-detector-backend.hf.space/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Backend connection failed");

      const data: PredictionResult = await response.json();
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 800);
      
    } catch (err) {
      console.error(err);
      setError("Server Error: Make sure backend is running!");
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen transition-all duration-500 flex flex-col items-center justify-center p-4 relative
        ${isDarkMode 
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white" 
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-800"
        }`}
    >
      
      {/* --- Theme Toggle Button --- */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 z-50 border backdrop-blur-md
          ${isDarkMode 
            ? "bg-slate-800/50 text-yellow-300 border-slate-700/50 hover:bg-slate-700/50" 
            : "bg-white/70 text-amber-500 border-slate-200/50 hover:bg-white/90"
          }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDarkMode ? "moon" : "sun"}
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full blur-3xl transition-opacity duration-500
          ${isDarkMode ? "bg-blue-600/20 opacity-100" : "bg-blue-400/15 opacity-100"}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full blur-3xl transition-opacity duration-500
          ${isDarkMode ? "bg-cyan-700/20 opacity-100" : "bg-indigo-400/15 opacity-100"}`} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-lg flex flex-col items-center"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
            AI Vision
          </h1>
          <p className={`text-sm tracking-widest uppercase font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Animal Detection System
          </p>
        </div>

        {/* --- Main Card --- */}
        <div className={`w-full p-8 rounded-3xl relative overflow-hidden transition-all duration-500 border backdrop-blur-lg
          ${isDarkMode 
            ? "bg-slate-900/40 border-slate-700/50 shadow-2xl" 
            : "bg-white/80 border-slate-200/50 shadow-xl"
          }`}>
          
          {/* Upload Area */}
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
              ${preview 
                ? (isDarkMode ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-blue-500/50 bg-blue-50/50') 
                : (isDarkMode 
                    ? 'border-slate-600/50 hover:border-cyan-400/50 hover:bg-slate-800/20' 
                    : 'border-slate-300/50 hover:border-blue-400/50 hover:bg-slate-100/50')
              }`}>
              
              {preview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-64 mx-auto rounded-lg shadow-md object-contain" 
                  />
                  <p className="mt-4 text-sm text-cyan-400 font-semibold">Click to change image</p>
                </div>
              ) : (
                <div className="py-10">
                  <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  </div>
                  <p className={`text-lg font-bold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                    Upload an Image
                  </p>
                  <p className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Supports JPG, PNG
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg tracking-wide shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
              !file
                ? (isDarkMode ? "bg-slate-700/50 text-slate-500 cursor-not-allowed" : "bg-slate-200/50 text-slate-400 cursor-not-allowed")
                : loading
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse"
                : "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white hover:shadow-cyan-500/50"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Analyzing...
              </span>
            ) : "Identify Animal"}
          </button>

          {/* Error Message */}
          {error && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className={`mt-4 p-3 border rounded-lg text-center text-sm font-medium
                 ${isDarkMode 
                   ? "bg-red-500/20 border-red-500/50 text-red-200" 
                   : "bg-red-50/80 border-red-200/50 text-red-600"}`}
             >
               {error}
             </motion.div>
          )}
        </div>

        {/* --- Results Section --- */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-6 w-full p-6 rounded-3xl shadow-2xl border transition-all duration-500 backdrop-blur-lg
                ${isDarkMode 
                  ? "bg-slate-900/40 border-slate-700/50" 
                  : "bg-white/80 border-slate-200/50"
                }`}
            >
              <div className={`flex items-center justify-between mb-6 border-b pb-4
                 ${isDarkMode ? "border-slate-700/50" : "border-slate-200/50"}`}>
                <div>
                  <p className={`text-xs uppercase tracking-wider font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    Prediction
                  </p>
                  <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 capitalize">
                    {result.predicted_class}
                  </h2>
                </div>
                <div className="text-right">
                  <p className={`text-xs uppercase tracking-wider font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    Confidence
                  </p>
                  <p className={`text-2xl font-mono font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                    {result.confidence}
                  </p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                {result.top_3_predictions.map((item, index) => {
                  const width = parseFloat(item.probability.replace('%', ''));
                  return (
                    <div key={index} className="relative">
                      <div className="flex justify-between text-sm mb-1">
                        <span className={`capitalize font-bold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                          {item.animal}
                        </span>
                        <span className={`font-mono font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                          {item.probability}
                        </span>
                      </div>
                      
                      {/* Background Bar */}
                      <div className={`w-full rounded-full h-2.5 overflow-hidden ${isDarkMode ? "bg-slate-700/50" : "bg-slate-200/50"}`}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-2.5 rounded-full ${
                            index === 0 ? 'bg-gradient-to-r from-green-400 to-cyan-500' :
                            index === 1 ? 'bg-cyan-500' : 
                            (isDarkMode ? 'bg-slate-500' : 'bg-slate-400')
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- FOOTER --- */}
        <div className="mt-12 text-center opacity-70 hover:opacity-100 transition-opacity">
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Designed & Developed by <span className="text-cyan-400 font-bold">Zishan</span>
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                Built with <span className="text-red-500">♡</span> by Marwat
            </p>
        </div>

      </motion.div>
    </div>
  );
}