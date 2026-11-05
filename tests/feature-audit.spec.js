import { test, expect } from '@playwright/test';

const externalDestinations = [
  'https://github.com/atharvaborade',
  'https://www.linkedin.com/in/atharva-borade/',
  'https://github.com/atharvaborade/Library-Management',
];

test('all links have a real section or configured external destination', async ({ page }) => {
  await page.goto('/');
  const checkLinks = async () => {
    const invalid = await page.locator('a').evaluateAll(links => links.flatMap(link => {
      const href = link.getAttribute('href');
      if (!link.textContent.trim() && !link.getAttribute('aria-label')) return ['Unlabelled link'];
      if (!href || href === '#' || /^(javascript:|about:blank)/i.test(href)) return [`Empty link: ${link.textContent}`];
      if (href.startsWith('#') && !document.getElementById(href.slice(1))) return [`Missing section: ${href}`];
      return [];
    }));
    expect(invalid).toEqual([]);
    for (const link of await page.locator('a[href^="https:"]').all()) {
      expect(externalDestinations).toContain(await link.getAttribute('href'));
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  };
  await checkLinks();
  for (const name of ['Explore Slotwise', 'Explore Library Management']) {
    await page.getByRole('button', {name, exact:true}).click();
    await checkLinks();
    await page.getByRole('button', {name:'Close case study',exact:true}).click();
  }
});

test('every button has a label and a covered action instead of a placeholder', async ({ page }) => {
  await page.goto('/');
  const inventory = await page.locator('button').evaluateAll(buttons => buttons.map(button => ({
    name: button.getAttribute('aria-label') || button.textContent.trim(),
    disabled: button.disabled,
  })));
  expect(inventory.map(button => button.name).sort()).toEqual([
    'Open navigation','All projects','Quality engineering','Java & SQL',
    'Explore Slotwise','Explore Library Management','Close case study',
  ].sort());
  expect(inventory.every(button => !button.disabled)).toBe(true);
});

test('every main navigation link and page CTA scrolls to its real content', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const links = page.locator('#primary-nav a');
  for (let index=0; index<await links.count(); index++) {
    const link=links.nth(index);
    const destination=await link.getAttribute('href');
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${destination}$`));
    await expect(page.locator(destination)).toBeInViewport();
    expect(await page.locator(destination).boundingBox().then(box => box.y)).toBeGreaterThanOrEqual(80);
  }
  await page.getByRole('link',{name:'Back to top',exact:true}).click();
  await expect(page.locator('#hero-title')).toBeInViewport();
  await page.getByRole('link',{name:'Explore my work',exact:true}).click();
  await expect(page.locator('#work')).toBeInViewport();
  await page.locator('.wordmark').click();
  await expect(page.locator('#hero-title')).toBeInViewport();
  await page.getByRole('link',{name:'SCROLL TO EXPLORE',exact:true}).click();
  await expect(page.locator('#about')).toBeInViewport();
});

test('all local styles, scripts, icons and case-study images load without runtime errors', async ({ page, request }) => {
  const errors=[];
  const badResponses=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)badResponses.push(`${response.status()} ${response.url()}`);});
  await page.goto('/');
  const resources=await page.locator('link[href],script[src],img[src]').evaluateAll(elements => elements.map(element => element.href || element.src));
  for (const resource of [...new Set(resources)]) expect((await request.get(resource)).ok(),resource).toBe(true);
  await page.locator('img').evaluateAll(images=>images.forEach(image=>image.loading='eager'));
  await expect.poll(()=>page.locator('img').evaluateAll(images=>images.every(image=>image.complete && image.naturalWidth>0))).toBe(true);
  for(const name of ['Explore Slotwise','Explore Library Management']) {
    await page.getByRole('button',{name,exact:true}).click();
    const image=page.locator('#project-dialog img');
    await expect.poll(()=>image.evaluate(image=>image.complete && image.naturalWidth>0)).toBe(true);
    await page.keyboard.press('Escape');
  }
  expect(errors).toEqual([]); expect(badResponses).toEqual([]);
});

test('project filters update their pressed state and screen-reader announcement', async ({ page }) => {
  await page.goto('/');
  for (const [name,count] of [['Quality engineering',1],['Java & SQL',1],['All projects',2]]) {
    const button=page.getByRole('button',{name,exact:true}); await button.click();
    await expect(button).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('.filter[aria-pressed="true"]')).toHaveCount(1);
    await expect(page.locator('#filter-status')).toHaveText(`Showing ${count} ${count===1?'project':'projects'}`);
  }
});

test('dialogs contain keyboard focus and close from the backdrop after reading content', async ({ page }) => {
  await page.goto('/');
  const opener=page.getByRole('button',{name:'Explore Library Management',exact:true});
  await opener.click();
  const source=page.getByRole('link',{name:'View project source',exact:true});
  await source.focus(); await page.keyboard.press('Tab');
  await expect(page.getByRole('button',{name:'Close case study',exact:true})).toBeFocused();
  await expect(page.locator('body')).toHaveClass('dialog-open');
  await page.mouse.click(5,5);
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(page.locator('body')).not.toHaveClass('dialog-open');
});

test('phone navigation moves keyboard focus to the selected section', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'}); await page.goto('/');
  await page.getByRole('button',{name:'Open navigation'}).click();
  await page.locator('#primary-nav').getByRole('link',{name:'Experience',exact:true}).click();
  await expect(page.locator('#primary-nav')).toBeHidden();
  await expect(page.locator('#experience-title')).toBeFocused();
  await expect(page.locator('#experience-title')).toBeInViewport();
});

test('navigation recovers across phone and desktop sizes and closes on outside clicks', async ({ page }) => {
  await page.setViewportSize({width:390,height:844}); await page.goto('/');
  await page.getByRole('button',{name:'Open navigation'}).click();
  await page.setViewportSize({width:1280,height:900});
  await expect(page.locator('#primary-nav')).toBeVisible();
  await page.setViewportSize({width:390,height:844});
  await expect(page.locator('#primary-nav')).toBeHidden();
  await page.getByRole('button',{name:'Open navigation'}).click();
  await page.locator('.hero-description').click();
  await expect(page.locator('#primary-nav')).toBeHidden();
});

test('GitHub and LinkedIn buttons open their configured destination in a new tab', async ({ page, context }) => {
  // Intercept third-party responses to test our links without depending on login walls or bot policies.
  await context.route('https://github.com/**', route=>route.fulfill({status:200,contentType:'text/html',body:'<title>External target</title>'}));
  await context.route('https://www.linkedin.com/**', route=>route.fulfill({status:200,contentType:'text/html',body:'<title>External target</title>'}));
  await page.goto('/');
  const checkPopup=async(link)=>{
    const destination=await link.getAttribute('href');
    const popupPromise=page.waitForEvent('popup');
    await link.click();
    const popup=await popupPromise;
    await expect(popup).toHaveURL(destination);
    await popup.close();
  };
  for(const link of await page.locator('a[href^="https:"]:visible').all()) await checkPopup(link);
  await page.getByRole('button',{name:'Explore Library Management',exact:true}).click();
  await checkPopup(page.getByRole('link',{name:'View project source',exact:true}));
});

test('scroll entrances finish with visible content and respect reduced-motion changes', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'no-preference'}); await page.goto('/');
  const panel=page.locator('.about-grid > div').first();
  await panel.scrollIntoViewIfNeeded();
  await expect(panel).toHaveClass(/is-revealed/);
  await expect.poll(()=>panel.evaluate(element=>getComputedStyle(element).animationName)).toBe('reveal-in');
  await panel.evaluate(element=>Promise.all(element.getAnimations().map(animation=>animation.finished)));
  await expect(panel).toHaveCSS('opacity','1');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(panel).toHaveCSS('animation-name','none');
  await expect(page.locator('.orbit-one')).toHaveCSS('animation-name','none');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior','auto');
  await expect(panel).toBeVisible();
});
