# Portfolio feature audit

The local audit completed with **19 passing tests**, no skipped tests and no retries. It uses system Chromium and two workers. The same suite is configured to run against the published website after deployment; check the latest Actions run and `portfolio-live-audit` artifact for that result.

## Controls checked

| Feature | What was checked |
|---|---|
| Header, hero and footer links | Every fragment points to a real section; links scroll to readable content; back-to-top and brand links work |
| Mobile menu | Open/close, Escape, outside click, selecting a section, desktop/phone resizing and destination focus |
| Project filters | All/quality/Java selections show the correct cards, pressed state and announcement |
| Case-study buttons | Both open the matching content; Close, Escape and backdrop click dismiss it; focus returns to the opener |
| Dialog keyboard use | Tab cycles through its actions, including after reading its final link; body scrolling is restored when closed |
| Contact/source links | Visible CTAs open the configured LinkedIn, GitHub profile or Library Management repository in a new tab |
| Local assets | Stylesheet, script, favicon and both project images load; case-study images decode; no uncaught browser error or HTTP failure |
| Scroll motion | One-time section reveals and staggered project entrances finish at full opacity; reduced-motion preferences disable scroll/orbit effects |
| Layout and accessibility |320/390px widths fit; desktop/dialog axe scans pass; reduced motion and résumé/contact privacy checks pass |

The complete button inventory is checked against the interactive tests. There are no empty links, `href="#"` placeholders, blank action labels, disabled dummy buttons or fake contact forms.

## Changes made

- Removed decorative up-right arrows on toolkit rows that could appear to be inactive links.
- Added explicit destination focus when the mobile menu navigates to a section.
- Made dialog Tab cycling deterministic and kept Escape/backdrop/return-focus behaviour.
- Added post-deployment browser validation against the actual public URL.
- Updated desktop, mobile and README preview images after the UI changes.

## Scope of external-link validation

New-tab tests intercept third-party responses so bot policies and login walls do not make the portfolio tests unreliable. They verify the actual click and destination URL, not the contents of LinkedIn or GitHub. Separate read-only requests confirmed HTTP200 for the GitHub profile and Library Management repository. The LinkedIn destination is the exact URL supplied by the user; LinkedIn may require visitors to sign in.

Slotwise's source is published and linked from its case study. Both case studies expose working project-source links, verified by the navigation tests. The full Slotwise booking service runs locally; no nonfunctional “Live demo” button is shown.

This is a Chromium interaction/accessibility audit, not exhaustive browser compatibility or full accessibility certification.
