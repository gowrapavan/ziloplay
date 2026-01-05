import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Player from "../components/Player";
import MediaRow from "../components/MediaRow";
import { Helmet } from "react-helmet-async";  
import EpisodeSelector from "../components/EpisodeSelector"; 
import { getMediaDetails, IMG_BASE_URL, BG_BASE_URL, PROFILE_IMG_BASE_URL } from "../services/api";
import { getAnimeDetails, getAnimeRecommendations } from "../services/jikan";

// --- Helper Components ---

const GenreBadge = ({ genre }) => (
  <span className="border-2 border-gray-600 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">
    {genre.name}
  </span>
);

const DetailItem = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between border-b border-gray-700 py-2 text-sm">
      <span className="font-semibold text-gray-400">{label}</span>
      <span className="text-gray-200 text-right">{value}</span>
    </div>
  );
};

const PersonCard = ({ person }) => {
  const profilePath = person.profile_path
    ? `${PROFILE_IMG_BASE_URL}${person.profile_path}`
    : 'https://placehold.co/185x278/1f2937/9ca3af?text=No+Photo';

  const role = person.character || person.job;

  return (
    <Link
      to={`/actor/${person.id}`}
      className="flex flex-col items-center text-center group transition-transform duration-300 hover:scale-110"
    >
      <div className="relative">
        <img
          src={profilePath}
          alt={person.name}
          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-gray-700 group-hover:border-red-500 transition-colors shadow-lg"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/185x278/1f2937/9ca3af?text=No+Photo';
          }}
        />
      </div>

      <p
        className="text-white text-sm font-semibold mt-2 truncate w-full px-1 group-hover:text-red-400 transition-colors"
        title={person.name}
      >
        {person.name}
      </p>

      {role && (
        <p
          className="text-gray-400 text-xs truncate w-full px-1"
          title={role}
        >
          {role}
        </p>
      )}
    </Link>
  );
};

const WatchProviders = ({ providers, region = "US" }) => {
  const data = providers?.results?.[region];

  if (!data) {
    return (
      <div className="bg-gray-900/50 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">No watch providers found for your region.</p>
      </div>
    );
  }

  const renderProviderList = (list) => (
    <div className="flex flex-wrap gap-2">
      {list.map((provider) => (
        <img
          key={provider.provider_id}
          src={`${IMG_BASE_URL}${provider.logo_path}`}
          alt={provider.provider_name}
          title={provider.provider_name}
          className="w-10 h-10 rounded-lg object-cover"
        />
      ))}
    </div>
  );

  return (
    <div className="bg-gray-900/50 p-4 rounded-lg space-y-4">
      {data.flatrate && data.flatrate.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-300 mb-2">Stream</h4>
          {renderProviderList(data.flatrate)}
        </div>
      )}
      {data.rent && data.rent.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-300 mb-2">Rent</h4>
          {renderProviderList(data.rent)}
        </div>
      )}
      {data.buy && data.buy.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-300 mb-2">Buy</h4>
          {renderProviderList(data.buy)}
        </div>
      )}
      {data.link && (
        <a
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline text-sm block mt-2"
        >
          View all providers
        </a>
      )}
    </div>
  );
};

const ImageModal = ({ src, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
    onClick={onClose}
  >
    <button
      className="absolute top-4 right-4 text-white text-3xl font-bold"
      onClick={onClose}
    >
      &times;
    </button>
    <img
      src={src}
      alt="Full-size media backdrop or poster"
      className="max-w-[90vw] max-h-[90vh] object-contain"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
);

const MediaGallery = ({ backdrops, posters, onImageClick }) => (
  <section>
    <h2 className="text-2xl font-semibold mb-4">Media Gallery</h2>
    {backdrops?.length > 0 && (
      <>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Backdrops</h3>
        <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
          {backdrops.map((img, index) => (
            <img
              key={`backdrop-${index}`}
              src={`${IMG_BASE_URL}${img.file_path}`}
              alt={`Backdrop ${index + 1}`}
              className="h-28 md:h-36 rounded-lg cursor-pointer transition-transform hover:scale-105"
              onClick={() => onImageClick(`${BG_BASE_URL}${img.file_path}`)}
            />
          ))}
        </div>
      </>
    )}
    {posters?.length > 0 && (
      <>
        <h3 className="text-lg font-semibold text-gray-300 mt-4 mb-2">Posters</h3>
        <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
          {posters.map((img, index) => (
            <img
              key={`poster-${index}`}
              src={`${IMG_BASE_URL}${img.file_path}`}
              alt={`Poster ${index + 1}`}
              className="h-40 md:h-48 rounded-lg cursor-pointer transition-transform hover:scale-105"
              onClick={() => onImageClick(`${BG_BASE_URL}${img.file_path}`)}
            />
          ))}
        </div>
      </>
    )}
  </section>
);

const VideoSlideshow = ({ videos }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    setCurrentVideoIndex(0);
  }, [videos]);

  if (!videos || videos.length === 0) {
    return null;
  }

  const currentVideo = videos[currentVideoIndex];

  const getEmbedUrl = (video) => {
    if (video.site === "YouTube") {
      return `https://www.youtube.com/embed/${video.key}?autoplay=1&controls=0&modestbranding=1&rel=0&mute=1`;
    } else if (video.site === "Vimeo") {
      return `https://player.vimeo.com/video/${video.key}?autoplay=1&muted=1`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(currentVideo);

  const handleNext = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Clips & Featurettes</h2>
      <div className="relative pb-[56.25%] h-0 rounded-none md:rounded-xl overflow-hidden shadow-lg bg-gray-900">
        {embedUrl ? (
          <iframe
            key={currentVideo.key}
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={currentVideo.name}
          ></iframe>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Video not available for embedding.
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          disabled={videos.length <= 1}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={videos.length <= 1}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </section>
  );
};

const TruncatedText = ({ text, limit = 200 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return null;
  }

  if (text.length <= limit) {
    return <p className="text-gray-300 max-w-2xl mx-auto md:mx-0">{text}</p>;
  }

  return (
    <div>
      <p className="text-gray-300 max-w-2xl mx-auto md:mx-0">
        {isExpanded ? text : `${text.substring(0, limit)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-red-500 hover:text-red-400 font-semibold text-sm mt-2"
      >
        {isExpanded ? "View Less" : "View More"}
      </button>
    </div>
  );
};

// --- Main Watch Component ---

export default function Watch() {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImageSrc, setModalImageSrc] = useState(null);

  // New state for TV Tracking (Season/Episode)
  const [activeSeason, setActiveSeason] = useState(1);
  const [activeEpisode, setActiveEpisode] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMedia(null);
    setLoading(true);
    
    // Reset selection for new series
    setActiveSeason(1);
    setActiveEpisode(1);

    async function load() {
      try {
        let data, recs = [];
        if (mediaType === 'movie' || mediaType === 'tv') {
          data = await getMediaDetails(mediaType, id);
          recs = data.recommendations?.results || [];
        } else if (mediaType === 'anime') {
          data = await getAnimeDetails(id);
          recs = await getAnimeRecommendations(id);
        } else {
          navigate('/');
        }
        setMedia(data);
        setRecommendations(recs);
      } catch (error) {
        console.error("Failed to load media:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, mediaType, navigate]);

  const handleEpisodeSelect = (season, episode) => {
    setActiveSeason(season);
    setActiveEpisode(episode);
    // Smooth scroll to player when an episode is selected
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const title = media?.title || media?.name;


  const posterPath = media?.images?.posters?.[0]?.file_path || media?.poster_path;
  const backdropPath = media?.images?.backdrops?.[0]?.file_path || media?.backdrop_path;
  const releaseDate = media?.release_date || media?.first_air_date || media?.aired?.from;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const runtime = media?.runtime ? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}m` : (media?.duration || 'N/A');

  const trailer = media?.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");
  const otherVideos = media?.videos?.results?.filter(v => v.id !== trailer?.id) || [];

  const providers = media ? media["watch/providers"] : null;
  const cast = media?.credits?.cast?.slice(0, 10);
  const crew = media?.credits?.crew?.filter(c => ['Director', 'Writer', 'Producer'].includes(c.job)).slice(0, 5);

  return (
    <>
      {modalImageSrc && <ImageModal src={modalImageSrc} onClose={() => setModalImageSrc(null)} />}

      {loading ? (
        <Loader />
      ) : !media ? (
        <p className="text-center text-red-500 pt-28">Failed to load media data. Please try again later.</p>
      ) : (
        <div>
          {/* ✅ ADD THIS BLOCK */}
          <Helmet>
            <title>
              {mediaType === 'tv' 
                ? `Watch ${title} S${activeSeason}:E${activeEpisode} - ZiloPlay`
                : `Watch ${title} (${releaseYear}) - ZiloPlay`}
            </title>
            <meta name="description" content={media.overview?.substring(0, 160) || `Stream ${title} online.`} />
            
            {/* Social Media Cards */}
            {/* Force Large Landscape Image for Twitter/X & Discord */}
              <meta name="twitter:card" content="summary_large_image" />
              
              {/* Standard Open Graph Tags */}
              <meta property="og:title" content={`Watch ${title} on ZiloPlay`} />
              <meta property="og:description" content={media.overview || "Watch now in HD."} />
              
              {/* Use the Backdrop (Landscape) instead of Poster (Portrait) if available */}
              <meta property="og:image" content={`${IMG_BASE_URL}${backdropPath || posterPath}`} />
              <meta property="og:image:width" content="1200" />
              <meta property="og:image:height" content="630" />
              {/* Inside <Helmet> ... */}
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": mediaType === 'tv' ? "TVSeries" : "Movie",
                  "name": title,
                  "image": `${IMG_BASE_URL}${posterPath}`,
                  "description": media.overview,
                  "datePublished": releaseDate,
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": media.vote_average,
                    "bestRating": "10",
                    "ratingCount": media.vote_count
                  },
                  "genre": media.genres?.map(g => g.name)
                })}
              </script>
          </Helmet>
          <div className="relative h-[40vh] md:h-[60vh] bg-cover bg-top" style={{ backgroundImage: `url('${BG_BASE_URL}${backdropPath}')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/50 to-transparent"></div>
          </div>

          <div className="px-5 md:px-8 max-w-7xl mx-auto -mt-32 md:-mt-80 relative z-10 pb-20 text-white">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <img
                src={`${IMG_BASE_URL}${posterPath}`}
                alt={title}
                className="w-48 md:w-72 rounded-lg shadow-2xl flex-shrink-0 object-cover border border-white/10"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/500x750/1f2937/9ca3af?text=No+Image'; }}
              />
              <div className="flex-1 text-center md:text-left pt-0 md:pt-16">
                <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>
                <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400 my-3 font-medium">
                  <span>{releaseYear}</span>
                  {media.vote_average > 0 && <span>{media.vote_average.toFixed(1)} / 10</span>}
                  <span>{runtime}</span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 my-4">
                  {media.genres?.map((g) => <GenreBadge key={g.id || g.mal_id} genre={g} />)}
                </div>
                <TruncatedText text={media.overview || media.synopsis} limit={200} />
              </div>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">
                {/* ===== LEFT COLUMN (Span 2) ===== */}
                <div className="lg:col-span-2 space-y-12">
                  {/* 1. Stream Player */}
                  <section className="-mx-5 md:mx-0">
                    <h2 className="text-2xl font-semibold mb-6 text-red-500 px-5 md:px-0 uppercase tracking-wide">Watch Now</h2>
                    
                    <div className="rounded-none md:rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                      {(mediaType === 'movie' || mediaType === 'tv') ? (
                        <Player 
                          media={media} 
                          mediaType={mediaType}
                          season={activeSeason}
                          episode={activeEpisode}
                        />
                      ) : (
                        <p className="text-gray-400 p-5 md:p-0">Anime player coming soon!</p>
                      )}
                    </div>
                  </section>

                  {/* 2. Clips & Featurettes */}
                  {otherVideos.length > 0 && (
                    <div className="-mx-5 md:mx-0">
                      <div className="px-5 md:px-0">
                        <VideoSlideshow videos={otherVideos} />
                      </div>
                    </div>
                  )}
                </div>

                {/* ===== RIGHT COLUMN (Span 1) ===== */}
                <div className="space-y-12">
                  {/* 1. Trailer */}
                  {trailer && (
                    <section className="-mx-5 md:mx-0">
                      <h2 className="text-2xl font-semibold mb-6 px-5 md:px-0 uppercase tracking-wide">Official Trailer</h2>
                      <div className="relative pb-[56.25%] h-0 rounded-none md:rounded-xl overflow-hidden shadow-lg border border-white/5">
                        <iframe
                          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0&controls=1&modestbranding=1&rel=0`}
                          className="absolute top-0 left-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Official Trailer"
                        ></iframe>
                      </div>
                    </section>
                  )}

                  {/* 2. Details */}
                  <section>
                    <h2 className="text-2xl font-semibold mb-6 uppercase tracking-wide">Details</h2>
                    <div className="bg-gray-900/40 backdrop-blur-sm p-5 rounded-xl space-y-2 border border-white/5 shadow-inner">
                      <DetailItem label="Status" value={media.status} />
                      <DetailItem label="Release Date" value={releaseDate?.split('T')[0]} />
                      {mediaType === 'tv' && <DetailItem label="Seasons" value={media.number_of_seasons} />}
                      {mediaType === 'tv' && <DetailItem label="Episodes" value={media.number_of_episodes} />}
                      <DetailItem label="Original Language" value={media.original_language?.toUpperCase()} />
                    </div>
                  </section>

                  {/* 3. Where to Watch */}
                  {providers && (
                    <section>
                      <h2 className="text-2xl font-semibold mb-6 uppercase tracking-wide">Where to Watch</h2>
                      <WatchProviders providers={providers} />
                    </section>
                  )}
                </div>
              </div>

              {/* ===== FULL WIDTH SECTIONS (Below Grid) ===== */}
              <div className="mt-16 space-y-16">
                {/* 1. Cast */}
                {cast && cast.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-semibold mb-6 uppercase tracking-wide">Top Cast</h2>
                    <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide">
                      {cast.map(person => (
                        <div key={person.credit_id} className="flex-shrink-0 w-24">
                          <PersonCard person={person} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 2. Crew */}
                {crew && crew.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-semibold mb-6 uppercase tracking-wide">Key Crew</h2>
                    <div className="flex flex-wrap gap-x-8 gap-y-6">
                      {crew.map(person => (
                        <div key={person.credit_id} className="flex-shrink-0 w-32 md:w-40">
                          <PersonCard person={person} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 3. Media Gallery */}
                {(media.images?.backdrops?.length > 0 || media.images?.posters?.length > 0) && (
                  <MediaGallery
                    backdrops={media.images.backdrops}
                    posters={media.images.posters}
                    onImageClick={setModalImageSrc}
                  />
                )}

                {/* 4. Recommendations */}
                {recommendations?.length > 0 && (
                  <section>
                    <div className="h-px bg-white/5 w-full mb-12" />
                    <MediaRow title="Recommendations" items={recommendations} mediaType={mediaType} />
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}