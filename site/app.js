const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');

function closeMenu(restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const filters = document.querySelectorAll('[data-filter]');
const projects = document.querySelectorAll('[data-project]');
for (const filter of filters) {
  filter.addEventListener('click', () => {
    for (const button of filters) {
      button.classList.toggle('active', button === filter);
      button.setAttribute('aria-pressed', String(button === filter));
    }
    let count = 0;
    for (const project of projects) {
      project.hidden = filter.dataset.filter !== 'all' && filter.dataset.filter !== project.dataset.project;
      if (!project.hidden) count++;
    }
    document.querySelector('#filter-status').textContent = `Showing ${count} ${count === 1 ? 'project' : 'projects'}`;
  });
}

const caseStudies = {
  slotwise: `
    <h2 id="dialog-title" tabindex="-1">Slotwise — Playwright Quality Engineering Lab</h2>
    <p>A small booking product paired with a risk-based automation suite. Its purpose is to demonstrate how tests protect booking integrity and account ownership.</p>
    <img class="case-image" src="assets/slotwise.png" alt="Slotwise's booking screen with a confirmed appointment" width="1440" height="1286">
    <h3>The engineering question</h3>
    <p>What stops two accounts from booking the same coach at the same time? And can a user cancel someone else’s appointment through the API?</p>
    <h3>What the project demonstrates</h3>
    <ul><li>18 API checks and 6 browser checks, with isolated accounts and disposable databases.</li><li>Sequential and concurrent booking checks, authorization checks, and session revocation.</li><li>Axe accessibility scans, a keyboard check, and mobile layout checks.</li><li>Two test-only faults: removing booking uniqueness and removing cancellation ownership. The intended assertions detect both.</li><li>GitHub Actions configuration and retained failure traces; local execution is verified, a hosted CI run is not yet verified.</li></ul>
    <h3>The evidence</h3>
    <p>24 baseline tests passed locally with no skipped or flaky outcomes in the recorded run. Both seeded faults were detected. These are targeted experiments, not a complete security audit or mutation score.</p>
    <p class="case-status"><strong>Current status:</strong> Built and validated locally. Source publication is pending repository access. There is no public live app.</p>
    <p><strong>Stack:</strong> Playwright, TypeScript tests, Express, SQLite, Axe, GitHub Actions configuration.</p>
  `,
  library: `
    <h2 id="dialog-title" tabindex="-1">Library Management — Internship Project Restored</h2>
    <p>A Java Servlet/JSP project originally created during my internship, revisited with reproducible setup and clearer documentation.</p>
    <img class="case-image" src="assets/library.png" alt="Library Management listing fictional sample books" width="1280" height="720">
    <h3>The restoration</h3>
    <p>The supplied archive was compared with the existing source. A five-table development schema was reconstructed from the application’s SQL and database screenshots. Where the original schema was incomplete, assumptions were documented.</p>
    <h3>What was checked</h3>
    <ul><li>Compilation of seven Java servlets and startup with Tomcat and MySQL.</li><li>Login and all twelve JSP pages, including database-backed listings.</li><li>Book and reader creation, issuing with a 30-day due date, overdue listing, returns, and deletion.</li><li>Fresh database setup and repeatable startup through Docker Compose.</li></ul>
    <h3>What changed</h3>
    <p>Hardcoded database credentials and password logging were removed. Local configuration, an account-creation helper, setup instructions, and a functional smoke script were added.</p>
    <p class="case-status"><strong>Current status:</strong> Source published on GitHub; the full application runs locally. Original SQL concatenation, plaintext application passwords, and incomplete route authorization are documented limitations that need work before public deployment.</p>
    <a class="button button-primary" href="https://github.com/atharvaborade/Library-Management" target="_blank" rel="noopener noreferrer">View project source <span aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></span></a>
  `,
};
const dialog = document.querySelector('#project-dialog');
let dialogOpener = null;
for (const button of document.querySelectorAll('[data-case]')) {
  button.addEventListener('click', () => {
    dialogOpener = button;
    // Case-study HTML is static, authored content, never user input.
    document.querySelector('#dialog-content').innerHTML = caseStudies[button.dataset.case];
    dialog.showModal();
    document.body.classList.add('dialog-open');
    document.querySelector('#dialog-title').focus();
  });
}
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  dialogOpener?.focus();
});

let updatePending = false;
const progress = document.querySelector('.scroll-progress');
function updateProgress() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, window.scrollY / distance) : 0})`;
  updatePending = false;
}
window.addEventListener('scroll', () => {
  if (!updatePending) { window.requestAnimationFrame(updateProgress); updatePending = true; }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();
document.querySelector('#year').textContent = String(new Date().getFullYear());

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        for (const link of navigation.querySelectorAll('a')) {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        }
      }
    }
  }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });
  for (const section of document.querySelectorAll('main section[id]:not(#top)')) observer.observe(section);
}
