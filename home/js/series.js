// This script will handle the dynamic content for the series section.

// Keep track of series posters that have already been loaded across page views.
const loadedSeriesIds = new Set();

// Expose a function to initialize the series page content
window.initSeriesPageContent = (
  appMainContentElement, // Changed to appMainContentElement
  allMediaDetails,
  imageBaseUrl
) => {
  console.log("initSeriesPageContent called.");
  console.log("appMainContentElement:", appMainContentElement);
  console.log("allMediaDetails (passed):", allMediaDetails);

  // Append the main content structure from the template first
  const mainContent = document.createElement("main");
  mainContent.id = "main-content";
  mainContent.className = "pt-4"; // Added padding-top to create space below sticky header/category filter
  mainContent.innerHTML = document.getElementById("series-template").innerHTML;

  // Filter for 'tv' type from allMediaDetails
  const seriesOnlyData = allMediaDetails.filter((item) => item.type === "tv");
  console.log("seriesOnlyData (filtered TV shows):", seriesOnlyData);
  console.log("Number of series found:", seriesOnlyData.length); // Added log

  // Extract unique categories from seriesOnlyData
  const uniqueCategories = new Set();
  seriesOnlyData.forEach((item) => {
    if (item.categoria) {
      item.categoria.forEach((cat) => {
        if (cat !== "series") {
          // Exclude the generic "series" category
          uniqueCategories.add(cat);
        }
      });
    }
  });

  // Conditionally add "Hentai" category if adult content is active
  let categories = ["all"];
  if (window.isAdultContentActive && window.isAdultContentActive()) {
    categories.push("hentai");
  }
  categories = [...categories, ...Array.from(uniqueCategories).sort()];

  const categoryLabels = {
    all: "Todas",
    hentai: "Hentai", // Add label for Hentai
    ...Array.from(uniqueCategories).reduce((acc, cat) => {
      acc[cat] = cat.charAt(0).toUpperCase() + cat.slice(1); // Capitalize for display
      return acc;
    }, {}),
  };

  // Create the category filter section and append it directly to appMainContentElement
  const categoryFilterSection = document.createElement("section");
  categoryFilterSection.className =
    "category-filter-section bg-gray-900 py-2"; // Reduced vertical padding
  categoryFilterSection.innerHTML = `
        <div class="slider-wrapper overflow-x-auto whitespace-nowrap custom-scrollbar w-full max-w-screen-xl mx-auto px-4"> <!-- Added horizontal padding -->
            <div class="slider-track inline-flex gap-2"> <!-- Reduced gap -->
                ${categories
                  .map(
                    (category) => `
                        <span class="category-filter text-sm px-4 py-1 cursor-pointer shadow-md transition-all duration-300" data-category="${category}">${
                      categoryLabels[category]
                    } (<span class="category-count">0</span>)</span>
                    `
                  )
                  .join("")}
            </div>
        </div>
        `;
  appMainContentElement.appendChild(categoryFilterSection); // Insert filters first
  appMainContentElement.appendChild(mainContent); // Then append the main content

  const seriesSectionElement = mainContent.querySelector("#series-section");
  if (!seriesSectionElement) {
    console.error("Could not find #series-section within the series template.");
    return;
  }

  // Create the series posters grid section
  const seriesPostersSection = document.createElement("section");
  seriesPostersSection.className = "series-posters";
  seriesPostersSection.innerHTML = `
            <div id="series-grid" class="grid grid-cols-3 gap-3 md:gap-4">
                </div>
        `;
  seriesSectionElement.appendChild(seriesPostersSection);

  console.log("Series section content appended.");

  function renderSeries(filteredSeries) {
    console.log("renderSeries called with filteredSeries:", filteredSeries);
    console.log("Number of filtered series to render:", filteredSeries.length); // Added log
    const seriesGrid = seriesSectionElement.querySelector("#series-grid");
    if (!seriesGrid) {
      console.error("Series grid element not found."); // Added log
      return;
    }

    seriesGrid.innerHTML = ""; // Clear previous content

    if (filteredSeries.length === 0) {
      seriesGrid.innerHTML =
        "<p class='text-center text-gray-400 col-span-full py-8'>No se encontraron series para esta categoría.</p>";
      console.log("No series found for this category, displaying message."); // Added log
      return;
    }
    
    const loadPoster = (entries, observer) => {
        const intersectingEntries = entries.filter((e) => e.isIntersecting);

        intersectingEntries.forEach((entry, index) => {
            observer.unobserve(entry.target);
            
            setTimeout(() => {
                const placeholder = entry.target;
                const seriesData = JSON.parse(placeholder.dataset.series);
                
                // Add the ID to the set of loaded series
                if(seriesData.id) loadedSeriesIds.add(seriesData.id);
                
                console.log("Loading poster for:", seriesData.name);

                const posterFragment = window.createSeriesGrid(imageBaseUrl, [seriesData]);
                const posterElement = posterFragment.firstChild;

                if (posterElement) {
                    const textElements = posterElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
                    textElements.forEach(el => {
                        if (el.classList.contains('text-2xl')) {
                            el.classList.remove('text-2xl'); el.classList.add('text-xl');
                        } else if (el.classList.contains('text-xl')) {
                            el.classList.remove('text-xl'); el.classList.add('text-lg');
                        } else if (el.classList.contains('text-lg')) {
                            el.classList.remove('text-lg'); el.classList.add('text-base');
                        } else if (el.classList.contains('text-base')) {
                            el.classList.remove('text-base'); el.classList.add('text-sm');
                        } else if (el.classList.contains('text-sm')) {
                            el.classList.remove('text-sm'); el.classList.add('text-xs');
                        }
                    });

                    posterElement.classList.add('opacity-0', 'transition-opacity', 'duration-500', 'ease-in-out');
                    placeholder.replaceWith(posterElement);

                    requestAnimationFrame(() => {
                        posterElement.classList.remove('opacity-0');
                    });
                } else {
                    console.warn("posterElement was null or undefined for seriesData:", seriesData);
                }
            }, index * 150);
        });
    };

    const observer = new IntersectionObserver(loadPoster, {
      rootMargin: "0px 0px 200px 0px",
      threshold: 0.01,
    });

    // --- MODIFICATION START ---
    // Now, we check if a series has been loaded before. If so, render it directly.
    // Otherwise, create a placeholder to be lazy-loaded.
    filteredSeries.forEach((series) => {
      // Assumes each series has a unique 'id' property.
      if (series.id && loadedSeriesIds.has(series.id)) {
        // This series was already loaded, create the poster directly
        const posterFragment = window.createSeriesGrid(imageBaseUrl, [series]);
        const posterElement = posterFragment.firstChild;
        if (posterElement) {
            // Apply the same text size modification
            const textElements = posterElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
            textElements.forEach(el => {
                if (el.classList.contains('text-2xl')) {
                    el.classList.remove('text-2xl'); el.classList.add('text-xl');
                } else if (el.classList.contains('text-xl')) {
                    el.classList.remove('text-xl'); el.classList.add('text-lg');
                } else if (el.classList.contains('text-lg')) {
                    el.classList.remove('text-lg'); el.classList.add('text-base');
                } else if (el.classList.contains('text-base')) {
                    el.classList.remove('text-base'); el.classList.add('text-sm');
                } else if (el.classList.contains('text-sm')) {
                    el.classList.remove('text-sm'); el.classList.add('text-xs');
                }
            });
            seriesGrid.appendChild(posterElement);
        }
      } else {
        // This series is new, create a placeholder and observe it
        const placeholder = document.createElement("div");
        placeholder.className =
          "poster-placeholder aspect-[2/3] bg-gray-800 rounded-lg animate-pulse border border-gray-700 relative"; // Added relative for badge positioning
        placeholder.dataset.series = JSON.stringify(series);
        
        seriesGrid.appendChild(placeholder);
        observer.observe(placeholder);
      }
    });
    // --- MODIFICATION END ---
  }

  function filterSeries(category) {
    console.log("filterSeries called with category:", category);
    const filterSpans =
      appMainContentElement.querySelectorAll(".category-filter");
    filterSpans.forEach((span) => {
      span.classList.remove("active");
    });

    const activeSpan = appMainContentElement.querySelector(
      `[data-category="${category}"]`
    );
    if (activeSpan) {
      activeSpan.classList.add("active");
    }

    const filteredSeries =
      category === "all"
        ? seriesOnlyData
        : seriesOnlyData.filter(
            (series) => series.categoria && series.categoria.includes(category)
          );
    console.log("Filtered series:", filteredSeries);
    renderSeries(filteredSeries);
  }

  function addFilterEventListeners() {
    const filterSpans =
      appMainContentElement.querySelectorAll(".category-filter");

    const categoryCounts = { all: seriesOnlyData.length };
    seriesOnlyData.forEach((series) => {
      if (series.categoria) {
        series.categoria.forEach((cat) => {
          if (categories.includes(cat)) {
            if (categoryCounts[cat]) {
              categoryCounts[cat]++;
            } else {
              categoryCounts[cat] = 1;
            }
          }
        });
      }
    });

    filterSpans.forEach((span) => {
      const category = span.dataset.category;
      const countElement = span.querySelector(".category-count");
      if (countElement) {
        countElement.textContent = categoryCounts[category] || 0;
      }

      span.addEventListener("click", (event) => {
        const selectedCategory = event.currentTarget.dataset.category;
        filterSeries(selectedCategory);
      });
    });
  }

  // Initial render with all series and add event listeners
  console.log("Performing initial render for all series.");
    filterSeries("all"); // This will also set the initial 'active' class
    addFilterEventListeners(); // Call after initial filter to populate counts

    // Add scroll event listener to synchronize slider and category filter
    const sliderWrapper = categoryFilterSection.querySelector(".slider-wrapper");
    const sliderTrack = categoryFilterSection.querySelector(".slider-track");
    const categoryFilters = categoryFilterSection.querySelectorAll(".category-filter");

    // Remove the previous scroll event listener from sliderWrapper as it's not the intended target
    // (No need to explicitly remove if it's being replaced or if the element is re-created)

    // Add scroll event listener to the main content area to synchronize category filter
    let seriesScrollTimeout;
    appMainContentElement.addEventListener("scroll", () => { // Listen on the main content element
        clearTimeout(seriesScrollTimeout);
        seriesScrollTimeout = setTimeout(() => {
            const seriesPosters = seriesSectionElement.querySelectorAll(".poster-placeholder, .series-grid-item");
            let currentVisibleCategory = "all";
            let minDistanceFromTop = Infinity;

            // Find the category of the series poster closest to the top of the viewport
            for (let i = 0; i < seriesPosters.length; i++) {
                const poster = seriesPosters[i];
                const rect = poster.getBoundingClientRect();

                // Check if the poster is in the viewport
                if (rect.top >= 0 && rect.top < window.innerHeight) {
                    // Get series data from placeholder or actual poster
                    const seriesData = poster.dataset.series ? JSON.parse(poster.dataset.series) : null;
                    if (!seriesData && poster.classList.contains('series-grid-item')) {
                        // If it's a fully loaded item, try to get data from its child elements if available
                        const titleElement = poster.querySelector('.text-lg, .text-base, .text-sm, .text-xs');
                        if (titleElement) {
                            // This is a fallback, ideally seriesData should be available
                            // For now, we'll assume the first visible series determines the category
                            // A more robust solution would involve storing category data on the rendered poster
                            // For this task, we'll rely on the original seriesOnlyData to find the category
                            const seriesName = titleElement.textContent;
                            const originalSeries = seriesOnlyData.find(s => s.name === seriesName);
                            if (originalSeries && originalSeries.categoria && originalSeries.categoria.length > 0) {
                                currentVisibleCategory = originalSeries.categoria[0]; // Take the first category
                                if (currentVisibleCategory === "series") currentVisibleCategory = "all"; // Handle generic "series"
                            }
                        }
                    } else if (seriesData && seriesData.categoria && seriesData.categoria.length > 0) {
                        currentVisibleCategory = seriesData.categoria[0]; // Take the first category
                        if (currentVisibleCategory === "series") currentVisibleCategory = "all"; // Handle generic "series"
                    }

                    // If this poster is closer to the top, update the category
                    if (rect.top < minDistanceFromTop) {
                        minDistanceFromTop = rect.top;
                        // We already set currentVisibleCategory above
                    }
                    // Break after finding the first visible series to determine the category
                    break;
                }
            }
            // Only update if a new category is detected
            const currentActiveFilter = appMainContentElement.querySelector(".category-filter.active");
            if (!currentActiveFilter || currentActiveFilter.dataset.category !== currentVisibleCategory) {
                filterSeries(currentVisibleCategory);
            }

            // Also, scroll the category filter slider to make the active category visible
            const activeCategoryFilterSpan = categoryFilterSection.querySelector(`[data-category="${currentVisibleCategory}"]`);
            if (activeCategoryFilterSpan) {
                const sliderWrapperRect = sliderWrapper.getBoundingClientRect();
                const activeFilterRect = activeCategoryFilterSpan.getBoundingClientRect();

                // Calculate if the active filter is out of view to the left or right
                if (activeFilterRect.left < sliderWrapperRect.left) {
                    sliderWrapper.scrollLeft += activeFilterRect.left - sliderWrapperRect.left - 20; // Scroll left, add some padding
                } else if (activeFilterRect.right > sliderWrapperRect.right) {
                    sliderWrapper.scrollLeft += activeFilterRect.right - sliderWrapperRect.right + 20; // Scroll right, add some padding
                }
            }

        }, 200); // Debounce scroll event for series content
    });

    console.log("Series section initialization complete.");
};

// Expose a function to update series categories externally
window.updateSeriesCategories = (appMainContentElement, allMediaDetails, imageBaseUrl) => {
  console.log("updateSeriesCategories called to refresh categories.");

  // Remove existing category filter section and main content to re-render
  const existingCategoryFilterSection = appMainContentElement.querySelector(".category-filter-section");
  if (existingCategoryFilterSection) {
    existingCategoryFilterSection.remove();
  }
  const existingMainContent = appMainContentElement.querySelector("#main-content");
  if (existingMainContent) {
    existingMainContent.remove();
  }

  // Re-initialize the series page content, which will re-create categories
  window.initSeriesPageContent(appMainContentElement, allMediaDetails, imageBaseUrl);
};
