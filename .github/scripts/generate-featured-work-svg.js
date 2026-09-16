const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '../..');

function generateFeaturedWorkSvg() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="850" height="370" viewBox="0 0 850 370" fill="none">
  <style>
    .card { fill: #0D1117; stroke: #30363D; stroke-width: 1px; rx: 12px; }
    .project-box { fill: #161B22; stroke: #30363D; stroke-width: 1px; rx: 8px; }
    .title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 700; fill: #58A6FF; }
    .proj-title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; fill: #FFFFFF; }
    .tagline { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-style: italic; fill: #8B949E; }
    .detail-label { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 600; fill: #58A6FF; }
    .detail-val { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 13px; fill: #C9D1D9; }
    .grid-line { stroke: #30363D; stroke-width: 1px; }
  </style>

  <rect width="850" height="370" class="card" />

  <!-- Main Header -->
  <text x="30" y="42" class="title">🚀 Featured Production Work</text>
  <line x1="30" y1="58" x2="820" y2="58" class="grid-line" />

  <!-- Project 1: Titanium Fest Platform -->
  <g transform="translate(30, 75)">
    <rect width="790" height="130" class="project-box" />
    <text x="20" y="30" class="proj-title">🏟️ Titanium Fest Platform</text>
    <text x="20" y="48" class="tagline">Architecting an event platform built to sustain high-volume real-world traffic.</text>
    
    <text x="20" y="74" class="detail-label">• Handling traffic: <tspan class="detail-val">Served 13K+ active users &amp; 41K+ unique visitors</tspan></text>
    <text x="20" y="93" class="detail-label">• Ensuring reliability: <tspan class="detail-val">Sustained 100% uptime with zero downtime</tspan></text>
    <text x="20" y="112" class="detail-label">• Leading execution: <tspan class="detail-val">Directed full-stack development, GitHub Actions CI/CD automation &amp; cloud deployment</tspan></text>
  </g>

  <!-- Project 2: AI Projects -->
  <g transform="translate(30, 220)">
    <rect width="790" height="120" class="project-box" />
    <text x="20" y="30" class="proj-title">🤖 AI Projects</text>
    <text x="20" y="48" class="tagline">Deploying practical AI products that automate and streamline complex workflows.</text>
    
    <text x="20" y="74" class="detail-label">• Automating workflows: <tspan class="detail-val">Engineering GitHub Actions CI/CD pipelines, AI video editing &amp; developer tooling</tspan></text>
    <text x="20" y="93" class="detail-label">• Focusing on utility: <tspan class="detail-val">Solving concrete workflow bottlenecks through practical AI &amp; workflow systems</tspan></text>
  </g>
</svg>`;

  const outputDir = path.join(repoRoot, 'profile');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(path.join(outputDir, 'featured-work.svg'), svg, 'utf8');
  console.log('Successfully generated profile/featured-work.svg');
}

generateFeaturedWorkSvg();
