'use strict';

// Initialize independent carousels from the articles in each category.
document.querySelectorAll('[data-project-carousel]').forEach(group => {
  const track = group.querySelector('.project-grid');
  const slides = [...track.querySelectorAll(':scope > .project')];
  if (!slides.length) return;
  const picker = group.querySelector('.project-picker');
  const previous = group.querySelector('.project-prev');
  const next = group.querySelector('.project-next');
  const counter = group.querySelector('.project-carousel-counter');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let animation = 0;
  let drag = null;
  let suppressClick = false;
  const choices = slides.map((slide, index) => {
    const title = slide.querySelector('.project-title').textContent;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${slides.length}: ${title}`);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${String(index + 1).padStart(2, '0')} / ${title}`;
    button.setAttribute('aria-controls', track.id);
    button.addEventListener('click', () => goTo(index));
    picker.append(button);
    return button;
  });
  function position(index) {
    return Math.min(slides[index].offsetLeft - slides[0].offsetLeft, track.scrollWidth - track.clientWidth);
  }
  function update(index) {
    current = index;
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    slides.forEach((slide, i) => {
      if (i !== index && slide.contains(document.activeElement)) track.focus({ preventScroll: true });
      slide.inert = i !== index;
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
    if (instant || reducedMotion.matches || Math.abs(target - from) < 1) {
      track.scrollLeft = target;
      return;
    }
    track.classList.add('is-moving');
    const start = performance.now();
    function frame(now) {
      const progress = Math.min((now - start) / 400, 1);
      track.scrollLeft = from + (target - from) * (1 - (1 - progress) ** 3);
      if (progress < 1) animation = requestAnimationFrame(frame);
      else { stopAnimation(); track.scrollLeft = target; }
    }
    animation = requestAnimationFrame(frame);
  }
  previous.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  group.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let scrollFrame = 0;
  track.addEventListener('scroll', () => {
    if (animation || drag || scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      if (animation || drag) return;
      const nearest = slides.reduce((best, _, i) => Math.abs(position(i) - track.scrollLeft) < Math.abs(position(best) - track.scrollLeft) ? i : best, 0);
      if (nearest !== current) update(nearest);
    });
  }, { passive: true });
  track.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') { stopAnimation(); return; }
    if (event.button !== 0 || event.target.closest('a, button, summary, input, textarea, select')) return;
    stopAnimation();
    suppressClick = false;
    drag = { x: event.clientX, left: track.scrollLeft, index: current, moved: false };
    track.setPointerCapture(event.pointerId);
  });
  track.addEventListener('pointermove', event => {
    if (!drag) return;
    const delta = event.clientX - drag.x;
    if (Math.abs(delta) > 6) {
      drag.moved = true;
      track.classList.add('is-moving', 'is-dragging');
      track.scrollLeft = drag.left - delta;
    }
  });
  function finishDrag(event) {
    if (!drag) return;
    const previousDrag = drag;
    drag = null;
    suppressClick = previousDrag.moved;
    track.classList.remove('is-dragging');
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    const delta = track.scrollLeft - previousDrag.left;
    const step = event.type !== 'pointercancel' && Math.abs(delta) > Math.min(80, track.clientWidth * .15) ? Math.sign(delta) : 0;
    goTo(previousDrag.index + step);
    setTimeout(() => { suppressClick = false; }, 0);
  }
  track.addEventListener('pointerup', finishDrag);
  track.addEventListener('pointercancel', finishDrag);
  track.addEventListener('click', event => {
    if (suppressClick) { event.preventDefault(); event.stopPropagation(); }
  }, true);
  group.classList.add('project-carousel');
  group.setAttribute('aria-roledescription', 'carousel');
  track.tabIndex = 0;
  track.setAttribute('aria-label', `${group.querySelector('.project-group-heading h3').textContent}. Use left and right arrow keys to navigate.`);
  group.dataset.projectCount = String(slides.length);
  picker.hidden = false;
  group.querySelector('.project-carousel-controls').hidden = false;
  group.querySelector('.project-swipe-hint').hidden = slides.length < 2;
  new ResizeObserver(() => goTo(current, true)).observe(track);
  reducedMotion.addEventListener('change', () => goTo(current, true));
  update(0);
});
