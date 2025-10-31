    import { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { BG_BASE_URL, IMG_BASE_URL } from '../services/api';

    export default function Hero({ items = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const heroItems = items.slice(0, 10);

    useEffect(() => {
        if (heroItems.length === 0) return;
        const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heroItems.length);
        }, 7000);
        return () => clearTimeout(timer);
    }, [currentIndex, heroItems.length]);

    if (heroItems.length === 0) {
        return null;
    }

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    return (
        // ✅ FIX: Removed the "-mt-[88px]" class from this line
        <div className="relative h-[80vh] w-full text-white">
        {/* Slides Container */}
        {heroItems.map((item, index) => (
            <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0'
            }`}
            >
            {/* Backdrop Image with Gradient Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-top"
                style={{
                backgroundImage: `url('${BG_BASE_URL}${item.backdrop_path}')`,
                }}
            />
            <div className="absolute inset-0 bg-black/60 bg-gradient-to-r from-black via-black/40 to-transparent" />

            {/* Slide Content */}
            <div className="relative z-20 flex h-full items-center p-8 md:p-16">
                <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto">
                {/* Poster Image */}
                <img
                    src={`${IMG_BASE_URL}${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-48 md:w-64 rounded-lg shadow-2xl flex-shrink-0"
                />
                {/* Details */}
                <div className="md:w-2/3 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {item.title || item.name}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-gray-300 mb-4">
                    <span>{new Date(item.release_date || item.first_air_date).getFullYear()}</span>
                    <span>⭐ {item.vote_average.toFixed(1)} / 10</span>
                    </div>
                    <p className="text-sm md:text-base line-clamp-3 mb-6">
                    {item.overview}
                    </p>
                    <Link
                    to={`/watch/movie/${item.id}`}
                    className="inline-block bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors"
                    >
                    ▶ Watch Now
                    </Link>
                </div>
                </div>
            </div>
            </div>
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroItems.map((_, index) => (
            <button
                key={index}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
            />
            ))}
        </div>
        </div>
    );
    }