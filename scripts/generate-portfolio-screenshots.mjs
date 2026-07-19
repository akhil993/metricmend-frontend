import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outDir = path.join(process.cwd(), "public", "portfolio");

const screens = [
  {
    file: "01-landing.png",
    title: "MetricMend",
    subtitle: "Governed AI analytics with a signature feel",
    active: "Home",
    mode: "landing",
    accent: "#ff6a2a",
  },
  {
    file: "02-login.png",
    title: "Welcome back.",
    subtitle: "Secure workspace access",
    active: "Login",
    mode: "auth",
    accent: "#0fa882",
  },
  {
    file: "03-launchpad.png",
    title: "Launchpad",
    subtitle: "Personal sandbox for models, metrics, and Mira",
    active: "Launchpad",
    mode: "dashboard",
    accent: "#2368ff",
  },
  {
    file: "04-workspaces.png",
    title: "Workspaces",
    subtitle: "Shared governed analytics environments",
    active: "Workspaces",
    mode: "workspace",
    accent: "#0fa882",
  },
  {
    file: "05-workspace-Overview.png",
    title: "Revenue Operations",
    subtitle: "Workspace overview",
    active: "Home",
    mode: "overview",
    accent: "#ff6a2a",
  },
  {
    file: "06-connections.png",
    title: "Connections",
    subtitle: "Secure data source setup",
    active: "Connections",
    mode: "connections",
    accent: "#2368ff",
  },
  {
    file: "07-semantic-models.png",
    title: "Semantic Models",
    subtitle: "Certified models and governed metric layers",
    active: "Models",
    mode: "models",
    accent: "#0fa882",
  },
  {
    file: "08-model-diagram.png",
    title: "Sales Model",
    subtitle: "Facts, dimensions, relationships",
    active: "Models",
    mode: "diagram",
    accent: "#2368ff",
  },
  {
    file: "09-mira-empty.png",
    title: "Mira",
    subtitle: "Ask across trusted models",
    active: "Mira",
    mode: "mira-empty",
    accent: "#ff6a2a",
  },
  {
    file: "10-mira-revenue.png",
    title: "Mira",
    subtitle: "Revenue analysis with governed context",
    active: "Mira",
    mode: "mira",
    accent: "#2368ff",
  },
  {
    file: "11-mira-products.png",
    title: "Mira",
    subtitle: "Product contribution analysis",
    active: "Mira",
    mode: "mira-products",
    accent: "#0fa882",
  },
  {
    file: "12-mira-low-performing.png",
    title: "Mira",
    subtitle: "Low performer investigation",
    active: "Mira",
    mode: "mira-low",
    accent: "#ff6a2a",
  },
];

const nav = ["Home", "Company", "Launchpad", "Workspaces", "Mira", "Settings"];

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sidebar(active) {
  const items = nav
    .map((item, index) => {
      const y = 208 + index * 72;
      const isActive = item === active;
      return `
        <rect x="32" y="${y}" width="240" height="52" rx="14" fill="${isActive ? "#0f172a" : "transparent"}"/>
        <circle cx="58" cy="${y + 26}" r="8" fill="${isActive ? "#ffffff" : "#94a3b8"}"/>
        <text x="82" y="${y + 33}" font-size="20" font-weight="650" fill="${isActive ? "#ffffff" : "#64748b"}">${esc(item)}</text>
      `;
    })
    .join("");

  return `
    <rect x="0" y="0" width="304" height="1080" fill="#ffffff"/>
    <rect x="303" y="0" width="1" height="1080" fill="#e2e8f0"/>
    <rect x="32" y="32" width="48" height="48" rx="14" fill="#0f172a"/>
    <path d="M44 64 L54 54 L63 61 L75 47" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="94" y="58" font-size="28" font-weight="760" fill="#0f172a">MetricMend</text>
    <text x="96" y="78" font-size="12" font-weight="720" fill="#64748b">INTELLIGENCE</text>
    ${items}
  `;
}

function topbar(title, subtitle) {
  return `
    <rect x="304" y="0" width="1616" height="96" fill="#f8fafc"/>
    <text x="352" y="42" font-size="20" font-weight="720" fill="#0f172a">${esc(title)}</text>
    <text x="352" y="70" font-size="14" fill="#64748b">${esc(subtitle)}</text>
    <rect x="1600" y="28" width="112" height="38" rx="19" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="1622" y="53" font-size="14" font-weight="650" fill="#334155">AI credits</text>
    <circle cx="1772" cy="47" r="22" fill="#0f172a"/>
    <text x="1764" y="55" font-size="18" font-weight="760" fill="#ffffff">A</text>
  `;
}

function metricCard(x, y, title, value, accent) {
  return `
    <rect x="${x}" y="${y}" width="320" height="148" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="${x + 24}" y="${y + 40}" font-size="18" font-weight="700" fill="#0f172a">${esc(title)}</text>
    <text x="${x + 24}" y="${y + 92}" font-size="42" font-weight="760" fill="#0f172a">${esc(value)}</text>
    <rect x="${x + 24}" y="${y + 114}" width="112" height="10" rx="5" fill="${accent}"/>
  `;
}

function chart(x, y, w, h, accent) {
  const bars = [0.46, 0.58, 0.42, 0.72, 0.64, 0.82, 0.76, 0.9];
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="${x + 28}" y="${y + 42}" font-size="20" font-weight="720" fill="#0f172a">Performance trend</text>
    <text x="${x + 28}" y="${y + 70}" font-size="14" fill="#64748b">Governed result by month</text>
    ${bars
      .map((bar, index) => {
        const bw = 54;
        const gap = 34;
        const bx = x + 48 + index * (bw + gap);
        const bh = Math.round((h - 150) * bar);
        const by = y + h - 44 - bh;
        return `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="12" fill="${index === 6 ? accent : "#cbd5e1"}"/>`;
      })
      .join("")}
  `;
}

function table(x, y, w, h, rows, accent) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="${x + 24}" y="${y + 42}" font-size="20" font-weight="720" fill="#0f172a">Governed metrics</text>
    ${rows
      .map((row, index) => {
        const ry = y + 82 + index * 58;
        return `
          <rect x="${x + 24}" y="${ry}" width="${w - 48}" height="42" rx="10" fill="${index % 2 ? "#f8fafc" : "#ffffff"}"/>
          <circle cx="${x + 48}" cy="${ry + 21}" r="7" fill="${index === 0 ? accent : "#94a3b8"}"/>
          <text x="${x + 70}" y="${ry + 27}" font-size="16" font-weight="650" fill="#334155">${esc(row)}</text>
        `;
      })
      .join("")}
  `;
}

function diagram(accent) {
  const nodes = [
    [440, 220, "fact_sales"],
    [780, 160, "dim_customers"],
    [780, 330, "dim_products"],
    [1120, 245, "dim_date"],
    [1120, 430, "semantic_metrics"],
  ];
  return `
    <rect x="352" y="128" width="1488" height="852" rx="22" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="400" y="186" font-size="24" font-weight="760" fill="#0f172a">Model graph</text>
    <path d="M620 280 C700 240 700 220 780 220" stroke="#94a3b8" stroke-width="4" fill="none"/>
    <path d="M620 310 C710 360 700 390 780 390" stroke="#94a3b8" stroke-width="4" fill="none"/>
    <path d="M960 220 C1040 220 1040 285 1120 305" stroke="#94a3b8" stroke-width="4" fill="none"/>
    <path d="M960 390 C1040 390 1040 465 1120 490" stroke="${accent}" stroke-width="5" fill="none"/>
    ${nodes
      .map(([x, y, label], index) => `
        <rect x="${x}" y="${y}" width="180" height="92" rx="18" fill="${index === 0 ? "#0f172a" : "#f8fafc"}" stroke="${index === 0 ? "#0f172a" : "#cbd5e1"}"/>
        <text x="${x + 24}" y="${y + 42}" font-size="18" font-weight="760" fill="${index === 0 ? "#ffffff" : "#0f172a"}">${label}</text>
        <text x="${x + 24}" y="${y + 66}" font-size="12" fill="${index === 0 ? "#cbd5e1" : "#64748b"}">${index === 4 ? "7 metrics" : "12 fields"}</text>
      `)
      .join("")}
    ${table(400, 620, 612, 280, ["Revenue", "Customers Lost", "Churn Rate"], accent)}
    ${metricCard(1070, 620, "Certification", "Ready", accent)}
  `;
}

function miraPanel(mode, accent) {
  const question =
    mode === "mira-products"
      ? "Which products are driving revenue?"
      : mode === "mira-low"
        ? "Show low performing regions"
        : "Why did revenue change this quarter?";

  return `
    <rect x="352" y="128" width="1488" height="852" rx="22" fill="#070810"/>
    <rect x="386" y="162" width="330" height="784" rx="18" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.12"/>
    <text x="418" y="214" font-size="24" font-weight="760" fill="#ffffff">Mira</text>
    <rect x="418" y="250" width="250" height="42" rx="12" fill="#ffffff" fill-opacity="0.08"/>
    <rect x="418" y="308" width="210" height="42" rx="12" fill="#ffffff" fill-opacity="0.08"/>
    <rect x="760" y="178" width="730" height="72" rx="22" fill="#ffffff" fill-opacity="0.08"/>
    <text x="798" y="224" font-size="22" font-weight="650" fill="#ffffff">${esc(question)}</text>
    <rect x="760" y="290" width="890" height="430" rx="22" fill="#ffffff" fill-opacity="0.96"/>
    <text x="806" y="350" font-size="24" font-weight="760" fill="#0f172a">Governed answer</text>
    <text x="806" y="386" font-size="17" fill="#475569">Mira resolved certified metrics and built a safe query.</text>
    ${chart(806, 420, 760, 210, accent)}
    <rect x="806" y="652" width="230" height="42" rx="21" fill="${accent}"/>
    <text x="836" y="680" font-size="15" font-weight="760" fill="#ffffff">View reasoning</text>
    <rect x="760" y="770" width="890" height="84" rx="22" fill="#ffffff" fill-opacity="0.10" stroke="#ffffff" stroke-opacity="0.14"/>
    <text x="804" y="823" font-size="21" fill="#ffffff">Ask a follow-up...</text>
  `;
}

function content(screen) {
  if (screen.mode === "diagram") return diagram(screen.accent);
  if (screen.mode.startsWith("mira")) return miraPanel(screen.mode, screen.accent);
  if (screen.mode === "auth") {
    return `
      <rect x="352" y="146" width="690" height="760" rx="28" fill="#ffffff" stroke="#e2e8f0"/>
      <text x="420" y="246" font-size="54" font-weight="780" fill="#0f172a">${esc(screen.title)}</text>
      <text x="420" y="292" font-size="22" fill="#475569">${esc(screen.subtitle)}</text>
      <rect x="420" y="372" width="500" height="62" rx="16" fill="#f8fafc" stroke="#cbd5e1"/>
      <rect x="420" y="462" width="500" height="62" rx="16" fill="#f8fafc" stroke="#cbd5e1"/>
      <rect x="420" y="570" width="500" height="64" rx="32" fill="#0f172a"/>
      <text x="620" y="610" font-size="20" font-weight="760" fill="#ffffff">Continue</text>
      ${chart(1110, 186, 650, 520, screen.accent)}
    `;
  }

  if (screen.mode === "connections") {
    return `
      ${metricCard(352, 142, "Connected", "4", screen.accent)}
      ${metricCard(704, 142, "Healthy", "99%", "#0fa882")}
      ${metricCard(1056, 142, "Guardrails", "On", "#ff6a2a")}
      ${table(352, 340, 650, 420, ["Snowflake production", "Postgres finance", "BigQuery marketing", "Databricks lakehouse"], screen.accent)}
      ${chart(1040, 340, 650, 420, screen.accent)}
    `;
  }

  if (screen.mode === "models") {
    return `
      ${metricCard(352, 142, "Models", "8", screen.accent)}
      ${metricCard(704, 142, "Certified", "5", "#2368ff")}
      ${metricCard(1056, 142, "Draft", "3", "#ff6a2a")}
      ${table(352, 340, 650, 420, ["Sales Model", "Customer Health", "Product Usage", "Finance Core"], screen.accent)}
      ${chart(1040, 340, 650, 420, screen.accent)}
    `;
  }

  if (screen.mode === "workspace" || screen.mode === "overview" || screen.mode === "dashboard") {
    return `
      ${metricCard(352, 142, "Revenue", "$2.4M", screen.accent)}
      ${metricCard(704, 142, "Churn", "3.8%", "#ff6a2a")}
      ${metricCard(1056, 142, "Customers", "18.2K", "#0fa882")}
      ${chart(352, 340, 820, 420, screen.accent)}
      ${table(1210, 340, 510, 420, ["Revenue", "Gross Margin", "Customers Lost", "AOV"], screen.accent)}
    `;
  }

  return `
    <rect x="352" y="146" width="820" height="566" rx="26" fill="#ffffff" fill-opacity="0.72" stroke="#ffffff"/>
    <text x="418" y="260" font-size="86" font-weight="780" fill="#211a17">${esc(screen.title)}</text>
    <text x="424" y="318" font-size="28" font-weight="600" fill="#5c4b43">${esc(screen.subtitle)}</text>
    ${chart(420, 380, 660, 250, screen.accent)}
    <rect x="1240" y="190" width="468" height="620" rx="28" fill="#070810"/>
    <text x="1294" y="270" font-size="32" font-weight="780" fill="#ffffff">Mira</text>
    <rect x="1294" y="322" width="328" height="58" rx="18" fill="#ffffff" fill-opacity="0.09"/>
    <rect x="1294" y="412" width="270" height="58" rx="18" fill="#ffffff" fill-opacity="0.09"/>
    <rect x="1294" y="620" width="330" height="58" rx="29" fill="${screen.accent}"/>
  `;
}

function svg(screen) {
  return `
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
      <style>
        text { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      </style>
      <rect width="1920" height="1080" fill="#f8fafc"/>
      <rect width="1920" height="1080" fill="url(#bg)"/>
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fffaf3"/>
          <stop offset="42%" stop-color="#eaf1ff"/>
          <stop offset="100%" stop-color="#fff1e6"/>
        </linearGradient>
      </defs>
      ${sidebar(screen.active)}
      ${topbar(screen.title, screen.subtitle)}
      ${content(screen)}
    </svg>
  `;
}

await fs.mkdir(outDir, { recursive: true });

for (const screen of screens) {
  await sharp(Buffer.from(svg(screen)))
    .png()
    .toFile(path.join(outDir, screen.file));
}

console.log(`Generated ${screens.length} portfolio screenshots.`);
