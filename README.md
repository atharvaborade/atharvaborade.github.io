# Atharva Borade · Portfolio

A responsive portfolio for an automation test engineer. Inspired by the uploaded reel's dark canvas, red accents and oversized type, with original copy and a quality engineering focus.

- Introduction and professional background
- Two project case studies with real screenshots and scoped evidence
- Project filters, accessible dialogs and mobile navigation
- Confirmed LinkedIn profile and GitHub links
- Reduced-motion support and local assets/fonts
- Static deployment: no database, paid hosting, API keys or contact-form service required

![Current desktop portfolio preview](docs/previews/desktop-hero.png)

[Full desktop preview](docs/previews/desktop.png) · [Phone preview](docs/previews/mobile.png)

## Preview

Open `site/index.html` directly in a browser, or install Node.js22+ and run:

```sh
npm ci
npm start
```

Open `http://localhost:4173` on your computer. The server serves only `site/`; dependencies are needed for the local server/tests, not for the published webpage.

## Checks

```sh
npx playwright install chromium
npm test
```

Linux may require `npx playwright install --with-deps chromium`. A compatible system Chromium can be selected using `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

19 browser checks cover every button and link destination, section navigation, loaded assets and runtime errors, project filters, case-study dialogs, keyboard focus, mobile resizing, external new-tab navigation, résumé content/privacy, scroll entrances, reduced motion, and desktop/dialog axe accessibility scans. Automated scans are partial evidence, not complete WCAG certification. Reports and failure traces are generated under ignored `playwright-report/` and `test-results/`.

Regenerate the previews with `npm run preview:capture`. This uses port4174. Local checks and screenshots were made with system Chromium. The initial workflow passed on GitHub-hosted runners and deployed the portfolio successfully: [initial verified run](https://github.com/atharvaborade/atharvaborade.github.io/actions/runs/42108093054).

## Host free on GitHub Pages

1. Create a public repository named `atharvaborade.github.io` under `atharvaborade` (or use another public repository for a project URL).
2. Push these source files to its `main` branch. Keep the folder structure; the workflow publishes the contents of `site/`, not the repository root.
3. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
4. In **Actions**, allow the “Portfolio checks and Pages” workflow to finish. It runs the tests before deploying.
5. Use the actual URL reported by the deployment. For the correctly named account repository, the expected address is `https://atharvaborade.github.io/`.

GitHub has confirmed a successful deployment to that address. Keep Pages → Source set to GitHub Actions so the tested portfolio workflow controls future updates. Direct requests to the live domain are blocked by the development environment's network policy; deployment status was verified on GitHub. All assets use relative paths, so deployment under another repository path also works. Do not upload this repository's ZIP as a single file and expect GitHub to extract it automatically.

## Feature audit

[Audit coverage and limits](docs/FEATURE-AUDIT.md). The workflow now repeats the browser suite against the actual public URL after deployment. Live reports are uploaded as `portfolio-live-audit`; this is separate from local-server validation.

## Content updates

- Edit `site/index.html` for page copy, personal details, links and project cards.
- Edit `site/app.js` for the case-study content.
- Edit `site/styles.css` for visual styling.
- Put public images/documents in `site/assets/` and use relative links.
- After any visible UI change, run `npm run preview:capture` and commit the updated desktop/phone images alongside the change so README previews stay current.

Current content is based on the supplied résumé, the confirmed LinkedIn URL, and the recorded portfolio-project evidence. It includes the VOIS and Nebula Technology roles, degree, relevant tools, and résumé-reported career results. The original PDF, personal email, and phone number are not part of the published site. There is no portrait, fabricated certification, employer source code, or invented project outcome.

Library Management source was published previously; its full app runs locally. Slotwise was built and validated locally, but source publication remains pending repository access. Neither card claims a public live application.

The supplied reel is a visual reference only. Its creator's identity, photographs, project claims and assets are not reused.
