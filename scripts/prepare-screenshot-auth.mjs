import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.SCREENSHOT_BASE_URL || "http://localhost:3000";
const statePath = path.join(process.cwd(), ".playwright", "metricmend-state.json");

const browser = await chromium.launch({
  headless: false,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 960 },
});
const page = await context.newPage();

console.log("Opening MetricMend login.");
console.log("Sign in in the browser window. The script will save auth after /app loads.");

await page.goto(`${baseUrl}/login`, {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});

await page.waitForURL(/\/app|\/onboarding/, {
  timeout: 240000,
});

await fs.mkdir(path.dirname(statePath), {
  recursive: true,
});
await context.storageState({
  path: statePath,
});

console.log(`Saved screenshot auth state to ${statePath}`);

await browser.close();
