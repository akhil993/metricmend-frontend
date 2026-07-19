import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.SCREENSHOT_BASE_URL || "http://127.0.0.1:3000";
const outDir = path.join(process.cwd(), "public", "portfolio");
const statePath = path.join(process.cwd(), ".playwright", "metricmend-state.json");

const publicScreens = [
  { file: "01-landing.png", path: "/" },
  { file: "02-login.png", path: "/login" },
];

const authenticatedScreens = [
  { file: "03-launchpad.png", path: "/app/launchpad" },
  { file: "04-workspaces.png", path: "/app/workspaces" },
  { file: "05-workspace-Overview.png", path: "/app" },
  { file: "06-connections.png", path: "/app/connections" },
  { file: "07-semantic-models.png", path: "/app/models" },
  { file: "09-mira-empty.png", path: "/app/mira" },
];

function loadDotEnv() {
  return fs
    .readFile(path.join(process.cwd(), ".env.local"), "utf8")
    .then((text) => {
      for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
          continue;
        }

        const [key, ...valueParts] = trimmed.split("=");

        if (!process.env[key]) {
          process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
        }
      }
    })
    .catch(() => undefined);
}

async function waitForReady(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1200);
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

async function screenshot(page, target) {
  await page.goto(`${baseUrl}${target.path}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await waitForReady(page);
  if (target.requireAuth && page.url().includes("/login")) {
    console.warn(`Skipped ${target.file}: redirected to login.`);
    return false;
  }

  await page.screenshot({
    path: path.join(outDir, target.file),
    fullPage: false,
  });

  return true;
}

async function login(context, page) {
  const email = process.env.SCREENSHOT_EMAIL;
  const password = process.env.SCREENSHOT_PASSWORD;

  try {
    await fs.access(statePath);
    return true;
  } catch {
    // Continue to credential login.
  }

  if (!email || !password) {
    return false;
  }

  await page.goto(`${baseUrl}/login`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /enter workspace|login|sign in|continue/i }).click();
  await page.waitForURL(/\/app|\/onboarding/, { timeout: 60000 });
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await context.storageState({ path: statePath });

  return true;
}

async function main() {
  await loadDotEnv();
  await fs.mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const publicContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const publicPage = await publicContext.newPage();

  for (const target of publicScreens) {
    await screenshot(publicPage, target);
    console.log(`Captured ${target.file}`);
  }

  await publicContext.close();

  let authenticated = false;
  let authContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  let authPage = await authContext.newPage();

  authenticated = await login(authContext, authPage);

  if (authenticated) {
    await authContext.close();
    authContext = await browser.newContext({
      storageState: statePath,
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    authPage = await authContext.newPage();

    for (const target of authenticatedScreens) {
      const captured = await screenshot(authPage, {
        ...target,
        requireAuth: true,
      });

      if (captured) console.log(`Captured ${target.file}`);
    }
  } else {
    console.warn(
      "Skipped authenticated app screenshots. Set SCREENSHOT_EMAIL and SCREENSHOT_PASSWORD, or provide .playwright/metricmend-state.json."
    );
  }

  await authContext.close();
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
