/* ============================================
   LISTINGS RENDER - Dynamic property card rendering
   Fetches from API with fallback to FALLBACK_DATA.
   Used on listings.html.
   ============================================ */

(function () {
  'use strict';

  var grid = document.getElementById('properties-grid');
  var countEl = document.getElementById('listings-count');
  if (!grid) return;

  /**
   * Shows skeleton placeholder cards while data is loading.
   * Renders 6 cards matching the property-card layout.
   */
  function showSkeletons() {
    var html = '';
    for (var i = 0; i < 6; i++) {
      var delay = i % 3 === 1 ? ' reveal-delay-1' : i % 3 === 2 ? ' reveal-delay-2' : '';
      html += '<div class="property-card skeleton-card reveal visible' + delay + '">' +
        '<div class="property-card__image skeleton-block" style="height:200px;border-radius:0"></div>' +
        '<div class="property-card__body" style="padding:20px">' +
          '<div class="skeleton-line" style="width:40%;height:22px;margin-bottom:10px"></div>' +
          '<div class="skeleton-line" style="width:65%;height:14px;margin-bottom:14px"></div>' +
          '<div class="skeleton-line" style="width:50%;height:12px"></div>' +
        '</div>' +
      '</div>';
    }
    grid.innerHTML = html;
    if (countEl) countEl.textContent = '';
  }

  showSkeletons();

  /**
   * Returns a placeholder image URL for a given index.
   * Cycles through the array if index exceeds length.
   */
  /** Extracts a URL string from a photo object or string. */
  function photoUrl(photo) {
    if (typeof photo === 'string') return photo;
    return photo.file_path || photo.url || '';
  }

  function getImage(property, index) {
    if (property.photos && property.photos.length > 0) {
      return photoUrl(property.photos[0]);
    }
    for (var i = 0; i < property.units.length; i++) {
      if (property.units[i].photos && property.units[i].photos.length > 0) {
        return photoUrl(property.units[i].photos[0]);
      }
    }
    var images = LISTINGS_CONFIG.PLACEHOLDER_IMAGES;
    return images[index % images.length];
  }

  /**
   * Collects all unique bedroom values across a property's units.
   * Returns a sorted array of integers (0 = studio).
   */
  function getBedroomValues(property) {
    var seen = {};
    var result = [];
    for (var i = 0; i < property.units.length; i++) {
      var b = property.units[i].bedrooms;
      if (b !== undefined && !seen[b]) {
        seen[b] = true;
        result.push(b);
      }
    }
    return result.sort(function (a, b) { return a - b; });
  }

  /**
   * Builds meta text for a property card.
   * Multi-unit: bed range + unit count. Single-unit: bed/bath.
   */
  function buildMeta(property) {
    var unitCount = property.units.length;
    if (unitCount > 1) {
      var availableCount = property.available_count || 0;
      return '<div class="property-card__meta-item">' + escapeHtml(property.bed_range) + '</div>' +
        '<div class="property-card__meta-item">' + availableCount + ' unit' + (availableCount !== 1 ? 's' : '') + ' available</div>';
    }
    var unit = property.units[0];
    var bedLabel = unit.bedrooms === 0 ? 'Studio' : unit.bedrooms + ' Bed';
    var bathLabel = unit.bathrooms + ' Bath';
    return '<div class="property-card__meta-item">' + bedLabel + '</div>' +
      '<div class="property-card__meta-item">' + bathLabel + '</div>';
  }

  /** Simple HTML entity escaping -- coerces to string first for safety. */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    var s = String(str);
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /**
   * Determines the data-bedrooms attribute values for filter matching.
   * Returns a space-separated string of bedroom categories.
   */
  function getBedroomCategories(property) {
    var beds = getBedroomValues(property);
    var cats = [];
    for (var i = 0; i < beds.length; i++) {
      if (beds[i] === 0) cats.push('studio');
      else if (beds[i] === 1) cats.push('1');
      else if (beds[i] === 2) cats.push('2');
      else if (beds[i] >= 3) cats.push('3');
    }
    /* Deduplicate */
    var unique = {};
    var result = [];
    for (var j = 0; j < cats.length; j++) {
      if (!unique[cats[j]]) {
        unique[cats[j]] = true;
        result.push(cats[j]);
      }
    }
    return result.join(' ');
  }

  /**
   * Renders a single property card HTML string.
   * Rented properties (available_count === 0) get reduced opacity and no link.
   */
  function renderCard(property, index) {
    var isRented = property.available_count === 0;
    var status = isRented ? 'rented' : 'available';
    var bedroomCats = getBedroomCategories(property);
    var image = getImage(property, index);
    var delayClass = index % 3 === 1 ? ' reveal-delay-1' : index % 3 === 2 ? ' reveal-delay-2' : '';
    var badgeClass = isRented ? 'property-card__badge property-card__badge--rented' : 'property-card__badge';
    var badgeText = isRented ? 'Rented' : 'Available';
    var rentedStyle = isRented ? ' style="pointer-events: none; opacity: 0.7;"' : '';
    var tag = isRented ? 'div' : 'a';
    var href = isRented ? '' : ' href="listing.html?id=' + encodeURIComponent(property.id) + '"';

    return '<' + tag + href + ' class="property-card reveal' + delayClass + '"' +
      ' data-bedrooms="' + bedroomCats + '"' +
      ' data-status="' + status + '"' +
      rentedStyle + '>' +
      '<div class="property-card__image">' +
        '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(property.address) + '">' +
        '<span class="' + badgeClass + '">' + badgeText + '</span>' +
      '</div>' +
      '<div class="property-card__body">' +
        '<div class="property-card__price">' + escapeHtml(property.price_range) + ' <span>/month</span></div>' +
        '<div class="property-card__address">' + escapeHtml(property.address) + '</div>' +
        '<div class="property-card__meta">' + buildMeta(property) + '</div>' +
      '</div>' +
    '</' + tag + '>';
  }

  var PER_PAGE = 9;
  var allProperties = [];
  var filteredProperties = [];
  var currentPage = 1;
  var currentFilter = 'all';
  var paginationEl = document.getElementById('pagination');

  /**
   * Filters properties by the active filter, then renders the current page.
   */
  function applyFilterAndRender() {
    filteredProperties = allProperties.filter(function (p) {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'available') return p.available_count > 0;
      if (currentFilter === 'rented') return p.available_count === 0;
      var cats = getBedroomCategories(p).split(' ');
      return cats.indexOf(currentFilter) !== -1;
    });

    var totalPages = Math.max(1, Math.ceil(filteredProperties.length / PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;

    var start = (currentPage - 1) * PER_PAGE;
    var pageItems = filteredProperties.slice(start, start + PER_PAGE);

    var html = '';
    for (var i = 0; i < pageItems.length; i++) {
      html += renderCard(pageItems[i], start + i);
    }
    grid.innerHTML = html;

    if (countEl) countEl.textContent = filteredProperties.length;
    var countWrap = document.getElementById('listings-count-wrap');
    if (countWrap) countWrap.style.opacity = '1';

    renderPagination(totalPages);
    triggerRevealAnimations();
  }

  /**
   * Renders pagination controls: Prev, page numbers, Next.
   * Shows ellipsis for large page counts.
   */
  function renderPagination(totalPages) {
    if (!paginationEl || totalPages <= 1) {
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    var html = '<button class="pagination__btn" data-page="prev"' +
      (currentPage === 1 ? ' disabled' : '') + '>&larr; Prev</button>';

    var pages = buildPageNumbers(currentPage, totalPages);
    for (var i = 0; i < pages.length; i++) {
      if (pages[i] === '...') {
        html += '<span class="pagination__ellipsis">...</span>';
      } else {
        var active = pages[i] === currentPage ? ' active' : '';
        html += '<button class="pagination__btn' + active + '" data-page="' + pages[i] + '">' + pages[i] + '</button>';
      }
    }

    html += '<button class="pagination__btn" data-page="next"' +
      (currentPage === totalPages ? ' disabled' : '') + '>Next &rarr;</button>';

    paginationEl.innerHTML = html;

    /* Bind page button clicks */
    var btns = paginationEl.querySelectorAll('.pagination__btn');
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener('click', function () {
        var page = this.dataset.page;
        if (page === 'prev') currentPage--;
        else if (page === 'next') currentPage++;
        else currentPage = parseInt(page, 10);
        applyFilterAndRender();
        /* Scroll to top of listings */
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  /**
   * Builds an array of page numbers with ellipsis for large sets.
   * Example: [1, 2, 3, '...', 8] or [1, '...', 4, 5, 6, '...', 10]
   */
  function buildPageNumbers(current, total) {
    if (total <= 7) {
      var all = [];
      for (var i = 1; i <= total; i++) all.push(i);
      return all;
    }
    var pages = [1];
    if (current > 3) pages.push('...');
    var start = Math.max(2, current - 1);
    var end = Math.min(total - 1, current + 1);
    for (var p = start; p <= end; p++) pages.push(p);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  }

  /**
   * Reattaches the IntersectionObserver for newly rendered cards.
   */
  function triggerRevealAnimations() {
    var els = grid.querySelectorAll('.reveal');
    if (!els.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    for (var i = 0; i < els.length; i++) {
      observer.observe(els[i]);
    }
  }

  /**
   * Sets up filter buttons to filter properties and reset to page 1.
   */
  function setupFilters() {
    var buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        currentPage = 1;
        applyFilterAndRender();
      });
    });
  }

  /**
   * Entry point -- stores full dataset, sets up filters, renders first page.
   */
  function renderAll(properties) {
    allProperties = properties;
    setupFilters();
    applyFilterAndRender();
  }

  /**
   * Attempts API fetch, falls back to hardcoded data on failure.
   * Uses AbortController with a short timeout for broad browser support.
   * On GitHub Pages the API is unreachable, so fallback kicks in fast.
   */
  function loadListings() {
    /* Skip the fetch entirely if we're on github.io -- the API is unreachable */
    if (window.location.hostname.indexOf('github.io') !== -1) {
      renderAll(FALLBACK_DATA);
      return;
    }

    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 1500);

    fetch(LISTINGS_CONFIG.API_URL, { signal: controller.signal })
      .then(function (res) {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var listings = Array.isArray(data) ? data : (data.items || data.listings || data.data || []);
        if (listings.length === 0) throw new Error('Empty response');
        renderAll(listings);
      })
      .catch(function () {
        clearTimeout(timeoutId);
        renderAll(FALLBACK_DATA);
      });
  }

  loadListings();
})();
