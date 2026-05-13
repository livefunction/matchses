import { test, expect } from '@playwright/test';

test.describe('MATCHS - Homepage', () => {
  test('homepage loads without errors', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MATCHS/);
    
    const header = page.locator('.header');
    await expect(header).toBeVisible();
    
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Experiences');
    await expect(page).toHaveURL(/\/experiences/);
    
    await page.click('text=Hosts');
    await expect(page).toHaveURL(/\/hosts/);
    
    await page.click('.logo');
    await expect(page).toHaveURL('/');
  });

  test('expert curated section is visible', async ({ page }) => {
    await page.goto('/');
    
    const curated = page.locator('.curated-section');
    await expect(curated).toBeVisible();
    
    const firstTimers = page.locator('#first-timers');
    await expect(firstTimers).toBeVisible();
  });

  test('quiz CTA is visible on homepage', async ({ page }) => {
    await page.goto('/');
    
    const quizCta = page.locator('.quiz-subtitle');
    await expect(quizCta).toBeVisible();
  });
});

test.describe('MATCHS - Experiences', () => {
  test('experiences page loads', async ({ page }) => {
    await page.goto('/experiences');
    await expect(page).toHaveTitle(/Experiences/);
    
    const experiencesGrid = page.locator('.experiences-grid');
    await expect(experiencesGrid).toBeVisible();
  });

  test('experience cards are displayed', async ({ page }) => {
    await page.goto('/experiences');
    
    const cards = page.locator('.experience-card');
    await expect(cards.first()).toBeVisible();
  });

  test('filters section is present', async ({ page }) => {
    await page.goto('/experiences');
    
    const filters = page.locator('.filters');
    await expect(filters).toBeVisible();
  });
});

test.describe('MATCHS - Individual Experience Pages', () => {
  test('Mt. Takao Food Tour page loads', async ({ page }) => {
    await page.goto('/experiences/mt-takao-food-tour');
    await expect(page).toHaveTitle(/Mt. Takao/);
    
    const hero = page.locator('.experience-hero');
    await expect(hero).toBeVisible();
    
    const bookingForm = page.locator('.booking-form');
    await expect(bookingForm).toBeVisible();
    
    const askGuideLink = page.locator('text=Have questions?');
    await expect(askGuideLink).toBeVisible();
  });

  test('Tachikawa Izakaya Night page loads', async ({ page }) => {
    await page.goto('/experiences/tachikawa-izakaya-night');
    await expect(page).toHaveTitle(/Tachikawa/);
    
    const hero = page.locator('.experience-hero');
    await expect(hero).toBeVisible();
  });

  test('Onsen Day Trip page loads', async ({ page }) => {
    await page.goto('/experiences/onsen-day-trip');
    await expect(page).toHaveTitle(/Onsen/);
    
    const hero = page.locator('.experience-hero');
    await expect(hero).toBeVisible();
  });
});

test.describe('MATCHS - Quiz Flow', () => {
  test('quiz page loads', async ({ page }) => {
    await page.goto('/quiz');
    await expect(page).toHaveTitle(/Find Your Perfect/);
    
    const quizCard = page.locator('.quiz-card');
    await expect(quizCard).toBeVisible();
  });

  test('quiz flow completes and shows result', async ({ page }) => {
    await page.goto('/quiz');
    
    await page.click('.option-btn:first-child');
    await page.waitForTimeout(300);
    
    await page.click('.option-btn:first-child');
    await page.waitForTimeout(300);
    
    await page.click('.option-btn:first-child');
    await page.waitForTimeout(500);
    
    const result = page.locator('.quiz-result');
    await expect(result).toBeVisible();
    
    const resultTitle = page.locator('.result-title');
    await expect(resultTitle).toBeVisible();
  });
});

test.describe('MATCHS - Ask Guide', () => {
  test('ask guide page loads', async ({ page }) => {
    await page.goto('/ask-guide');
    await expect(page).toHaveTitle(/Ask a Guide/);
    
    const guideCards = page.locator('.guide-card');
    await expect(guideCards.first()).toBeVisible();
  });

  test('guide selection changes profile', async ({ page }) => {
    await page.goto('/ask-guide');
    
    await page.click('.guide-card:nth-child(2)');
    
    const profile = page.locator('#guideProfile');
    await expect(profile).toBeVisible();
  });

  test('suggested questions work', async ({ page }) => {
    await page.goto('/ask-guide');
    
    await page.click('.suggested-btn:first-of-type');
    
    const textarea = page.locator('#message');
    await expect(textarea).toHaveValue(/what should I wear/i);
  });
});

test.describe('MATCHS - Hosts Page', () => {
  test('hosts page loads', async ({ page }) => {
    await page.goto('/hosts');
    await expect(page).toHaveTitle(/Meet Our Hosts/);
    
    const hostsGrid = page.locator('.hosts-grid');
    await expect(hostsGrid).toBeVisible();
  });

  test('host cards are displayed', async ({ page }) => {
    await page.goto('/hosts');
    
    const hostCards = page.locator('.host-card');
    await expect(hostCards.first()).toBeVisible();
  });

  test('ask guide link is visible', async ({ page }) => {
    await page.goto('/hosts');
    
    const askGuideLink = page.locator('.ask-guide-link');
    await expect(askGuideLink).toBeVisible();
  });
});

test.describe('MATCHS - Authentication', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Login/);
    
    const loginForm = page.locator('#loginForm');
    await expect(loginForm).toBeVisible();
  });

  test('login page has tabs', async ({ page }) => {
    await page.goto('/login');
    
    const travelerTab = page.locator('.auth-tab:first-child');
    const guideTab = page.locator('.auth-tab:nth-child(2)');
    await expect(travelerTab).toBeVisible();
    await expect(guideTab).toBeVisible();
  });

  test('guide tab changes form context', async ({ page }) => {
    await page.goto('/login');
    
    await page.click('text=I\'m a Guide');
    
    const title = page.locator('.auth-title');
    await expect(title).toHaveText('Guide Portal');
  });

  test('register page loads', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveTitle(/Sign Up/);
    
    const registerForm = page.locator('#registerForm');
    await expect(registerForm).toBeVisible();
  });

  test('register page has guide option', async ({ page }) => {
    await page.goto('/register');
    
    await page.click('text=I\'m a Guide');
    
    const experienceSelect = page.locator('#experience');
    await expect(experienceSelect).toBeVisible();
  });
});

test.describe('MATCHS - Dashboard', () => {
  test('dashboard page loads after login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'test@test.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard/);
    
    const calendar = page.locator('.calendar-container');
    await expect(calendar).toBeVisible();
  });
});

test.describe('MATCHS - Trust Section', () => {
  test('trust section is visible on homepage', async ({ page }) => {
    await page.goto('/');

    const trustSection = page.locator('.trust-section');
    await expect(trustSection).toBeVisible();
  });

  test('trust items are displayed', async ({ page }) => {
    await page.goto('/');

    const localExperts = page.locator('.trust-title').first();
    await expect(localExperts).toBeVisible();

    const freeCancellation = page.locator('.trust-item').nth(4);
    await expect(freeCancellation).toBeVisible();
  });
});

test.describe('MATCHS - Contact Page', () => {
  test('contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle(/Contact/);

    const contactSection = page.locator('.contact-section');
    await expect(contactSection).toBeVisible();

    const contactForm = page.locator('.contact-form');
    await expect(contactForm).toBeVisible();
  });

  test('contact info cards are displayed', async ({ page }) => {
    await page.goto('/contact');

    const emailCard = page.locator('text=hello@matchses.com');
    await expect(emailCard).toBeVisible();

    const locationCard = page.locator('text=Tokyo, Tama Region');
    await expect(locationCard).toBeVisible();
  });
});

test.describe('MATCHS - Terms Page', () => {
  test('terms page loads', async ({ page }) => {
    await page.goto('/terms');
    await expect(page).toHaveTitle(/Terms/);

    const contentSection = page.locator('.content-section');
    await expect(contentSection).toBeVisible();
  });

  test('terms content blocks are displayed', async ({ page }) => {
    await page.goto('/terms');

    const acceptanceBlock = page.locator('text=Acceptance of Terms');
    await expect(acceptanceBlock).toBeVisible();

    const privacyBlock = page.locator('h2');
    await expect(privacyBlock.first()).toBeVisible();
  });
});

test.describe('MATCHS - For Business Page', () => {
  test('for-business page loads', async ({ page }) => {
    await page.goto('/for-business');
    await expect(page).toHaveTitle(/Partner/);

    const benefitsSection = page.locator('.benefits-section');
    await expect(benefitsSection).toBeVisible();
  });

  test('benefit cards are displayed', async ({ page }) => {
    await page.goto('/for-business');

    const benefitsGrid = page.locator('.benefits-grid');
    await expect(benefitsGrid).toBeVisible();

    const firstBenefit = page.locator('.benefit-card').first();
    await expect(firstBenefit).toBeVisible();
  });

  test('CTA section has apply link', async ({ page }) => {
    await page.goto('/for-business');

    const applyButton = page.locator('.cta-section .btn-primary');
    await expect(applyButton).toBeVisible();
    await expect(applyButton).toHaveAttribute('href', '/contact');
  });
});

test.describe('MATCHS - Navigation Flow', () => {
  test('main navigation links work from homepage', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Experiences');
    await expect(page).toHaveURL(/\/experiences/);

    await page.goto('/');
    await page.click('text=Take the Quiz');
    await expect(page).toHaveURL(/\/quiz/);

    await page.goto('/experiences/mt-takao-food-tour');
    await page.click('text=Have questions?');
    await expect(page).toHaveURL(/\/ask-guide/);

    await page.goto('/');
    await page.click('text=Login');
    await expect(page).toHaveURL(/\/login/);
  });

  test('footer or secondary navigation to contact and terms', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Contact');
    await expect(page).toHaveURL(/\/contact/);

    await page.goto('/');
    await page.click('text=For Business');
    await expect(page).toHaveURL(/\/for-business/);
  });
});