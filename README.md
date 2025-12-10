# 🍿 Ziloplay: Modern Media Streaming Platform

**Ziloplay** is a sophisticated Single Page Application (SPA) designed for discovering, detailing, and simulating the streaming experience of movies, TV shows, and anime. Built using the modern React ecosystem, this project showcases advanced asynchronous data fetching, concurrent API design, and intuitive routing to provide a comprehensive media consumption experience.

## ✨ Features

* **Custom Watch Player:** Provides a multi-server streaming experience on the media detail page. The `ServerButtons` component allows users to dynamically switch between several external streaming providers (e.g., Videasy, VidKing) using both TMDB and IMDb IDs.
* **API Proxy Architecture:** All communication with the TMDB API is routed through a centralized proxy server (`https://tmbd-wz5v.onrender.com`), abstracting the API key and ensuring client-side security.
* **Concurrent Details Fetching:** The core `getMediaDetails` function for movies utilizes `Promise.all` to concurrently fetch details, videos, recommendations, credits, images, and watch providers, drastically reducing load times.
* **Advanced Trailer Curation:** The specialized `Trailers` component displays upcoming movie trailers using the **YouTube Iframe API**, featuring autoplay, mute controls, and logic for dynamically loading the next video and showing a "Skip" button.
* **Deep Studio/Company Dive:** Dedicated routing (`/company/:companyId`) and API logic allow users to view the full, paginated filmography (Movies and TV Shows) produced by a specific company (`CompanyDetailsPage.jsx`).
* **Comprehensive Search:** The `Search.jsx` page supports multi-search and allows filtering results by "All," "Movies," or "TV Shows" with an adaptive, modern UI.

## 🛠️ Tech Stack

| Technology | Category | Purpose |
| :--- | :--- | :--- |
| **React** | Frontend Core | UI development and component logic. |
| **Vite** | Build Tooling | Fast development environment and optimized production builds. |
| **React Router v6** | Routing | Declarative routing, including dynamic paths (`/watch/:mediaType/:id`). |
| **TMDB (The Movie DB)** | Data Source | Metadata, images, cast/crew, and watch provider data. |
| **Custom Proxy Server** | Data Layer | Securing the TMDB API key and centralizing fetch logic. |
| **YouTube Iframe API** | Media Playback | Handling embedded, interactive trailer playback. |

## 🚀 Getting Started

Follow these instructions to set up and run the Ziloplay project locally.

### 1. Prerequisites

Ensure you have Node.js (which includes npm) installed on your system.

### 2. Clone the Repository
```
git clone <repository-url> cd ziloplay
```

### 3. Install Dependencies
```
npm install
```
or
```
yarn install
```

### 4. API Configuration

This application relies on a functional external API proxy:

* **Base URL:** The application is configured to use `const TMDB_BASE_URL = "https://tmbd-wz5v.onrender.com";`.
* **Local Setup:** If you are running the companion proxy server locally, update this URL in `src/services/api.js` to point to your local backend endpoint (e.g., `"http://localhost:3000"`).

### 5. Run the Development Server
```
npm run dev
```
or
```
yarn dev
```

The application will start and be available in your browser at `http://localhost:5173` (or similar port).
