const puppeteer = require("puppeteer");
const fs = require("fs");

const FORM_URL = "https://testsite.getjones.com/ExampleForm/";
const SCREENSHOT_DIR = "./screenshots";

const testCases = [
  {
    testName: "valid-test",
    name: "Thompson Raul",
    email: "thompson@email.com",
    phone: "1234567890",
    company: "Jones Automation",
    employees: "51-500",
  },
  {
    testName: "invalid-email",
    name: "Thompson Raul",
    email: "thompsonemail.com",
    phone: "1234567890",
    company: "Jones Automation",
    employees: "51-500",
  },
  {
    testName: "empty-name",
    name: "",
    email: "thompson@email.com",
    phone: "1234567890",
    company: "Jones Automation",
    employees: "51-500",
  },
  {
    testName: "empty-phone",
    name: "Thompson Raul",
    email: "thompson@email.com",
    phone: "",
    company: "Jones Automation",
    employees: "51-500",
  },
  {
    testName: "empty-company",
    name: "Thompson Raul",
    email: "thompson@email.com",
    phone: "1234567890",
    company: "",
    employees: "51-500",
  },
];

function ensureScreenshotDirs() {
  const dirs = [
    SCREENSHOT_DIR,
    `${SCREENSHOT_DIR}/success`,
    `${SCREENSHOT_DIR}/failure`,
    `${SCREENSHOT_DIR}/exception`,
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function openFormPage(page) {
  await page.goto(FORM_URL, { waitUntil: "networkidle2" });
  await page.waitForSelector('input[name="name"]');
}

async function typeIfPresent(page, selector, value) {
  if (!value) return;
  await page.type(selector, value, { delay: 40 });
}

async function selectIfPresent(page, selector, value) {
  if (!value) return;
  await page.select(selector, value);
}

async function fillForm(page, test) {
  await typeIfPresent(page, 'input[name="name"]', test.name);
  await typeIfPresent(page, 'input[name="email"]', test.email);
  await typeIfPresent(page, 'input[name="phone"]', test.phone);
  await typeIfPresent(page, 'input[name="company"]', test.company);
  await selectIfPresent(page, "#employees", test.employees);
}

async function submitForm(page) {
  let navigated = false;

  await Promise.all([
    page
      .waitForNavigation({ timeout: 6000 })
      .then(() => {
        navigated = true;
      })
      .catch(() => {}),
    page.click("button.primary.button"),
  ]);

  await sleep(2000);

  return navigated;
}

async function saveScreenshot(page, fileName) {
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/${fileName}`,
    fullPage: true,
  });
}

async function handleSuccess(page, testName) {
  console.log(`SUCCESS: ${testName}! Thank you page reached.`);
  await saveScreenshot(page, `success/${testName}-thank-you.png`);
}

async function handleFailure(page, testName) {
  console.log(`FAIL: ${testName}`);
  await saveScreenshot(page, `failure/${testName}-error.png`);
}

async function handleException(page, testName, error) {
  console.log(`ERROR: ${testName} - ${error.message}`);

  await saveScreenshot(page, `exception/${testName}-exception.png`).catch(
    () => {}
  );
}

async function runTest(browser, test) {
  const page = await browser.newPage();

  try {
    await openFormPage(page);
    await fillForm(page, test);

    const navigated = await submitForm(page);

    if (navigated) {
      await handleSuccess(page, test.testName);
    } else {
      await handleFailure(page, test.testName);
    }
  } catch (error) {
    await handleException(page, test.testName, error);
  } finally {
    await page.close();
  }
}

async function runAutomation() {
  ensureScreenshotDirs();

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  try {
    for (const test of testCases) {
      await runTest(browser, test);
    }
  } finally {
    await browser.close();
  }
}

runAutomation();
