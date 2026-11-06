# Pattanachai portfolio

Static HTML/CSS/JavaScript portfolio hosted on GitHub Pages. No build step or runtime dependencies. Serve the project with `python -m http.server 8000`.

## Structure
- `index.html`: portfolio content, projects, skills, biography, experience, education and contact.
- `style.css`: base layout and functional component styles.
- `neo.css`: editorial neo-brutalist tokens, composition, themes and responsive styles.
- `config.js`: mobile navigation, active section tracking, themes, image lightbox, email draft validation and print controls.
- `cv.html`: print-friendly resume source; PDF is linked from the navigation and Hero.
- `resume.html` and `contact.html`: existing redirect entry points.

Both project categories progressively enhance into independent horizontal scroll-snap showcases with a preview of the next project, title picker, previous/next controls and a live position counter. Mouse drag, native touch swipe and arrow keys are supported without autoplay. Controls derive from the actual project articles. With JavaScript disabled, all projects remain readable editorial rows. A group containing one article shows its full-width card with disabled navigation and a 01 / 01 counter. Add more project articles inside that group's `.project-grid`; choices and navigation derive from the article list automatically on page load. On mobile all projects stack in document order. All original project descriptions, skills and links are preserved. Images open in a keyboard-accessible dialog. The contact form prepares an email draft; it does not send or store messages.

Fonts are served locally. The design uses Inter and IBM Plex Sans Thai with monospace metadata, shared dark/light tokens, hard shadows and reduced-motion support. There are no external animation or component libraries.

GitHub Pages serves the repository root on main. All local asset links remain relative for compatibility with `/My-Profile/`.

## Theme and CSS ownership
`style.css` supplies shared functional defaults and legacy redirect page styling. `neo.css` owns the current visual system, grouped by tokens, components, breakpoints and motion. There are no v1/v2 append-only overrides inside the theme. Obsolete carousel selectors have been removed.

Use `--accent` for theme-aware foreground text, and the paired `--highlight` / `--on-highlight` for filled highlights and buttons. Light mode uses dark green with white text. Contact intentionally keeps a lime surface in both modes, with scoped local tokens for the form, links and focus states. Derived border/shadow tokens are redeclared where the theme changes to avoid inherited resolved colors.

Responsive and visual QA: reviewed dark/light Hero, project previews and Contact at 375, 768, 1440 and 1920px. The contrast checks cover the selected text/control pairs, not a complete accessibility audit. Browser screenshots and the detailed QA report are local, ignored artifacts under `qa/`.

## Project categories
Personal Projects contains BKK Traffic Insight, Expense Tracker, EXMELLO and BKK Geospatial Intelligence. Team Projects contains CondoFlow, an interactive frontend prototype for ITDS262 Software Engineering Lab. CondoFlow descriptions, technologies and the documented Frontend Engineer & UI Architect role are based on its public repository README and package manifest. The supplied dashboard screenshot is stored locally. Both categories retain their headings and independent project controls.

`projects.js` initializes every `[data-project-carousel]` group with its own current slide, drag state, title picker and previous/next buttons. Inactive slides are inert for keyboard navigation. Resizing and reduced-motion changes retain each group's active project. Carousel styles are scoped to `.project-carousel` and shared by both categories.

Team Projects also includes STARBUCKS DB SYSTEM as the second article, an ITDS221 database-design project. Its description and concept badges follow the repository README: ER/EER modelling, relational mapping, 3NF and data dictionary. The supplied ER diagram is the local preview; no individual role or database engine has been inferred.

BKK Geospatial Intelligence is the fourth personal project. Its preview is the owner-supplied district-explorer screenshot; its descriptions and technology badges follow the repository README and dependency manifests. The live link preserves the supplied metric and ranking parameters.
