import { useEffect, useState, useRef } from "react";
import { getUpcomingMovieTrailers, BG_BASE_URL } from "../services/api";
import {
  ChevronLeft,
  ChevronRight,
  SkipForward,
  Volume2,
  VolumeX,
  Film,
} from "lucide-react";

export default function Trailers() {
  const [trailers, setTrailers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isApiReady, setIsApiReady] = useState(false);
  const playerRef = useRef(null); // Ref for the player's mounting div
  const ytPlayer = useRef(null); // Ref for the YT.Player instance

  // --- (Logic hooks 1, 2, 3, 4 remain unchanged) ---

  // 1. Load trailers on mount
  useEffect(() => {
    async function loadTrailers() {
      const data = await getUpcomingMovieTrailers();
      setTrailers(data);
    }
    loadTrailers();
  }, []);

  // 2. Load the YouTube Iframe API script ONCE on mount
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };
    } else if (window.YT.Player) {
      setIsApiReady(true);
    }
  }, []);

  // 3. Create the player instance
  useEffect(() => {
    if (isApiReady && playerRef.current && trailers.length > 0 && !ytPlayer.current) {
      const firstVideoKey = trailers[currentIndex]?.videoKey;
      if (firstVideoKey) {
        ytPlayer.current = new window.YT.Player(playerRef.current, {
          videoId: firstVideoKey,
          playerVars: {
            autoplay: 1,
            mute: isMuted ? 1 : 0,
            controls: 1,
            vq: 'hd1080',
            enablejsapi: 1,
            rel: 0,
          },
          events: {
            onStateChange: (event) => {
              if (event.data === 0) handleNext(); // 0 = ended
              if (event.data === 1) { // 1 = playing
                setTimeout(() => setShowSkip(true), 12000);
              }
            },
            onReady: (event) => {
              if (isMuted) event.target.mute();
              else event.target.unMute();
            },
          },
        });
      }
    }
  }, [isApiReady, trailers, currentIndex]);

  // 4. Handle changing the video
  useEffect(() => {
    if (ytPlayer.current && ytPlayer.current.loadVideoById && trailers.length > 0) {
      const newVideoKey = trailers[currentIndex]?.videoKey;
      if (newVideoKey && ytPlayer.current.getVideoData()?.video_id !== newVideoKey) {
        ytPlayer.current.loadVideoById(newVideoKey);
        setShowSkip(false);
      }
    }
  }, [currentIndex, trailers]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % trailers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? trailers.length - 1 : prev - 1));
  };

  const toggleMute = () => {
    if (!ytPlayer.current) return;
    if (isMuted) {
      ytPlayer.current.unMute();
    } else {
      ytPlayer.current.mute();
    }
    setIsMuted(!isMuted);
  };

  // Loading State
  if (trailers.length === 0) {
    return (
      <section className="w-full h-[75vh] flex flex-col items-center justify-center bg-black text-white">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Film className="w-6 h-6 text-red-500" /> Upcoming Movie Trailers
        </h2>
        <div className="animate-pulse flex flex-col items-center gap-5 w-full">
          <div className="w-[90%] md:w-[70%] lg:w-[60%] aspect-video bg-gray-800 rounded-2xl shadow-lg"></div>
        </div>
      </section>
    );
  }

  const current = trailers[currentIndex];
  if (!current) {
    return (
      <section className="w-full h-[75vh] flex items-center justify-center bg-black text-white">
        <p>No upcoming trailers available at the moment.</p>
      </section>
    );
  }

  return (
    // Removed overflow-hidden
<section className="relative w-full overflow-hidden flex flex-col items-center pt-24 pb-8 text-white">
      {/* BACKDROP IMAGE */}
      <img
        src={`${BG_BASE_URL}${current.backdrop}`}
        alt={current.title}
        className="absolute inset-0 w-full h-full object-cover blur-lg brightness-[0.45] scale-110"
        loading="lazy"
      />

      {/* DARK GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />

      {/* HEADING - Stays 'absolute' */}
      <h2 className="absolute top-8 left-8 md:top-10 md:left-16 text-xl md:text-3xl font-bold z-30 flex items-center gap-2">
        Upcoming Movie Trailers
      </h2>

      {/* Main layout wrapper */}
      <div className="relative z-20 w-[90%] md:w-[70%] lg:w-[60%]">
        {/* PREV BUTTON (Desktop Only) - FIX #1 */}
        <button
          onClick={handlePrev}
          className="hidden md:block absolute -left-4 sm:-left-8 md:-left-12 lg:-left-14 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/80 text-white p-2 md:p-3 rounded-full transition backdrop-blur-md"
        >
          <ChevronLeft size={26} />
        </button>

        {/* NEXT BUTTON (Desktop Only) - FIX #1 */}
        <button
          onClick={handleNext}
          className="hidden md:block absolute -right-4 sm:-right-8 md:-right-12 lg:-right-14 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/80 text-white p-2 md:p-3 rounded-full transition backdrop-blur-md"
        >
          <ChevronRight size={26} />
        </button>

        {/* TRAILER PLAYER CONTAINER */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.8)] border border-gray-700/40">
          <div ref={playerRef} className="w-full h-full" />
        </div>

        {/* MOVIE INFO + CONTROLS */}
        <div className="z-20 mt-4 text-center">
          {/* Info */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-x-3 gap-y-1">
            <h3 className="text-2xl md:text-3xl font-bold">{current.title}</h3>
            {/* "KNOW MORE" LINK (Styled) - FIX #2 */}
            {current.id && (
              <a
                href={`/watch/movie/${current.id}`}
                className="text-blue-400 hover:text-blue-300 font-medium text-sm md:text-base underline underline-offset-4 transition"
              >
                Know More →
              </a>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">Official Trailer</p>

          {/* CONTROLS (Mute/Skip) */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={toggleMute}
              className="bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-sm transition"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            {showSkip && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-medium transition"
              >
                <SkipForward size={16} />
                Skip
              </button>
            )}
          </div>
        </div>

        {/* MOBILE NAVIGATION ROW (Mobile Only) - FIX #1 */}
        <div className="flex md:hidden items-center justify-center gap-4 z-20 mt-6">
          {/* Mobile Prev Button */}
          <button
            onClick={handlePrev}
            className="bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2.5">
            {trailers.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                  i === currentIndex ? "bg-white scale-110" : "bg-gray-500/50 hover:bg-gray-400/80"
                }`}
              ></div>
            ))}
          </div>

          {/* Mobile Next Button */}
          <button
            onClick={handleNext}
            className="bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* DESKTOP-ONLY SLIDE INDICATORS - FIX #1 */}
        <div className="hidden md:flex justify-center gap-2.5 z-20 mt-6">
          {trailers.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                i === currentIndex ? "bg-white scale-110" : "bg-gray-500/50 hover:bg-gray-400/80"
              }`}
            ></div>
          ))}
        </div>

      </div>
      {/* === End of layout wrapper === */}
    </section>
  );
}