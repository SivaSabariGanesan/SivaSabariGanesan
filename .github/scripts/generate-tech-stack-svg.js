const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '../..');
const profileYmlPath = path.join(repoRoot, 'profile-content', 'profile.yml');

function parseSimpleYaml(yamlContent) {
  const data = {};
  const lines = yamlContent.split(/\r?\n/);
  let currentKey = null;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const indent = line.search(/\S/);

    if (indent === 0) {
      const match = trimmed.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
      if (match) {
        currentKey = match[1];
        if (match[2].trim()) {
          data[currentKey] = match[2].trim().replace(/^["']|["']$/g, '');
        } else {
          data[currentKey] = {};
        }
      }
    } else if (indent === 2 && currentKey && typeof data[currentKey] === 'object') {
      const match = trimmed.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
      if (match) {
        data[currentKey][match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
      }
    }
  }
  return data;
}

function generateTechStackSvg() {
  const rawYml = fs.readFileSync(profileYmlPath, 'utf8');
  const data = parseSimpleYaml(rawYml);
  const ts = data.tech_stack || {};

  const categories = [
    { label: 'Frontend', stack: ts.frontend || 'React · Next.js · JavaScript · TypeScript · Tailwind CSS', icon: '🎨' },
    { label: 'Backend', stack: ts.backend || 'Node.js · Express · Flask · Django · FastAPI', icon: '⚡' },
    { label: 'Databases', stack: ts.database || 'PostgreSQL · MongoDB · Redis · Firebase', icon: '🗄️' },
    { label: 'Languages', stack: ts.languages || 'JavaScript · TypeScript · Python · Java', icon: '💻' },
    { label: 'DevOps & Infra', stack: ts.infra || 'Git · GitHub · Docker · Linux · Azure · GitHub Actions', icon: '🚀' }
  ];

  let rowsY = 85;
  let rowsSvg = '';

  categories.forEach((cat, idx) => {
    rowsSvg += `
  <!-- Row ${idx + 1} -->
  <g transform="translate(30, ${rowsY})">
    <rect width="180" height="34" fill="#161B22" rx="6" stroke="#30363D" stroke-width="1" />
    <text x="15" y="22" class="cat-label">${cat.icon}  ${cat.label}</text>
    <text x="210" y="22" class="stack-text">${cat.stack}</text>
  </g>`;
    if (idx < categories.length - 1) {
      rowsSvg += `\n  <line x1="30" y1="${rowsY + 45}" x2="820" y2="${rowsY + 45}" stroke="#21262D" stroke-width="1" />`;
    }
    rowsY += 56;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="850" height="${rowsY + 20}" viewBox="0 0 850 ${rowsY + 20}" fill="none">
  <style>
    .card { fill: #0D1117; stroke: #30363D; stroke-width: 1px; rx: 12px; }
    .title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 700; fill: #58A6FF; }
    .cat-label { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 600; fill: #C9D1D9; }
    .stack-text { font-family: "Fira Code", -apple-system, BlinkMacSystemFont, monospace; font-size: 13.5px; font-weight: 500; fill: #8B949E; }
    .grid-line { stroke: #30363D; stroke-width: 1px; }
  </style>

  <rect width="850" height="${rowsY + 20}" class="card" />

  <!-- Header -->
  <text x="30" y="42" class="title">🧰 Tech Stack &amp; Developer Tooling</text>
  <line x1="30" y1="58" x2="820" y2="58" class="grid-line" />

  ${rowsSvg}
</svg>`;

  const outputDir = path.join(repoRoot, 'profile');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(path.join(outputDir, 'tech-stack.svg'), svg, 'utf8');
  console.log('Successfully generated profile/tech-stack.svg');
}

generateTechStackSvg();
