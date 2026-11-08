/**
 * MODELA Y REFORMA — main.js
 * Navigation, gallery filters, lightbox, process moment, map and video facades, video carousel.
 */

'use strict';

/* ============================================================
   NAVIGATION — mobile menu toggle, active link
   ============================================================ */
function initNav() {
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('nav-toggle');
  const mobile = document.getElementById('nav-mobile');
  if (!nav) return;

  function setMenu(open) {
    if (!toggle || !mobile) return;
    mobile.classList.toggle('is-open', open);
    toggle.classList.toggle('is-active', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobile.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (toggle && mobile) {
    toggle.addEventListener('click', () => setMenu(!mobile.classList.contains('is-open')));
    mobile.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobile.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    // Leaving the mobile layout with the menu open must not leave the page locked
    window.matchMedia('(min-width: 1100px)').addEventListener('change', (e) => {
      if (e.matches) setMenu(false);
    });
  }

  // Active link highlighting (home page anchors only)
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav__link'));
  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    const y = window.scrollY + 140;
    let current = null;
    sections.forEach(section => {
      if (y >= section.offsetTop && y < section.offsetTop + section.offsetHeight) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('nav__link--active', current !== null && link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ============================================================
   GALLERY — category filters + "show all" (first batch only at first)
   ============================================================ */
function initGallery() {
  const filters = document.querySelectorAll('.gallery__filter');
  const items = Array.from(document.querySelectorAll('.gallery__item'));
  if (!filters.length || !items.length) return;

  const BATCH = 12;
  const moreWrap = document.querySelector('.gallery__more');
  const moreBtn = document.getElementById('gallery-more');
  let filter = 'all';
  let expanded = false;

  function apply() {
    let matching = 0;
    items.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      if (match) matching++;
      item.classList.toggle('is-hidden', !match || (!expanded && matching > BATCH));
    });
    if (moreWrap && moreBtn) {
      moreWrap.hidden = expanded || matching <= BATCH;
      moreBtn.textContent = 'Ver los ' + matching + ' proyectos';
    }
  }

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => {
        f.classList.remove('is-active');
        f.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      filter = btn.dataset.filter;
      expanded = false;
      apply();
    });
  });

  if (moreBtn) {
    moreBtn.addEventListener('click', () => {
      expanded = true;
      apply();
    });
  }
  apply();
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const closeBtn = lightbox?.querySelector('.lightbox__close');
  const prevBtn = lightbox?.querySelector('.lightbox__nav--prev');
  const nextBtn = lightbox?.querySelector('.lightbox__nav--next');

  if (!lightbox || !lbImg) return;

  let currentImages = [];
  let currentIndex = 0;
  let opener = null;

  function getVisibleImages() {
    return Array.from(
      document.querySelectorAll('.gallery__item:not(.is-hidden) img')
    );
  }

  function openLightbox(index, from) {
    currentImages = getVisibleImages();
    if (!currentImages.length) return;
    currentIndex = index;
    opener = from || null;
    updateLightboxImage();
    lightbox.hidden = false;
    // Force reflow so the opacity transition runs
    lightbox.offsetHeight;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { lightbox.hidden = true; }, 220);
    if (opener) opener.focus();
  }

  function updateLightboxImage() {
    const img = currentImages[currentIndex];
    if (!img) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    if (lbCaption) lbCaption.textContent = img.alt;
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + currentImages.length) % currentImages.length;
    updateLightboxImage();
  }

  document.querySelectorAll('.gallery__item').forEach(item => {
    item.addEventListener('click', () => {
      const visibleImages = getVisibleImages();
      const img = item.querySelector('img');
      const idx = visibleImages.indexOf(img);
      openLightbox(idx >= 0 ? idx : 0, item);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    const img = item.querySelector('img');
    if (img) item.setAttribute('aria-label', 'Ampliar imagen: ' + img.alt);
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => navigate(-1));
  nextBtn?.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox__content')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

/* ============================================================
   PROCESS MOMENT — the step in the middle of the screen lights up.
   Without JS (or with reduced motion) all four steps stay at full strength.
   ============================================================ */
function initProcess() {
  const process = document.getElementById('process');
  if (!process || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const steps = Array.from(process.querySelectorAll('.step'));
  if (!steps.length) return;

  process.classList.add('has-moment');
  steps[0].classList.add('is-active');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        steps.forEach(step => step.classList.toggle('is-active', step === entry.target));
      }
    });
  }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });

  steps.forEach(step => observer.observe(step));
}

/* ============================================================
   MAP FACADE — load the Google Maps iframe only on click
   ============================================================ */
function initMapFacade() {
  document.querySelectorAll('.map-facade').forEach(box => {
    const btn = box.querySelector('.map-facade__btn');
    const src = box.dataset.mapSrc;
    if (!btn || !src) return;

    btn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.title = box.dataset.mapTitle || 'Mapa';
      iframe.width = '100%';
      iframe.height = '400';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      box.replaceChildren(iframe);
      box.classList.add('is-loaded');
      iframe.focus();
    });
  });
}

/* ============================================================
   VIDEO FACADE — create the YouTube iframe only on click.
   Only one video plays at a time: starting another restores the
   thumbnail and play button of the previous one.
   ============================================================ */
function stopVideo(box) {
  if (!box._facadeNodes) return;
  box.replaceChildren(...box._facadeNodes);
  box._facadeNodes = null;
  box.classList.remove('is-playing');
}

function initVideoFacades() {
  document.querySelectorAll('.video-facade').forEach(box => {
    const btn = box.querySelector('.video-facade__play');
    const id = box.dataset.videoId || '';
    if (!btn || !/^[\w-]{11}$/.test(id)) return;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.video-facade.is-playing').forEach(stopVideo);

      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      iframe.title = box.dataset.videoTitle || 'Vídeo';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      box._facadeNodes = Array.from(box.childNodes);
      box.replaceChildren(iframe);
      box.classList.add('is-playing');
      iframe.focus();
    });
  });
}

/* ============================================================
   VIDEO CAROUSEL — native horizontal scroll (works without JS);
   this adds prev/next buttons, end states and arrow keys.
   ============================================================ */
function initVideoCarousels() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.video-carousel').forEach(carousel => {
    const viewport = carousel.querySelector('.video-carousel__viewport');
    const prev = carousel.querySelector('.video-carousel__btn--prev');
    const next = carousel.querySelector('.video-carousel__btn--next');
    if (!viewport || !prev || !next) return;

    carousel.classList.add('has-js');

    function step() {
      const card = viewport.querySelector('.video-card');
      const gap = parseFloat(getComputedStyle(viewport.firstElementChild).columnGap) || 16;
      const one = card ? card.getBoundingClientRect().width + gap : 200;
      // scroll by whole cards: as many as fit, at least one
      return Math.max(one, Math.floor(viewport.clientWidth / one) * one);
    }

    function update() {
      const max = viewport.scrollWidth - viewport.clientWidth;
      carousel.classList.toggle('is-static', max <= 1);
      prev.disabled = viewport.scrollLeft <= 1;
      next.disabled = viewport.scrollLeft >= max - 1;
    }

    function scrollByDir(dir) {
      viewport.scrollBy({ left: dir * step(), behavior: reduced.matches ? 'auto' : 'smooth' });
    }

    prev.addEventListener('click', () => scrollByDir(-1));
    next.addEventListener('click', () => scrollByDir(1));

    viewport.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      scrollByDir(e.key === 'ArrowRight' ? 1 : -1);
    });

    let ticking = false;
    viewport.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    }, { passive: true });

    if ('ResizeObserver' in window) new ResizeObserver(update).observe(viewport);
    window.addEventListener('resize', update);
    update();
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initGallery();
  initLightbox();
  initProcess();
  initMapFacade();
  initVideoFacades();
  initVideoCarousels();

  // Footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
