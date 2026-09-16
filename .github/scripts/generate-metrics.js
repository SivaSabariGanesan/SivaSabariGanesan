const fs = require('fs');
const path = require('path');
const https = require('https');

const username = 'SivaSabariGanesan';
const token = process.env.GITHUB_TOKEN;

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'NodeJS-Script',
        ...(token ? { 'Authorization': `token ${token}` } : {})
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    const userUrl = `https://api.github.com/users/${username}`;
    const user = await fetchJson(userUrl);

    const publicRepos = user.public_repos || 0;
    const followers = user.followers || 0;
    const createdAt = user.created_at ? new Date(user.created_at).getFullYear() : '2023';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="170" viewBox="0 0 800 170" fill="none">
  <style>
    .bg { fill: #0D1117; stroke: #30363D; stroke-width: 1px; rx: 10px; }
    .title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; fill: #58A6FF; }
    .label { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 13px; fill: #8B949E; }
    .value { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 700; fill: #C9D1D9; }
    .grid-line { stroke: #21262D; stroke-width: 1px; }
  </style>
  <rect width="800" height="170" class="bg" />
  
  <text x="30" y="38" class="title">📊 GitHub Engineering Dashboard &amp; Activity Overview</text>
  <line x1="30" y1="50" x2="770" y2="50" class="grid-line" />

  <g transform="translate(50, 80)">
    <text x="0" y="0" class="label">Public Repositories</text>
    <text x="0" y="28" class="value">${publicRepos}</text>
  </g>

  <g transform="translate(250, 80)">
    <text x="0" y="0" class="label">Community Followers</text>
    <text x="0" y="28" class="value">${followers}</text>
  </g>

  <g transform="translate(450, 80)">
    <text x="0" y="0" class="label">Active Since</text>
    <text x="0" y="28" class="value">${createdAt}</text>
  </g>

  <g transform="translate(620, 80)">
    <text x="0" y="0" class="label">Automation Engine</text>
    <text x="0" y="28" class="value" fill="#3FB950">GitHub Actions</text>
  </g>
</svg>`;

    const outputDir = path.join(__dirname, '../../profile');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(path.join(outputDir, 'metrics.svg'), svg, 'utf8');
    console.log('Successfully generated profile/metrics.svg');
  } catch (err) {
    console.error('Error generating metrics SVG:', err.message);
    process.exit(1);
  }
}

run();
