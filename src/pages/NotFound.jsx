import { Link } from "react-router-dom";
import { FaPlay, FaExclamationTriangle } from "react-icons/fa";
import { Helmet } from "react-helmet-async"; // Import Helmet

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden font-sans text-white perspective-1000">
      
      {/* 🚀 SEO Configuration for 404 Page */}
      <Helmet>
        <title>404 - Page Not Found | ZiloPlay</title>
        <meta name="description" content="The page you are looking for does not exist." />
        {/* Force the favicon just in case, though index.html usually handles it */}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Helmet>

      {/* ==================== LAYER 1: INFINITE GRID FLOOR (CGI) ==================== */}
      <div 
        className="absolute bottom-0 w-[200vw] h-[100vh] origin-bottom"
        style={{
          transform: 'rotateX(60deg) translateY(0)',
          background: `
            linear-gradient(rgba(220, 38, 38, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220, 38, 38, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 60%)',
          animation: 'gridMove 20s linear infinite',
        }}
      ></div>

      {/* ==================== LAYER 2: VOLUMETRIC FOG ==================== */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-transparent z-0"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[80vw] h-[50vw] bg-red-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>

      {/* ==================== LAYER 3: SCANLINE & NOISE ==================== */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>
      <div className="absolute top-0 w-full h-[5px] bg-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-scan pointer-events-none z-10"></div>


      {/* ==================== LAYER 4: CONTENT (UI) ==================== */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-6xl">
        
        {/* --- TITLE SECTION --- */}
        {/* Mobile: Flex-Col (Stacked) | Desktop: Flex-Row (Side by Side) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-4">
            
            {/* Left Icon (Visible on Mobile & Desktop) */}
            <div className="text-red-500 animate-bounce">
              <FaExclamationTriangle className="text-5xl md:text-7xl drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]" />
            </div>

            {/* MASSIVE 404 TITLE */}
            <h1 className="text-[100px] sm:text-[140px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-400 to-gray-900 drop-shadow-2xl select-none relative">
              404
              <span className="absolute inset-0 text-red-600 opacity-30 blur-sm animate-pulse" style={{ transform: 'translate(4px, 4px)' }} aria-hidden="true">
                404
              </span>
            </h1>

            {/* Right Icon (HIDDEN on Mobile, VISIBLE on Desktop) */}
            {/* This creates the "Both Sides" look on desktop */}
            <div className="text-red-500 animate-bounce hidden md:block">
              <FaExclamationTriangle className="text-7xl drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]" />
            </div>
        </div>

        {/* Divider Line */}
        <div className="h-1 w-24 sm:w-48 bg-red-600 rounded-full my-6 shadow-[0_0_15px_rgba(220,38,38,1)]"></div>

        {/* Cinematic Subtitle */}
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white mb-6 text-shadow-lg">
          System Breach: <span className="text-red-500">Page Missing</span>
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-sm sm:text-lg md:text-xl max-w-xs sm:max-w-lg md:max-w-2xl mb-10 font-medium leading-relaxed">
          The requested coordinate is outside the observable universe. 
          Initiate protocol <span className="text-white font-bold">RETURN_HOME</span> immediately.
        </p>

        {/* Primary Button */}
        <Link 
          to="/"
          className="group relative inline-flex items-center gap-3 px-10 py-4 bg-red-600 text-white font-bold text-lg md:text-xl rounded-lg overflow-hidden transition-transform transform hover:scale-105 shadow-[0_0_40px_rgba(220,38,38,0.4)]"
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          <FaPlay className="text-sm md:text-lg" />
          <span className="tracking-wider uppercase">Return to Base</span>
        </Link>

      </div>

      {/* ==================== CSS FOR ANIMATIONS ==================== */}
      <style>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>

    </div>
  );
}