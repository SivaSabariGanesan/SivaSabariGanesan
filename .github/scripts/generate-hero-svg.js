const fs = require('fs');
const path = require('path');

function generateHeroSvg() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="850" height="230" viewBox="0 0 850 230" fill="none">
  <style>
    .card {
      fill: #0D1117;
      stroke: #30363D;
      stroke-width: 1px;
      rx: 12px;
    }
    .wave-bg {
      fill: url(#wave-gradient);
    }
    .title {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 32px;
      font-weight: 800;
      fill: #FFFFFF;
    }
    .tagline {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 400;
      fill: #8B949E;
    }
    .code-text {
      font-family: "Fira Code", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 17px;
      font-weight: 600;
      fill: #58A6FF;
    }
    .cursor {
      fill: #58A6FF;
      animation: blink 1s infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .animated-text {
      font-family: "Fira Code", monospace;
      font-size: 18px;
      font-weight: 500;
      fill: #58A6FF;
    }
  </style>

  <defs>
    <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1F6FEB" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="#0D1117" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#58A6FF" stop-opacity="0.2"/>
    </linearGradient>
  </defs>

  <rect width="850" height="230" class="card" />
  <rect width="850" height="90" class="wave-bg" rx="12" />

  <!-- Main Hero Title -->
  <text x="40" y="55" class="title">Hi, I'm Sabari 👋</text>
  <text x="40" y="80" class="tagline">Building software that delivers real-world impact.</text>

  <!-- Divider -->
  <line x1="40" y1="110" x2="810" y2="110" stroke="#30363D" stroke-width="1" />

  <!-- Animated Focus Lines -->
  <g transform="translate(40, 150)">
    <text x="0" y="0" class="animated-text">⚡ Engineering Full-Stack Apps · Building Practical AI Tools</text>
    <text x="0" y="32" class="tagline">Architecting Scalable Systems · Shipping Production Software</text>
  </g>
</svg>`;

  const outputDir = path.join(__dirname, '../../profile');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outputDir, 'hero.svg'), svg, 'utf8');
  console.log('Successfully generated profile/hero.svg');
}

generateHeroSvg();
