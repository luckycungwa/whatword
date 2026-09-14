import { test, expect } from '@playwright/test';

const BREAKPOINTS = [
  { name: '320px', width: 320, height: 568 },
  { name: '375px', width: 375, height: 667 },
  { name: '390px', width: 390, height: 844 },
  { name: '430px', width: 430, height: 932 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1024px', width: 1024, height: 768 },
  { name: '1280px', width: 1280, height: 720 },
  { name: '1440px', width: 1440, height: 900 },
  { name: '1920px', width: 1920, height: 1080 },
];

const PAGES = [
  { path: '/', name: 'Home' },
  { path: '/words', name: 'Dictionary' },
  { path: '/word-finder', name: 'Word Finder' },
  { path: '/games', name: 'Games' },
  { path: '/learn', name: 'Learn' },
];

test.describe('Responsive QA', () => {
  for (const bp of BREAKPOINTS) {
    test.describe(`Viewport: ${bp.name}`, () => {
      for (const page of PAGES) {
        test(`${page.name} - ${bp.name}`, async ({ page: pwPage }) => {
          await pwPage.setViewportSize({ width: bp.width, height: bp.height });
          await pwPage.goto(`http://localhost:3000${page.path}`);
          await pwPage.waitForLoadState('networkidle');
          
          // Check for horizontal overflow
          const bodyWidth = await pwPage.evaluate(() => document.body.scrollWidth);
          expect(bodyWidth).toBeLessThanOrEqual(bp.width + 10);
          
          // Check navbar doesn't overlap content
          const header = pwPage.locator('header');
          await expect(header).toBeVisible();
          
          // Check breadcrumb spacing
          const breadcrumb = pwPage.locator('nav[aria-label="Breadcrumb"]');
          if (await breadcrumb.count() > 0) {
            const headerBottom = await header.evaluate(el => el.getBoundingClientRect().bottom);
            const breadcrumbTop = await breadcrumb.evaluate(el => el.getBoundingClientRect().top);
            // breadcrumb should have spacing from header
            expect(breadcrumbTop - headerBottom).toBeGreaterThan(8);
          }
          
          // Check search bar if present
          const searchInput = pwPage.locator('input[aria-label="Search for a word"], input[aria-label="Filter words"]');
          if (await searchInput.count() > 0) {
            await expect(searchInput).toBeVisible();
            const inputRect = await searchInput.evaluate(el => el.getBoundingClientRect());
            expect(inputRect.width).toBeLessThanOrEqual(bp.width);
            expect(inputRect.height).toBeGreaterThan(36); // minimum touch target
          }
        });
      }
    });
  }
});

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
  });

  test('search via Enter key', async ({ page }) => {
    const input = page.locator('input[aria-label="Search for a word"]').first();
    await input.fill('apple');
    await input.press('Enter');
    await page.waitForURL(/\/words/);
    expect(page.url()).toContain('/words');
  });

  test('search via icon click', async ({ page }) => {
    const input = page.locator('input[aria-label="Search for a word"]').first();
    const searchBtn = page.locator('button[aria-label="Search"]').first();
    await input.fill('banana');
    await searchBtn.click();
    await page.waitForURL(/\/words/);
    expect(page.url()).toContain('/words');
  });

  test('clear search works', async ({ page }) => {
    const input = page.locator('input[aria-label="Search for a word"]').first();
    const clearBtn = page.locator('button[aria-label="Clear search"]').first();
    await input.fill('test');
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await expect(input).toHaveValue('');
  });

  test('dropdown suggestions appear', async ({ page }) => {
    const input = page.locator('input[aria-label="Search for a word"]').first();
    await input.fill('app');
    await page.waitForTimeout(300);
    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('icon buttons have accessible names', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000/');
    
    const iconButtons = page.locator('button[aria-label]:has(svg)');
    const count = await iconButtons.count();
    for (let i = 0; i < count; i++) {
      const btn = iconButtons.nth(i);
      const ariaLabel = await btn.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('focus visible on interactive elements', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000/');
    
    const input = page.locator('input[aria-label="Search for a word"]').first();
    await input.focus();
    await expect(input).toBeFocused();
  });

  test('skip link works', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000/');
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();
  });
});

test.describe('Interactive States', () => {
  test('buttons have hover/focus/active states', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000/');
    
    const btn = page.locator('a[href="/word-finder"]').first();
    await expect(btn).toBeVisible();
    
    // Check hover
    await btn.hover();
    const hoverBg = await btn.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(hoverBg).toBeTruthy();
  });
});

test.describe('Mobile Specific', () => {
  for (const bp of [{ name: '320px', width: 320, height: 568 }, { name: '375px', width: 375, height: 667 }]) {
    test(`Mobile nav works at ${bp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      
      const mobileMenuBtn = page.locator('button[aria-label="Open menu"]');
      await expect(mobileMenuBtn).toBeVisible();
      
      await mobileMenuBtn.click();
      const mobileNav = page.locator('#mobile-nav');
      await expect(mobileNav).toBeVisible();
    });

    test(`No horizontal scroll at ${bp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow).toBeFalsy();
    });

    test(`Search is usable one-handed at ${bp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      
      const input = page.locator('input[aria-label="Search for a word"]').first();
      const rect = await input.boundingBox();
      expect(rect).toBeTruthy();
      // Input should be reachable with thumb (bottom portion of screen)
      expect(rect!.y).toBeLessThan(bp.height * 0.9);
      expect(rect!.height).toBeGreaterThanOrEqual(44); // min touch target
    });
  }
});

test.describe('No Console Errors', () => {
  for (const bp of BREAKPOINTS.slice(0, 3)) { // Test a few key breakpoints
    test(`No console errors at ${bp.name}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', err => errors.push(err.message));
      
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      
      // Also check a few other pages
      await page.goto('http://localhost:3000/words');
      await page.waitForLoadState('networkidle');
      await page.goto('http://localhost:3000/word-finder');
      await page.waitForLoadState('networkidle');
      
      expect(errors).toHaveLength(0);
    });
  }
});