import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // 👈 New Import: Needed for navigation

/* ----------------------------------
    30 Company IDs
------------------------------------ */
const COMPANY_IDS = [
  1, 2, 3, 5, 7, 4, 174, 33, 420, 25,
  521, 1632, 12, 34, 21, 9993, 41077,
  923, 10342, 2251, 6704, 11461, 3172,
  56, 10146, 79, 508, 9996, 21342, 20580
];

// Your proxy API
const API_BASE = "https://tmbd-wz5v.onrender.com/company/";

/* ----------------------------------
    Injected Dark Mode + Glow Styles
------------------------------------ */
const MovieCompanySliderStyles = () => (
<style>{`
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    /* Updated Container with Soft Gradient Glow (Fixes PNG visibility) */
    .company-slider-container {
      width: 100%;
      background: radial-gradient(
          circle at center,
          rgba(255, 255, 255, 0.10) 0%,
          rgba(255, 255, 255, 0.03) 40%,
          rgba(0, 0, 0, 0) 100%
      );
      /* Use a dark fallback for browsers that don't support backdrop-filter well */
      background-color: #0d0d0d;
      backdrop-filter: blur(6px);

      border-top: 1px solid rgba(255,255,255,0.06);
      border-bottom: 1px solid rgba(255,255,255,0.06);

      padding: 22px 0; /* Slightly more vertical padding */
      overflow: hidden;
      white-space: nowrap;
      box-sizing: border-box;
      position: relative;
    }

    /* Optional Enhancement: Adds a subtle horizontal blur behind the logos */
    .company-slider-container::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to right,
        rgba(255,255,255,0.03),
        rgba(255,255,255,0.08),
        rgba(255,255,255,0.03)
      );
      filter: blur(12px);
      z-index: 0;
    }
    
    .company-slider-track {
      display: inline-block;
      animation: scroll 60s linear infinite;
      white-space: nowrap;
      position: relative; /* Set z-index 5 for track to be above the ::before pseudo-element */
      z-index: 5;
    }

    .company-slider-container:hover .company-slider-track {
      animation-play-state: paused;
    }

    .company-slide {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 4%;
      height: 50px;
      margin: 0 28px;
    }

    /* Updated Image Styles: Brighter and no grayscale by default */
    .company-slide img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      filter: brightness(1.3) grayscale(0); /* Increased brightness to ensure visibility on dark/glow BG */
      opacity: 0.9;
      transition: 0.3s ease;
    }

    /* Neon glow on hover: Enhanced glow and scale */
    .company-slide:hover img {
      opacity: 1;
      transform: scale(1.12); /* Slightly larger scale */
      filter: brightness(1.6) drop-shadow(0 0 8px rgba(0,255,255,0.4)); /* Blue neon effect */
    }

    @media (max-width: 768px) {
      .company-slide {
        width: 50px;
        height: 40px;
        margin: 0 16px;
      }
    }
  `}</style>
);

/* ----------------------------------
      Main Component
------------------------------------ */
const MovieCompanySlider = () => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const results = await Promise.all(
          COMPANY_IDS.map(id =>
            fetch(API_BASE + id)
              .then(res => res.json())
              .catch(() => null)
          )
        );

        const valid = results.filter(r => r && r.logo_path);

        // TMDB logo base url
        const TMDB_IMG = "https://image.tmdb.org/t/p/w200";

        // Build array of logos (CRITICAL: now saving the ID) 👈
        const companyLogos = valid.map(item => ({
          id: item.id,      // 👈 Added company ID for routing
          name: item.name,
          logo: TMDB_IMG + item.logo_path
        }));

        // Duplicate for infinite scroll
        setLogos([...companyLogos, ...companyLogos]);
      } catch (err) {
        console.error("Error loading companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    // Retain min-height placeholder while loading
    return <div className="company-slider-container" style={{ minHeight: "94px", backgroundColor: "#0d0d0d", border: "1px solid #222" }} />;
  }

  return (
    <>
      <MovieCompanySliderStyles />

      <div className="company-slider-container">
        <div className="company-slider-track">
          {logos.map((item, index) => (
            // Using Link from react-router-dom to navigate on click 👈
            <Link to={`/company/${item.id}`} key={index}>
              <div className="company-slide" title={item.name}>
                <img src={item.logo} alt={item.name} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MovieCompanySlider;