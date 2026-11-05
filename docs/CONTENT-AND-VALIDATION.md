# Content and validation notes

## Sources

- Display name/GitHub identity: Atharva Borade / atharvaborade. Full name in supplied résumé: Atharva Navnath Borade.
- Role/experience: supplied résumé lists Senior Executive – Automation QA Engineer at VOIS, August2023–Present; displayed as Automation QA Engineer with3+ years. Earlier role: Software Developer at Nebula Technology, December2021–April2022.
- Tools: résumé lists Cypress, Playwright, JavaScript, Java, SQL, Postman, MySQL, Oracle, Git, Maven, CI/CD, Jira, Confluence, Power Apps, Power Automate, Power BI, JDBC, Spring and Hibernate.
- Education: B.E. Computer Engineering, SKN Sinhgad Institute of Technology and Science,2019–2022, Pune.
- Career metrics:300+ automated regression cases and execution time reduced from5hours to2hours, as reported in the résumé. These are the user's professional claims, separate from locally verified portfolio test results.
- LinkedIn: user supplied `https://www.linkedin.com/in/atharva-borade/`.
- Slotwise evidence: locally recorded24 passing checks (18 API,6 browser),2 targeted seeded defects detected. Source publishing and hosted CI execution are not yet verified.
- Library Management evidence: previously pushed restoration;7 servlets compiled,12 JSP pages checked,5-table reconstruction and functional smoke workflow. No public application hosting claim.

A résumé was supplied for professional details. Its original PDF, personal phone number and email address are intentionally not copied into the public site. LinkedIn is the contact route. Employer work is summarised without employer source code or internal project identifiers. No portrait or certification was provided. The reel is only an aesthetic reference.

## Validation

Expanded local browser suite:19 tests passed using system Chromium and2 workers after a hero-text contrast correction. The axe rules were retained; the contrast defect was fixed in the site. Mobile widths320px and390px fit without horizontal overflow. Dialogs support Escape and return focus to their opener. Reduced-motion preference disables smooth scrolling and animation.

Desktop and mobile screenshots are in `docs/previews/`. Small arrow icons are inline SVG to avoid missing-font glyphs. The portfolio was pushed to atharvaborade/atharvaborade.github.io and the GitHub-hosted test/deployment workflow succeeded for commit322f2e4. Verified run: https://github.com/atharvaborade/atharvaborade.github.io/actions/runs/42108093054. The live domain is blocked by the development environment network, so public-site HTTP responses were not independently inspected. Set Pages source to GitHub Actions to avoid competing branch-based publishing.

Full accessibility certification, screen-reader review and Firefox/WebKit testing are outside these automated checks.

## Follow-up feature audit

The interaction audit added checks for all links/buttons, loaded assets, runtime errors, every section target, filter announcements, external new-tab navigation, menu resizing, dialog keyboard cycles and backdrop dismissal. Mobile destination focus was made explicit, dialog Tab cycling was made consistent, and decorative toolkit arrows were removed. See FEATURE-AUDIT.md. README screenshots were regenerated after the visible UI change.

Scroll entrances and staggered project-card motion were added on request, with reduced-motion support and a content-visible fallback. The suite also checks that animation ends with readable content.
