# Pattanachai portfolio

Dependency-free static website. Serve this directory with any static web server (for example `python -m http.server 8000`) and open index.html. Existing resume.html and contact.html addresses redirect to the appropriate portfolio location. No build step is required.

## Files
- index.html: portfolio content and metadata
- style.css: responsive layout, dark/light themes, reduced-motion styles
- config.js: mobile menu, theme preference, email draft validation, print controls
- cv.html: editable print-friendly resume
- Pattanachai-Sawetbunchoed-Resume.pdf: verified one-page downloadable resume; regenerate from cv.html after resume edits
- portrait.jpg: optimized derivative of the preserved original DSCF1476.JPG

## Content still needed
GitHub profile: https://github.com/AoojunHappyman (provided by the owner). Expense Tracker demo: https://expense-tracker-sg.onrender.com/. The LinkedIn URL and Expense Tracker repository URL are still needed. Visible pending labels deliberately replace generic homepages and localhost links. No graduation date, responsibilities, statistics, or additional experience were invented.

The contact form validates inputs and opens a mailto draft. It does not send messages or store submissions. A configured email client is required; the direct email link remains available.


## Verification
Browser checks at widths 320, 390, 768, 1024 and 1440: no horizontal overflow. Checked mobile menu, Escape closure logic, project details, saved theme, whitespace validation, contact redirect, and JavaScript console. PDF rendered and visually checked. No external fonts, icon libraries, JavaScript packages, or analytics are loaded by the website.

Before public release, supply the missing profile and project links. Add absolute Open Graph image and canonical URLs when the final hosting address is known. Published at https://aoojunhappyman.github.io/My-Profile/ through GitHub Pages (main branch).


