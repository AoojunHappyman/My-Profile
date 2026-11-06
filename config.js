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
    window.location.href = `mailto:pattanachaisawet@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
    const line = Math.min(Math.ceil(header.getBoundingClientRect().height) + 24, innerHeight - 2);
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
