import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const accessibilityTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function expectAccessible(page) {
  const result = await new AxeBuilder({ page }).withTags(accessibilityTags).analyze();
  expect(result.violations).toEqual([]);
}

test('desktop introduces the engineer and exposes both project case studies', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Testing beyond the happy path.' })).toBeVisible();
  await expect(page.locator('#primary-nav')).toBeVisible();
  await expect(page.locator('article[data-project]:visible')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Explore Slotwise', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Explore Library Management', exact: true })).toBeVisible();
});

test('project filters show the requested discipline and restore all projects', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Quality engineering', exact: true }).click();
  await expect(page.locator('article[data-project]:visible')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Explore Slotwise', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Explore Library Management', exact: true })).toBeHidden();

  await page.getByRole('button', { name: 'Java & SQL', exact: true }).click();
  await expect(page.locator('article[data-project]:visible')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Explore Library Management', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Explore Slotwise', exact: true })).toBeHidden();

  await page.getByRole('button', { name: 'All projects', exact: true }).click();
  await expect(page.locator('article[data-project]:visible')).toHaveCount(2);
});

test('case studies open the selected project and return focus after closing', async ({ page }) => {
  await page.goto('/');
  const dialog = page.locator('#project-dialog');
  const slotwise = page.getByRole('button', { name: 'Explore Slotwise', exact: true });
  await slotwise.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Slotwise — Playwright Quality Engineering Lab', exact: true })).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'View project source', exact: true })).toHaveAttribute('href', 'https://github.com/atharvaborade/playwright-quality-lab');
  await expect(dialog.locator('.case-status')).toContainText('Source published on GitHub');
  await dialog.getByRole('button', { name: 'Close case study', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(slotwise).toBeFocused();

  const library = page.getByRole('button', { name: 'Explore Library Management', exact: true });
  await library.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Library Management — Internship Project Restored', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(library).toBeFocused();
});

test('mobile navigation opens, closes with Escape, and closes after choosing a link', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const navigation = page.locator('#primary-nav');
  const open = page.getByRole('button', { name: 'Open navigation', exact: true });
  await expect(navigation).toBeHidden();
  await open.click();
  await expect(page.getByRole('button', { name: 'Close navigation', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(navigation).toBeHidden();
  await expect(open).toHaveAttribute('aria-expanded', 'false');
  await expect(open).toBeFocused();

  await open.click();
  await navigation.getByRole('link').first().click();
  await expect(navigation).toBeHidden();
  await expect(open).toHaveAttribute('aria-expanded', 'false');
});

test('narrow phone layouts remain readable without horizontal scrolling', async ({ page }) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Explore Slotwise', exact: true })).toBeVisible();
    const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(fits, `Portfolio must fit a ${width}px viewport`).toBe(true);
  }
});

test('desktop page has no detected WCAG A/AA accessibility violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expectAccessible(page);
});

test('open project dialog has no detected WCAG A/AA accessibility violations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Explore Slotwise', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expectAccessible(page);
});

test('reduced-motion preference keeps content available and avoids smooth scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Testing beyond the happy path.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Explore Slotwise', exact: true })).toBeVisible();
  const motion = await page.evaluate(() => ({
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  expect(motion).toEqual({ reduced: true, scrollBehavior: 'auto' });
});

test('resume experience and education are visible without publishing private contact files', async ({ page }) => {
  await page.goto('/');
  const experience = page.locator('#experience');
  await expect(experience.getByRole('heading', { name: 'Senior Executive — Automation QA Engineer', exact: true })).toBeVisible();
  await expect(experience).toContainText('VOIS');
  await expect(experience.getByRole('heading', { name: 'Software Developer', exact: true })).toBeVisible();
  await expect(experience).toContainText(/NEBULA TECHNOLOGY/i);
  await expect(experience.getByRole('heading', { name: 'B.E. in Computer Engineering', exact: true })).toBeVisible();
  await expect(experience).toContainText('SKN Sinhgad Institute of Technology and Science');
  await expect(page.locator('a[href^="tel:"], a[href^="mailto:"], a[href$=".pdf" i], iframe[src*=".pdf" i], embed[src*=".pdf" i], object[data*=".pdf" i]')).toHaveCount(0);
});
