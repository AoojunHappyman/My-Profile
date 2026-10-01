'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuButton && navLinks) {
  menuButton.hidden = false;
  const setMenu = (open) => { menuButton.setAttribute('aria-expanded', String(open)); navLinks.dataset.collapsed = String(!open); };
  setMenu(false);
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  navLinks.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); } });
  matchMedia('(min-width: 901px)').addEventListener('change', () => setMenu(false));
}
const themeButton = document.querySelector('.theme-toggle');
if (themeButton) {
  themeButton.hidden = false;
  const setTheme = light => { document.body.classList.toggle('light', light); themeButton.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`); };
  try { setTheme(localStorage.getItem('portfolio-theme') === 'light'); } catch { /* Storage is optional. */ }
  themeButton.addEventListener('click', () => { const light = !document.body.classList.contains('light'); setTheme(light); try { localStorage.setItem('portfolio-theme', light ? 'light' : 'dark'); } catch { /* Keep the theme for this visit. */ } });
}
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const fields = ['name', 'email', 'subject', 'message'].map(name => contactForm.elements.namedItem(name));
    fields.forEach(field => field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.'));
    if (!contactForm.reportValidity()) return;
    const [name, email, subject, message] = fields.map(field => field.value.trim());
    const body = `${message}\n\nFrom: ${name}\nEmail: ${email}`;
    window.location.href = `mailto:pattanachai.saw@student.mahidol.ac.th?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.querySelector('#form-status').textContent = 'Email draft requested. Please send it from your email app. If no app opens, use the email address above; your message remains here.';
  });
  contactForm.addEventListener('input', event => event.target.setCustomValidity(''));
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
const printButton = document.querySelector('#print-resume');
if (printButton) { printButton.hidden = false; printButton.addEventListener('click', () => window.print()); }
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('reveal'); observer.unobserve(entry.target); } }), { threshold: 0.1 });
  document.querySelectorAll('.section-heading, .skill-group').forEach(section => observer.observe(section));
}

// Slides and controls are derived from the project articles, including future additions.
const carousel = document.querySelector('.project-carousel');
if (carousel) {
  const track = carousel.querySelector('.project-track');
  const slides = [...track.querySelectorAll(':scope > .project')];
  const previous = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  const counter = carousel.querySelector('.carousel-counter');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let animation = 0;
  let dragging = null;
  let suppressClick = false;
  const position = index => Math.min(slides[index].offsetLeft - slides[0].offsetLeft, track.scrollWidth - track.clientWidth);
  const picker = carousel.querySelector('.project-picker');
  const choices = [];
  carousel.querySelector('.project-swipe-hint').textContent = `${slides.length} projects · Swipe or use the arrows to explore`;
  const dots = slides.map((slide, index) => {
    const title = slide.querySelector('h3').textContent;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${slides.length}: ${title}`);
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Show project ${index + 1}: ${title}`);
    dot.setAttribute('aria-controls', 'project-track');
    dot.addEventListener('click', () => goTo(index));
    dotsContainer.append(dot);
    const choice = document.createElement('button');
    choice.type = 'button';
    choice.className = 'project-choice';
    choice.textContent = `${String(index + 1).padStart(2, '0')} / ${title}`;
    choice.setAttribute('aria-controls', 'project-track');
    choice.addEventListener('click', () => goTo(index));
    picker.append(choice);
    choices.push(choice);
    return dot;
  });
  function update(index) {
    current = index;
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    slides.forEach((slide, i) => {
      if (i !== index && slide.contains(document.activeElement)) track.focus({ preventScroll: true });
      slide.inert = i !== index;
      dots[i].setAttribute('aria-current', String(i === index));
      choices[i].setAttribute('aria-current', String(i === index));
    });
  }
  function stopAnimation() {
    cancelAnimationFrame(animation);
    animation = 0;
    track.classList.remove('is-moving');
  }
  function goTo(index, instant = false) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    stopAnimation();
    update(index);
    const from = track.scrollLeft;
    const target = position(index);
    if (instant || reducedMotion.matches || Math.abs(from - target) < 1) {
      track.scrollLeft = target;
      return;
    }
    track.classList.add('is-moving');
    const started = performance.now();
    function frame(now) {
      const progress = Math.min((now - started) / 400, 1);
      track.scrollLeft = from + (target - from) * (1 - Math.pow(1 - progress, 3));
      if (progress < 1) animation = requestAnimationFrame(frame);
      else { stopAnimation(); track.scrollLeft = target; }
    }
    animation = requestAnimationFrame(frame);
  }
  previous.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  carousel.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let scrollFrame = 0;
  track.addEventListener('scroll', () => {
    if (animation || dragging || scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      if (animation || dragging) return;
      const index = slides.reduce((best, _, i) => Math.abs(position(i) - track.scrollLeft) < Math.abs(position(best) - track.scrollLeft) ? i : best, 0);
      if (index !== current) update(index);
    });
  }, { passive: true });
  track.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') { stopAnimation(); return; }
    if (event.button !== 0 || event.target.closest('a, button, summary, input, textarea, select')) return;
    stopAnimation();
    suppressClick = false;
    dragging = { x: event.clientX, scroll: track.scrollLeft, index: current, moved: false };
    track.setPointerCapture(event.pointerId);
  });
  track.addEventListener('pointermove', event => {
    if (!dragging) return;
    const distance = event.clientX - dragging.x;
    if (Math.abs(distance) > 6) {
      dragging.moved = true;
      track.classList.add('is-moving', 'is-dragging');
      track.scrollLeft = dragging.scroll - distance;
    }
  });
  function finishDrag(event) {
    if (!dragging) return;
    const drag = dragging;
    dragging = null;
    suppressClick = drag.moved;
    track.classList.remove('is-dragging');
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    const delta = track.scrollLeft - drag.scroll;
    const step = event.type !== 'pointercancel' && Math.abs(delta) > Math.min(80, track.clientWidth * .15) ? Math.sign(delta) : 0;
    goTo(drag.index + step);
    setTimeout(() => { suppressClick = false; }, 0);
  }
  track.addEventListener('pointerup', finishDrag);
  track.addEventListener('pointercancel', finishDrag);
  track.addEventListener('click', event => {
    if (suppressClick) { event.preventDefault(); event.stopPropagation(); }
  }, true);
  new ResizeObserver(() => goTo(current, true)).observe(track);
  reducedMotion.addEventListener('change', () => goTo(current, true));
  carousel.querySelector('.carousel-controls').hidden = slides.length < 2;
  picker.hidden = false;
  update(0);
}

// Track the section crossing the reading line below the sticky navigation.
if (navLinks && 'IntersectionObserver' in window) {
  const sectionLinks = [...navLinks.querySelectorAll('a[href^="#"]')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const header = document.querySelector('.site-header');
  let sectionObserver;
  let endObserver;
  function observeSections() {
    sectionObserver?.disconnect();
    endObserver?.disconnect();
    const line = Math.min(header.getBoundingClientRect().height + 24, innerHeight - 2);
    const updateActive = () => {
      const atEnd = Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 2;
      const section = atEnd ? sections[sections.length - 1] : sections.find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= line + 1 && rect.bottom > line;
      });
      sectionLinks.forEach(link => {
        if (section && link.hash === `#${section.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    sectionObserver = new IntersectionObserver(updateActive, {
      rootMargin: `-${line}px 0px -${Math.max(0, innerHeight - line - 2)}px 0px`, threshold: 0
    });
    sections.forEach(section => sectionObserver.observe(section));
    endObserver = new IntersectionObserver(updateActive, { threshold: [0, 1] });
    const footer = document.querySelector('.footer');
    if (footer) endObserver.observe(footer);
    updateActive();
  }
  new ResizeObserver(observeSections).observe(header);
  window.addEventListener('resize', observeSections);
  observeSections();
}

// Keep the original image links as a fallback when JavaScript is unavailable.
const previewLinks = document.querySelectorAll('.browser-preview a[href$=".png"]');
if (previewLinks.length && typeof HTMLDialogElement !== 'undefined') {
  const lightbox = document.createElement('dialog');
  lightbox.className = 'preview-lightbox';
  lightbox.setAttribute('aria-labelledby', 'preview-title');
  lightbox.innerHTML = '<div class="lightbox-toolbar"><h2 id="preview-title"></h2><button type="button" class="lightbox-close" aria-label="Close project preview" autofocus>×</button></div><img class="lightbox-image" alt="">';
  document.body.append(lightbox);
  const image = lightbox.querySelector('img');
  const close = lightbox.querySelector('button');
  let opener;
  let previousOverflow;
  previewLinks.forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      const figure = link.closest('figure');
      image.src = link.href;
      image.alt = figure.querySelector('img').alt;
      lightbox.querySelector('h2').textContent = figure.querySelector('.browser-address').textContent;
      previousOverflow = document.body.style.overflow;
      lightbox.showModal();
      document.body.style.overflow = 'hidden';
    });
  });
  close.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'Tab') { event.preventDefault(); close.focus(); }
  });
  lightbox.addEventListener('click', event => {
    const rect = lightbox.getBoundingClientRect();
    if (event.target === lightbox && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) lightbox.close();
  });
  lightbox.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus({ preventScroll: true });
  });
}
