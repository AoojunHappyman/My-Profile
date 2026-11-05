# Pattanachai portfolio

Static HTML/CSS/JavaScript portfolio hosted on GitHub Pages. No build step or runtime dependencies. Serve the project with `python -m http.server 8000`.

## Structure
- `index.html`: portfolio content, projects, skills, biography, experience, education and contact.
- `style.css`: base layout and functional component styles.
- `neo.css`: editorial neo-brutalist tokens, composition, themes and responsive styles.
- `config.js`: mobile navigation, active section tracking, themes, image lightbox, email draft validation and print controls.
- `cv.html`: print-friendly resume source; PDF is linked from the navigation and Hero.
- `resume.html` and `contact.html`: existing redirect entry points.

Project presentation uses an asymmetric grid: the featured data project spans both columns, with secondary projects below. On mobile all projects stack in document order. All original project descriptions, skills and links are preserved. Images open in a keyboard-accessible dialog. The contact form prepares an email draft; it does not send or store messages.

Fonts are served locally. The design uses Inter and IBM Plex Sans Thai with monospace metadata, shared dark/light tokens, hard shadows and reduced-motion support. There are no external animation or component libraries.

GitHub Pages serves the repository root on main. All local asset links remain relative for compatibility with `/My-Profile/`.
