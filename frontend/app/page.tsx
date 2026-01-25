"use client";
import { useState, ChangeEvent } from "react";
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
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch("https://iazishan-animal-detector-backend.hf.space", {
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

  return (
    // CHANGE 1: Background Gradient ko Purple se Deep Blue/Cyan kar diya
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 via-cyan-950 to-slate-950 text-white flex flex-col items-center justify-center p-4 relative">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {/* CHANGE 2: Upar wala bulb Purple se Cyan kar diya */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/30 rounded-full blur-3xl" />
        {/* CHANGE 3: Neeche wala bulb Blue ko thora aur gehra kar diya */}
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-700/20 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-lg flex flex-col items-center"
      >
        <div className="text-center mb-8">
          {/* CHANGE 4: Title ka color bhi Blue/Cyan gradient kar diya */}
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
            AI Vision
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Animal Detection System</p>
        </div>

        {/* --- Main Card --- */}
        <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          
          {/* Upload Area */}
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              // CHANGE 5: Upload box ka border color Cyan kar diya
              preview ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-gray-500 hover:border-cyan-400 hover:bg-white/5'
            }`}>
              
              {preview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-64 mx-auto rounded-lg shadow-lg object-contain" 
                  />
                  <p className="mt-4 text-sm text-cyan-300">Click to change image</p>
                </div>
              ) : (
                <div className="py-10">
                  {/* CHANGE 6: Icon ka background color Blue/Cyan kar diya */}
                  <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  </div>
                  <p className="text-lg font-medium text-gray-200">Upload an Image</p>
                  <p className="text-sm text-gray-400 mt-1">Supports JPG, PNG</p>
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
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : loading
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white animate-pulse"
                // CHANGE 7: Button ka gradient bhi Blue/Cyan/Pink kar diya
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
               className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center text-sm"
             >
               {error}
             </motion.div>
          )}
        </div>

        {/* --- Results Section (Animated) --- */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 w-full bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Prediction</p>
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 capitalize">
                    {result.predicted_class}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Confidence</p>
                  <p className="text-2xl font-mono font-bold text-white">{result.confidence}</p>
                </div>
              </div>

              {/* Progress Bars for Top 3 */}
              <div className="space-y-4">
                {result.top_3_predictions.map((item, index) => {
                  const width = parseFloat(item.probability.replace('%', ''));
                  return (
                    <div key={index} className="relative">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize font-medium text-gray-200">{item.animal}</span>
                        <span className="text-gray-400 font-mono">{item.probability}</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-2.5 rounded-full ${
                            // CHANGE 8: 2nd bar ka color purple se hatakar Cyan kr diya
                            index === 0 ? 'bg-gradient-to-r from-green-400 to-blue-500' :
                            index === 1 ? 'bg-cyan-500/70' : 
                            'bg-gray-500/50'
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

        {/* --- FOOTER: CREDIT SECTION --- */}
        <div className="mt-12 text-center opacity-70 hover:opacity-100 transition-opacity">
            <p className="text-sm text-gray-400">
                {/* CHANGE 9: Name color change */}
                Designed & Developed by <span className="text-cyan-400 font-semibold">Zishan</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
                Built with <span className="text-red-500">♡</span> by Marwat
            </p>
        </div>

      </motion.div>
    </div>
  );
}