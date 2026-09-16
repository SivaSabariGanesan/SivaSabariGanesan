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
  const fallback = 'Currently exploring and shipping new software projects.';
  let content = fallback;

  try {
    const eventsUrl = `https://api.github.com/users/${username}/events/public?per_page=15`;
    const events = await fetchJson(eventsUrl);

    if (Array.isArray(events) && events.length > 0) {
      const activeRepos = new Set();
      events.forEach(ev => {
        if (ev.repo && ev.repo.name && !ev.repo.name.endsWith(`/${username}`)) {
          const repoName = ev.repo.name.split('/')[1];
          if (repoName) {
            activeRepos.add(`[${repoName}](https://github.com/${ev.repo.name})`);
          }
        }
      });

      if (activeRepos.size > 0) {
        const repoList = Array.from(activeRepos).slice(0, 4).join(', ');
        content = `Actively pushing code & shipping updates for ${repoList}.`;
      }
    }
  } catch (err) {
    console.warn('Could not fetch GitHub events, using fallback:', err.message);
  }

  const outputDir = path.join(__dirname, '../../profile');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outputDir, 'currently-building.md'), content, 'utf8');
  console.log('Successfully generated profile/currently-building.md');
}

run();
