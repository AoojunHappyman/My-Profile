# Pattanachai portfolio

Static HTML/CSS/JavaScript portfolio hosted on GitHub Pages. No build step or runtime dependencies. Serve the project with `python -m http.server 8000`.

## Structure
- `index.html`: portfolio content, projects, skills, biography, experience, education and contact.
- `style.css`: base layout and functional component styles.
- `neo.css`: editorial neo-brutalist tokens, composition, themes and responsive styles.
- `config.js`: mobile navigation, active section tracking, themes, image lightbox, email draft validation and print controls.
- `cv.html`: print-friendly resume source; PDF is linked from the navigation and Hero.
- `resume.html` and `contact.html`: existing redirect entry points.

Personal projects progressively enhance into a horizontal scroll-snap showcase with a preview of the next project, title picker, previous/next controls and a live position counter. Mouse drag, native touch swipe and arrow keys are supported without autoplay. Controls derive from the actual project articles. With JavaScript disabled, personal projects remain readable editorial rows. Team projects retain the full-width editorial layout and sticky desktop preview. On mobile all projects stack in document order. All original project descriptions, skills and links are preserved. Images open in a keyboard-accessible dialog. The contact form prepares an email draft; it does not send or store messages.

Fonts are served locally. The design uses Inter and IBM Plex Sans Thai with monospace metadata, shared dark/light tokens, hard shadows and reduced-motion support. There are no external animation or component libraries.

GitHub Pages serves the repository root on main. All local asset links remain relative for compatibility with `/My-Profile/`.

## Theme and CSS ownership
`style.css` supplies shared functional defaults and legacy redirect page styling. `neo.css` owns the current visual system, grouped by tokens, components, breakpoints and motion. There are no v1/v2 append-only overrides inside the theme. Obsolete carousel selectors have been removed.

Use `--accent` for theme-aware foreground text, and the paired `--highlight` / `--on-highlight` for filled highlights and buttons. Light mode uses dark green with white text. Contact intentionally keeps a lime surface in both modes, with scoped local tokens for the form, links and focus states. Derived border/shadow tokens are redeclared where the theme changes to avoid inherited resolved colors.

Responsive and visual QA: reviewed dark/light Hero, project previews and Contact at 375, 768, 1440 and 1920px. The contrast checks cover the selected text/control pairs, not a complete accessibility audit. Browser screenshots and the detailed QA report are local, ignored artifacts under `qa/`.

## Project categories
Personal Projects contains BKK Traffic Insight, Expense Tracker and EXMELLO. Team Projects contains CondoFlow, an interactive frontend prototype for ITDS262 Software Engineering Lab. CondoFlow descriptions, technologies and the documented Frontend Engineer & UI Architect role are based on its public repository README and package manifest. The supplied dashboard screenshot is stored locally. Both groups remain visible, with direct category links.

`projects.js` enhances only `#personal-projects`; inactive slides are inert for keyboard navigation. Resizing and reduced-motion changes retain the active project. Carousel styles are scoped to `.personal-carousel`; team project styles and content are unaffected.
