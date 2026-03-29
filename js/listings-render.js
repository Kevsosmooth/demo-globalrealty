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

  /**
   * Renders all property cards into the grid and sets up filters.
   */
  function renderAll(properties) {
    var html = '';
    for (var i = 0; i < properties.length; i++) {
      html += renderCard(properties[i], i);
    }
    grid.innerHTML = html;
    if (countEl) countEl.textContent = properties.length;
    /* Fade in the count text now that data is loaded */
    var countWrap = document.getElementById('listings-count-wrap');
    if (countWrap) countWrap.style.opacity = '1';
    setupFilters();
    triggerRevealAnimations();
  }

  /**
   * Reattaches the IntersectionObserver for newly rendered cards
   * so scroll-reveal animations work on dynamically inserted elements.
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
   * Wires up the filter bar buttons to show/hide cards.
   * Matches against data-bedrooms (space-separated) and data-status.
   */
  function setupFilters() {
    var buttons = document.querySelectorAll('.filter-btn');
    var cards = grid.querySelectorAll('.property-card');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.dataset.filter;
        var visible = 0;

        cards.forEach(function (card) {
          var bedrooms = card.dataset.bedrooms || '';
          var status = card.dataset.status;
          var show = false;

          if (filter === 'all') {
            show = true;
          } else if (filter === 'available' || filter === 'rented') {
            show = status === filter;
          } else {
            /* Check if the card's bedroom categories include this filter */
            show = bedrooms.split(' ').indexOf(filter) !== -1;
          }

          card.style.display = show ? '' : 'none';
          if (show) visible++;
        });

        if (countEl) countEl.textContent = visible;
      });
    });
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
