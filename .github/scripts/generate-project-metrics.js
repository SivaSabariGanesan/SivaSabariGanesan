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
    const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100&type=owner`;

    const [user, repos] = await Promise.all([
      fetchJson(userUrl),
      fetchJson(reposUrl)
    ]);

    const publicRepos = user.public_repos || (Array.isArray(repos) ? repos.length : 0);
    const followers = user.followers || 0;
    const following = user.following || 0;

    let totalStars = 0;
    let totalForks = 0;
    let mainLanguages = {};

    if (Array.isArray(repos)) {
      repos.forEach(r => {
        if (!r.fork) {
          totalStars += r.stargazers_count || 0;
          totalForks += r.forks_count || 0;
          if (r.language) {
            mainLanguages[r.language] = (mainLanguages[r.language] || 0) + 1;
          }
        }
      });
    }

    const topLang = Object.entries(mainLanguages).sort((a,b) => b[1] - a[1])[0]?.[0] || 'TypeScript';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="220" viewBox="0 0 800 220" fill="none">
  <style>
    .bg { fill: #0D1117; stroke: #30363D; stroke-width: 1px; rx: 10px; }
    .title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 600; fill: #58A6FF; }
    .label { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 13px; fill: #8B949E; }
    .value { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 700; fill: #C9D1D9; }
    .accent { fill: #58A6FF; }
    .grid-line { stroke: #21262D; stroke-width: 1px; }
  </style>
  <rect width="800" height="220" class="bg" />
  
  <text x="30" y="40" class="title">⚡ GitHub Production Metrics &amp; Ecosystem</text>
  <line x1="30" y1="55" x2="770" y2="55" class="grid-line" />

  <!-- Metric 1: Public Repos -->
  <g transform="translate(40, 85)">
    <text x="0" y="0" class="label">Public Repositories</text>
    <text x="0" y="30" class="value">${publicRepos}</text>
  </g>

  <!-- Metric 2: Total Stars -->
  <g transform="translate(230, 85)">
    <text x="0" y="0" class="label">Total Stars Earned</text>
    <text x="0" y="30" class="value">${totalStars}</text>
  </g>

  <!-- Metric 3: Total Forks -->
  <g transform="translate(430, 85)">
    <text x="0" y="0" class="label">Forks &amp; Contributions</text>
    <text x="0" y="30" class="value">${totalForks}</text>
  </g>

  <!-- Metric 4: Followers -->
  <g transform="translate(630, 85)">
    <text x="0" y="0" class="label">Network Followers</text>
    <text x="0" y="30" class="value">${followers}</text>
  </g>

  <line x1="30" y1="145" x2="770" y2="145" class="grid-line" />

  <!-- Sub-info row -->
  <g transform="translate(40, 180)">
    <text x="0" y="0" class="label">Primary Language: <tspan class="value" font-size="14">${topLang}</tspan></text>
  </g>
  <g transform="translate(430, 180)">
    <text x="0" y="0" class="label">Status: <tspan fill="#3FB950" font-weight="600" font-size="14">● Active Developer</tspan></text>
  </g>
</svg>`;

    const outputDir = path.join(__dirname, '../../profile');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(path.join(outputDir, 'projects.svg'), svg, 'utf8');
    console.log('Successfully generated profile/projects.svg');
  } catch (err) {
    console.error('Error generating project metrics SVG:', err.message);
    process.exit(1);
  }
}

run();
