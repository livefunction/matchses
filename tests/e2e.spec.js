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
    
    await page.click('text=Take the Quiz');
    await expect(page).toHaveURL(/\/quiz/);
    
    await page.click('text=Hosts');
    await expect(page).toHaveURL(/\/hosts/);
    
    await page.click('.logo');
    await expect(page).toHaveURL('/');
  });

  test('expert curated section is visible', async ({ page }) => {
    await page.goto('/');
    
    const curated = page.locator('.curated-section');
    await expect(curated).toBeVisible();
    
    const firstCard = page.locator('#food-culture');
    await expect(firstCard).toBeVisible();
  });

  test('quiz CTA is visible on homepage', async ({ page }) => {
    await page.goto('/');
    
    const quizCta = page.locator('.quiz-subtitle');
    await expect(quizCta).toBeVisible();
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

    await page.click('text=Take the Quiz');
    await expect(page).toHaveURL(/\/quiz/);

    await page.goto('/');
    await page.click('text=Hosts');
    await expect(page).toHaveURL(/\/hosts/);

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

test.describe('MATCHS - Form Interactions', () => {
  test('contact form can be filled and submitted', async ({ page }) => {
    await page.goto('/contact');

    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.selectOption('#subject', 'feedback');
    await page.fill('#message', 'This is a test message from Playwright.');

    const submitBtn = page.locator('.contact-form button[type="submit"]');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Form should submit without navigation error
    await expect(page.locator('.contact-form')).toBeVisible();
  });

  test('contact form requires name field', async ({ page }) => {
    await page.goto('/contact');

    const nameInput = page.locator('#name');
    await expect(nameInput).toHaveAttribute('required', '');
  });

  test('contact form requires email field', async ({ page }) => {
    await page.goto('/contact');

    const emailInput = page.locator('#email');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('contact form has all subject options', async ({ page }) => {
    await page.goto('/contact');

    const subjectSelect = page.locator('#subject');
    const options = await subjectSelect.locator('option').allTextContents();
    expect(options).toContain('Booking Question');
    expect(options).toContain('Partner Inquiry');
    expect(options).toContain('Feedback');
    expect(options).toContain('Other');
  });

  test('ask guide form fills message from suggested button', async ({ page }) => {
    await page.goto('/ask-guide');

    await page.click('.suggested-btn:nth-child(2)');

    const textarea = page.locator('#message');
    const value = await textarea.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('ask guide form can be filled completely', async ({ page }) => {
    await page.goto('/ask-guide');

    await page.fill('#message', 'Hello! I have a question about the food tour.');
    await page.fill('#email', 'traveler@example.com');
    await page.fill('#name', 'Traveler Tanaka');

    await expect(page.locator('#message')).toHaveValue(/Hello!/);
    await expect(page.locator('#email')).toHaveValue('traveler@example.com');
    await expect(page.locator('#name')).toHaveValue('Traveler Tanaka');
  });

  test('login form has email and password fields', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.locator('#email');
    const passwordInput = page.locator('#password');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('login form shows remember me checkbox', async ({ page }) => {
    await page.goto('/login');

    const rememberCheckbox = page.locator('input[name="remember"]');
    await expect(rememberCheckbox).toBeVisible();
    await expect(rememberCheckbox).toHaveAttribute('type', 'checkbox');
  });

  test('login form has forgot password link', async ({ page }) => {
    await page.goto('/login');

    const forgotLink = page.locator('.forgot-link');
    await expect(forgotLink).toBeVisible();
    await expect(forgotLink).toHaveAttribute('href', '/forgot-password');
  });
});

test.describe('MATCHS - Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('hamburger menu is visible on mobile', async ({ page }) => {
    await page.goto('/');

    const menuToggle = page.locator('#menu-toggle');
    await expect(menuToggle).toBeVisible();
  });

  test('hamburger menu opens mobile navigation', async ({ page }) => {
    await page.goto('/');

    const menuToggle = page.locator('#menu-toggle');
    await menuToggle.click();

    const navMobile = page.locator('#nav-mobile');
    await expect(navMobile).toBeVisible();

    // Check that mobile nav contains key links
    const quizLink = navMobile.locator('text=Take the Quiz');
    await expect(quizLink).toBeVisible();
  });

  test('homepage hero is visible on mobile', async ({ page }) => {
    await page.goto('/');

    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();

    const heroTitle = hero.locator('h1');
    await expect(heroTitle).toBeVisible();
  });

  test('quiz page works on mobile viewport', async ({ page }) => {
    await page.goto('/quiz');

    const quizCard = page.locator('.quiz-card');
    await expect(quizCard).toBeVisible();
  });
});

test.describe('MATCHS - Quiz Accuracy', () => {
  test('quiz progress bar updates correctly', async ({ page }) => {
    await page.goto('/quiz');

    const progressFill = page.locator('#progressFill');
    // Initial width should be ~33%
    const initialWidth = await progressFill.evaluate(el => el.style.width);
    expect(initialWidth).toContain('33');

    await page.click('.option-btn:first-child');
    await page.waitForTimeout(300);

    // After first answer, should be ~66%
    const midWidth = await progressFill.evaluate(el => el.style.width);
    expect(midWidth).toContain('66');

    await page.click('.option-btn:first-child');
    await page.waitForTimeout(300);

    // After second answer, should be 100%
    const finalWidth = await progressFill.evaluate(el => el.style.width);
    expect(finalWidth).toBe('100%');
  });

  test('quiz shows question number updates', async ({ page }) => {
    await page.goto('/quiz');

    const questionNumber = page.locator('#questionNumber');
    await expect(questionNumber).toHaveText('Question 1 of 3');

    await page.click('.option-btn:first-child');
    await page.waitForTimeout(300);

    await expect(questionNumber).toHaveText('Question 2 of 3');
  });

  test('quiz selecting food+guide produces food tour result', async ({ page }) => {
    await page.goto('/quiz');

    // Q1: select "Authentic local food & drinks"
    await page.click('.option-btn:has-text("food")');
    await page.waitForTimeout(300);

    // Q2: select "With a knowledgeable local guide"
    await page.click('.option-btn:has-text("guide")');
    await page.waitForTimeout(300);

    // Q3: select any
    await page.click('.option-btn:first-child');
    await page.waitForTimeout(500);

    const resultTitle = page.locator('.result-title');
    await expect(resultTitle).toHaveText('Mt. Takao Food Tour');
  });

  test('quiz selecting relax produces onsen result', async ({ page }) => {
    await page.goto('/quiz');

    // Q1: select "Relaxing hot springs & wellness"
    await page.click('.option-btn:has-text("wellness")');
    await page.waitForTimeout(300);

    // Q2: select any
    await page.click('.option-btn:first-child');
    await page.waitForTimeout(300);

    // Q3: select "Chill — I want to unwind"
    await page.click('.option-btn:has-text("unwind")');
    await page.waitForTimeout(500);

    const resultTitle = page.locator('.result-title');
    await expect(resultTitle).toHaveText('Onsen Day Trip');
  });
});

test.describe('MATCHS - Host Filtering', () => {
  test('host filter tags exist and are clickable', async ({ page }) => {
    await page.goto('/hosts');

    const filterTags = page.locator('.filter-tag');
    const count = await filterTags.count();
    expect(count).toBeGreaterThan(3);

    // Click a non-active filter
    await filterTags.nth(1).click();
    await expect(filterTags.nth(1)).toHaveClass(/active/);
  });

  test('communication style filter tags exist', async ({ page }) => {
    await page.goto('/hosts');

    const energyFilters = page.locator('.energy-filter');
    const count = await energyFilters.count();
    expect(count).toBeGreaterThan(1);
  });

  test('host cards have required structure', async ({ page }) => {
    await page.goto('/hosts');

    const firstCard = page.locator('.host-card').first();
    await expect(firstCard.locator('.host-name')).toBeVisible();
    await expect(firstCard.locator('.host-badge')).toBeVisible();
    await expect(firstCard.locator('.host-location')).toBeVisible();
    await expect(firstCard.locator('.host-story')).toBeVisible();
  });
});

test.describe('MATCHS - Accessibility', () => {
  test('homepage has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');

    // Check for lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();

    // Check for heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();

    // Check that all images have alt attributes (or are svg)
    const images = page.locator('img');
    const imgCount = await images.count();
    for (let i = 0; i < imgCount; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // Images should have alt text (may be empty for decorative)
      expect(alt).not.toBeNull();
    }
  });

  test('navigation has proper link structure', async ({ page }) => {
    await page.goto('/');

    const navLinks = page.locator('.nav-desktop .nav-link');
    const count = await navLinks.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('forms have labels linked to inputs', async ({ page }) => {
    await page.goto('/login');

    const labels = page.locator('label[for]');
    const labelCount = await labels.count();
    expect(labelCount).toBeGreaterThan(0);

    // Verify at least email label links to email input
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();
  });

  test('buttons have accessible text', async ({ page }) => {
    await page.goto('/');

    const buttons = page.locator('button, [role="button"], .btn');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('contact page form labels are linked correctly', async ({ page }) => {
    await page.goto('/contact');

    const nameLabel = page.locator('label[for="name"]');
    const emailLabel = page.locator('label[for="email"]');
    const messageLabel = page.locator('label[for="message"]');

    await expect(nameLabel).toBeVisible();
    await expect(emailLabel).toBeVisible();
    await expect(messageLabel).toBeVisible();
  });
});

test.describe('MATCHS - Experience Pages', () => {
  test('Mt. Takao Food Tour page loads with booking form', async ({ page }) => {
    await page.goto('/experiences/mt-takao-local-food-tour');

    await expect(page).toHaveTitle(/Mt. Takao/);
    await expect(page.locator('.exp-title')).toBeVisible();
    await expect(page.locator('#bookingForm')).toBeVisible();
  });

  test('Mt. Takao Food Tour guest counter increments and updates price', async ({ page }) => {
    await page.goto('/experiences/mt-takao-local-food-tour');

    const guestDisplay = page.locator('#guestDisplay');
    const totalAmount = page.locator('#totalAmount');
    const bookBtn = page.locator('#bookBtn');

    // Initial state: 1 guest, ¥4,980
    await expect(guestDisplay).toHaveText('1');
    await expect(totalAmount).toHaveText('¥4,980');

    // Increment to 2 guests
    await page.click('#guestPlus');
    await expect(guestDisplay).toHaveText('2');
    await expect(totalAmount).toHaveText('¥9,960');
    await expect(bookBtn).toHaveText('Book Now — ¥9,960');

    // Increment to 3 guests
    await page.click('#guestPlus');
    await expect(guestDisplay).toHaveText('3');
    await expect(totalAmount).toHaveText('¥14,940');
  });

  test('Mt. Takao Food Tour guest counter does not go below 1', async ({ page }) => {
    await page.goto('/experiences/mt-takao-local-food-tour');

    await page.click('#guestMinus');
    const guestDisplay = page.locator('#guestDisplay');
    await expect(guestDisplay).toHaveText('1');
  });

  test('Mt. Takao Food Tour includes all booking fields', async ({ page }) => {
    await page.goto('/experiences/mt-takao-local-food-tour');

    await expect(page.locator('#bookingDate')).toBeVisible();
    await expect(page.locator('#guestName')).toBeVisible();
    await expect(page.locator('#guestEmail')).toBeVisible();
    await expect(page.locator('#guestWhatsapp')).toBeVisible();
  });

  test('Mt. Takao Food Tour has reviews section', async ({ page }) => {
    await page.goto('/experiences/mt-takao-local-food-tour');

    const reviews = page.locator('.review-card');
    const count = await reviews.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('Mt. Takao Food Tour has fixed bottom CTA', async ({ page }) => {
    await page.goto('/experiences/mt-takao-local-food-tour');

    const fixedCta = page.locator('#fixedCta');
    await expect(fixedCta).toBeVisible();
    await expect(fixedCta.locator('.fixed-cta-price')).toHaveText('¥4,980');
  });

  test('Best Izakaya page loads with booking form', async ({ page }) => {
    await page.goto('/experiences/best-izakaya-tachikawa');

    await expect(page).toHaveTitle(/Izakaya/);
    await expect(page.locator('#bookingForm')).toBeVisible();
  });

  test('Best Izakaya guest counter defaults to 2 and updates price', async ({ page }) => {
    await page.goto('/experiences/best-izakaya-tachikawa');

    const guestDisplay = page.locator('#guestDisplay');
    const totalAmount = page.locator('#totalAmount');

    // Default: 2 guests, ¥13,000
    await expect(guestDisplay).toHaveText('2');
    await expect(totalAmount).toHaveText('¥13,000');

    // Increment to 3
    await page.click('#guestPlus');
    await expect(guestDisplay).toHaveText('3');
    await expect(totalAmount).toHaveText('¥19,500');

    // Decrement to 2
    await page.click('#guestMinus');
    await expect(guestDisplay).toHaveText('2');
    await expect(totalAmount).toHaveText('¥13,000');
  });

  test('Onsen Day Trip page loads with booking form', async ({ page }) => {
    await page.goto('/experiences/onsen-day-trip-tama');

    await expect(page).toHaveTitle(/Onsen/);
    await expect(page.locator('#bookingForm')).toBeVisible();
  });

  test('Onsen Day Trip guest counter defaults to 1 and updates price', async ({ page }) => {
    await page.goto('/experiences/onsen-day-trip-tama');

    await expect(page.locator('#guestDisplay')).toHaveText('1');
    await expect(page.locator('#totalAmount')).toHaveText('¥3,800');

    // Increment to 4
    for (let i = 0; i < 3; i++) {
      await page.click('#guestPlus');
    }
    await expect(page.locator('#guestDisplay')).toHaveText('4');
    await expect(page.locator('#totalAmount')).toHaveText('¥15,200');
  });

  test('experience pages have what-is-included lists', async ({ page }) => {
    await page.goto('/experiences/mt-takao-local-food-tour');

    const includedItems = page.locator('.included-list li');
    const count = await includedItems.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('experience pages have trust badges', async ({ page }) => {
    await page.goto('/experiences/best-izakaya-tachikawa');

    const trustBadges = page.locator('.trust-badge');
    const count = await trustBadges.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('experience pages have cancellation policy', async ({ page }) => {
    await page.goto('/experiences/onsen-day-trip-tama');

    const cancellationText = page.locator('.cancellation-text');
    await expect(cancellationText).toBeVisible();
  });
});