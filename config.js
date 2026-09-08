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
