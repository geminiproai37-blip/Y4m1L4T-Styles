import { tmdbApiKey } from "./config.js";

export async function fetchMediaDetails(apiBaseUrl, type, id) {
  try {
    let mainDetails = {};
    let episodeDetails = null;
    let episodeStills = [];
    const languagePriority = ["es-MX", "es-ES", "en"];

    // 1. Fetch main media details (series or movie)
    for (const lang of languagePriority) {
      const url = `${apiBaseUrl}/${type}/${id}?api_key=${tmdbApiKey}&language=${lang}`;
      const response = await fetch(url);
      if (response.ok) {
        mainDetails = await response.json();
        if (mainDetails.title || mainDetails.name || mainDetails.overview) {
          break;
        }
      }
    }
    if (!mainDetails.id) {
      // Fallback without language if no good data found
      const url = `${apiBaseUrl}/${type}/${id}?api_key=${tmdbApiKey}`;
      const response = await fetch(url);
      if (response.ok) {
        mainDetails = await response.json();
      }
    }

    if (!mainDetails.id) {
      console.warn(
        `Could not fetch main details for ${type} with ID ${id} in any language.`
      );
      return null; // Cannot proceed without main media details
    }

    // 2. Fetch main media images (logos, backdrops, posters)
    let mainImagesData = { logos: [], backdrops: [], posters: [] };
    try {
      const imagesUrl = `${apiBaseUrl}/${type}/${id}/images?api_key=${tmdbApiKey}&include_image_language=es-MX,es-ES,en,ja,null`;
      const imagesResponse = await fetch(imagesUrl);
      if (imagesResponse.ok) {
        mainImagesData = await imagesResponse.json();
      } else {
        console.warn(
          `No se pudieron obtener imágenes principales para ${type} con ID ${id}.`
        );
      }
    } catch (err) {
      console.warn(
        `Error al obtener imágenes principales de TMDB para ID ${id}:`,
        err
      );
    }

    // Select logo from main images
    let logoPath = null;
    if (mainImagesData.logos?.length > 0) {
      const priority = ["es-MX", "es-ES", "en", "ja", null];
      for (const lang of priority) {
        const logo = mainImagesData.logos.find((l) => l.iso_639_1 === lang);
        if (logo) {
          logoPath = logo.file_path;
          break;
        }
      }
      if (!logoPath && mainImagesData.logos.length > 0) {
        logoPath = mainImagesData.logos[0].file_path;
      }
    }

    const combinedDetails = { ...mainDetails, logo_path: logoPath };

    // Store the original series name if it's a TV show
    if (type === "tv") {
      combinedDetails.series_name = mainDetails.name;
    }

    // Ensure pageUrl is not present, as we are now using go:id
    if (combinedDetails.pageUrl) {
      delete combinedDetails.pageUrl;
    }

    return combinedDetails;
  } catch (error) {
    console.error(`Error fetching ${type} with ID ${id}:`, error);
    return null;
  }
}

export async function fetchMovieVideos(apiBaseUrl, movieId) {
  try {
    const url = `${apiBaseUrl}/movie/${movieId}/videos?api_key=${tmdbApiKey}&language=es-ES`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(`Error fetching videos for movie ID ${movieId}:`, error);
    return [];
  }
}

export async function fetchCast(apiBaseUrl, type, id) {
  try {
    let url;
    if (type === "movie") {
      url = `${apiBaseUrl}/movie/${id}/credits?api_key=${tmdbApiKey}&language=es-ES`;
    } else if (type === "tv") {
      url = `${apiBaseUrl}/tv/${id}/credits?api_key=${tmdbApiKey}&language=es-ES`;
    } else {
      throw new Error("Unsupported media type for fetching cast.");
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.cast || data.crew;
  } catch (error) {
    console.error(`Error fetching cast for ${type} with ID ${id}:`, error);
    return [];
  }
}

export async function fetchContentRatings(apiBaseUrl, movieId) {
  try {
    const url = `${apiBaseUrl}/movie/${movieId}/release_dates?api_key=${tmdbApiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Filter for release dates that have a certification
    const ratings = data.results.filter(
      (result) =>
        result.release_dates.length > 0 && result.release_dates[0].certification
    );
    // Map to a simpler array of { iso_3166_1, rating }
    return ratings.map((result) => ({
      iso_3166_1: result.iso_3166_1,
      rating: result.release_dates[0].certification,
    }));
  } catch (error) {
    console.error(
      `Error fetching content ratings for movie ID ${movieId}:`,
      error
    );
    return [];
  }
}
