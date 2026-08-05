import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.SCREENSHOT_BASE_URL || "http://localhost:3000";
const outDir = path.join(process.cwd(), "public", "portfolio");
const statePath = path.join(process.cwd(), ".playwright", "metricmend-state.json");

const SALES_WORKSPACE_ID = "3876bf6d-2b86-4e0b-b72c-d9bce331173f";

const publicScreens = [
  { file: "01-landing.png", path: "/" },
  { file: "02-login.png", path: "/login" },
];

const authenticatedScreens = [
  { file: "03-launchpad.png", path: "/app/launchpad" },
  { file: "04-workspaces.png", path: "/app/workspaces" },
  { file: "05-workspace-Overview.png", path: `/app/workspaces/${SALES_WORKSPACE_ID}` },
  { file: "06-connections.png", path: `/app/workspaces/${SALES_WORKSPACE_ID}/connections` },
  { file: "07-semantic-models.png", path: `/app/workspaces/${SALES_WORKSPACE_ID}/models` },
  { file: "09-mira-empty.png", path: `/app/workspaces/${SALES_WORKSPACE_ID}/mira` },
];

const LOADING_PATTERN =
  /loading workspace|loading launchpad|loading conversation|loading semantic relationships|loading models|loading connections|^loading\.\.\.$/i;

async function waitForNoLoadingText(page, timeout = 30000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const text = await page.locator("body").innerText().catch(() => "");
    if (!LOADING_PATTERN.test(text) && !/loading\.\.\./i.test(text)) {
      return;
    }
    await page.waitForTimeout(400);
  }
}

async function settle(page) {
  await waitForNoLoadingText(page);
  await page.waitForTimeout(700);

  await page.addStyleTag({
    content: `
      nextjs-portal,
      [data-nextjs-toast],
      [data-nextjs-dialog-overlay],
      [data-nextjs-build-indicator] {
        display: none !important;
      }
    `,
  }).catch(() => undefined);

  await page.evaluate(() => {
    document.querySelectorAll("nextjs-portal").forEach((node) => node.remove());
  }).catch(() => undefined);
}

async function capture(page, file, targetPath, { requireAuth = false } = {}) {
  await page.goto(`${baseUrl}${targetPath}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await settle(page);

  if (requireAuth && page.url().includes("/login")) {
    console.warn(`Skipped ${file}: redirected to login (stale session).`);
    return;
  }

  const bodyText = await page.locator("body").innerText().catch(() => "");
  if (/failed to fetch|something went wrong/i.test(bodyText) || LOADING_PATTERN.test(bodyText) || /loading\.\.\./i.test(bodyText)) {
    console.warn(`WARNING: ${file} may still show a loading/error state.`);
  }

  await page.screenshot({ path: path.join(outDir, file), fullPage: false });
  console.log(`Captured ${file}`);
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();

  const publicContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const publicPage = await publicContext.newPage();

  for (const screen of publicScreens) {
    await capture(publicPage, screen.file, screen.path);
  }

  await publicContext.close();

  const authContext = await browser.newContext({
    storageState: statePath,
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const authPage = await authContext.newPage();

  for (const screen of authenticatedScreens) {
    await capture(authPage, screen.file, screen.path, { requireAuth: true });
  }

  // 08-model-diagram.png isn't covered by the simple route list above —
  // find a real model id from the Sales workspace's models list, then
  // screenshot its relationships/diagram page.
  await authPage.goto(`${baseUrl}/app/workspaces/${SALES_WORKSPACE_ID}/models`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await settle(authPage);

  const relationshipsHref = await authPage
    .locator('a[href*="/relationships"]')
    .first()
    .getAttribute("href")
    .catch(() => null);

  if (relationshipsHref) {
    await capture(authPage, "08-model-diagram.png", relationshipsHref, { requireAuth: true });
  } else {
    console.warn("Skipped 08-model-diagram.png: no model with a relationships link found.");
  }

  await authContext.close();
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
