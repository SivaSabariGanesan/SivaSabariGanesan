const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '../..');
const profileYmlPath = path.join(repoRoot, 'profile-content', 'profile.yml');
const templatePath = path.join(repoRoot, 'profile-content', 'README.template.md');
const currentlyBuildingPath = path.join(repoRoot, 'profile', 'currently-building.md');
const outputPath = path.join(repoRoot, 'README.md');

function parseYaml(yamlContent) {
  const data = {};
  const lines = yamlContent.split(/\r?\n/);
  
  let currentKey = null;
  let inArray = false;
  let currentArrayItem = null;

  for (let line of lines) {
    const rawLine = line;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const indent = rawLine.search(/\S/);

    if (indent === 0) {
      const match = trimmed.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
      if (match) {
        currentKey = match[1];
        const val = match[2].trim();
        if (val) {
          data[currentKey] = val.replace(/^["']|["']$/g, '');
          currentKey = null;
        } else {
          data[currentKey] = null;
        }
        inArray = false;
        currentArrayItem = null;
      }
    } else if (indent === 2 && currentKey) {
      if (trimmed.startsWith('- ')) {
        if (!Array.isArray(data[currentKey])) {
          data[currentKey] = [];
        }
        inArray = true;
        const itemVal = trimmed.slice(2).trim();
        const objMatch = itemVal.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
        if (objMatch && !itemVal.startsWith('"') && !itemVal.startsWith("'") && !itemVal.startsWith('http') && !itemVal.includes('—') && !itemVal.includes('⚡') && !itemVal.includes('🤖') && !itemVal.includes('🎨') && !itemVal.includes('🔬') && !itemVal.includes('🎮') && !itemVal.includes('🔨') && !itemVal.includes('💡') && !itemVal.includes('☕') && !itemVal.includes('🥇') && !itemVal.includes('🏅') && !itemVal.includes('🌐')) {
          currentArrayItem = { [objMatch[1]]: objMatch[2].replace(/^["']|["']$/g, '') };
          data[currentKey].push(currentArrayItem);
        } else {
          currentArrayItem = null;
          data[currentKey].push(itemVal.replace(/^["']|["']$/g, ''));
        }
      } else {
        const match = trimmed.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
        if (match) {
          if (typeof data[currentKey] !== 'object' || data[currentKey] === null) {
            data[currentKey] = {};
          }
          data[currentKey][match[1]] = match[2].replace(/^["']|["']$/g, '');
        }
      }
    } else if (indent === 4 && currentKey && inArray && currentArrayItem) {
      if (trimmed.startsWith('- ')) {
        const val = trimmed.slice(2).trim().replace(/^["']|["']$/g, '');
        if (!Array.isArray(currentArrayItem.details)) {
          currentArrayItem.details = [];
        }
        currentArrayItem.details.push(val);
      } else {
        const match = trimmed.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
        if (match) {
          const k = match[1];
          const v = match[2].trim().replace(/^["']|["']$/g, '');
          if (v) {
            currentArrayItem[k] = v;
          } else if (k === 'details') {
            currentArrayItem.details = [];
          }
        }
      }
    } else if (indent === 6 && currentKey && inArray && currentArrayItem && Array.isArray(currentArrayItem.details)) {
      if (trimmed.startsWith('- ')) {
        const val = trimmed.slice(2).trim().replace(/^["']|["']$/g, '');
        currentArrayItem.details.push(val);
      }
    }
  }
  return data;
}

const profileYml = fs.readFileSync(profileYmlPath, 'utf8');
const data = parseYaml(profileYml);

let template = fs.readFileSync(templatePath, 'utf8');

// Basic replacements
template = template.replace(/\{\{\s*name\s*\}\}/g, data.name || 'Sabari');
template = template.replace(/\{\{\s*headline\s*\}\}/g, data.headline || 'Full-Stack Developer');
template = template.replace(/\{\{\s*headline_encoded\s*\}\}/g, encodeURIComponent(data.headline || 'Full-Stack Developer'));
template = template.replace(/\{\{\s*tagline\s*\}\}/g, data.tagline || 'Building software that delivers real-world impact.');
template = template.replace(/\{\{\s*tagline_encoded\s*\}\}/g, encodeURIComponent(data.tagline || 'Building software that delivers real-world impact.'));
template = template.replace(/\{\{\s*bio_short\s*\}\}/g, data.bio_short || '');
template = template.replace(/\{\{\s*bio_about\s*\}\}/g, data.bio_about || '');

if (data.social) {
  template = template.replace(/\{\{\s*social\.github\s*\}\}/g, data.social.github || '');
  template = template.replace(/\{\{\s*social\.linkedin\s*\}\}/g, data.social.linkedin || '');
  template = template.replace(/\{\{\s*social\.email\s*\}\}/g, data.social.email || '');
}

// Render what_i_build table (2x2 HTML table format matching requirements)
let whatIBuildHtml = `<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h4>01 — Web Products</h4>
      <p>Production-ready full-stack applications built for speed and scale.</p>
    </td>
    <td width="50%" valign="top">
      <h4>02 — AI Systems</h4>
      <p>Practical AI tools, automation, and intelligent workflows.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h4>03 — Developer Tools</h4>
      <p>Internal tools, automation, APIs, and engineering utilities.</p>
    </td>
    <td width="50%" valign="top">
      <h4>04 — Experiments</h4>
      <p>Prototypes, systems experiments, game mechanics, and emerging tech.</p>
    </td>
  </tr>
</table>`;
template = template.replace(/\{\{\s*what_i_build\s*\}\}/g, whatIBuildHtml);

// Render tech_stack table
if (data.tech_stack) {
  const tsTable = `| Category | Action-Driven Stack & Tooling |
| :--- | :--- |
| **Frontend** | ${data.tech_stack.frontend || 'React · Next.js · JavaScript · TypeScript · Tailwind CSS'} |
| **Backend** | ${data.tech_stack.backend || 'Node.js · Express · FastAPI · Flask · Django'} |
| **Databases** | ${data.tech_stack.database || 'PostgreSQL · MongoDB · Redis · Firebase'} |
| **Languages** | ${data.tech_stack.languages || 'JavaScript · TypeScript · Python · Java'} |
| **DevOps & Infra** | ${data.tech_stack.infra || 'Git · GitHub · Docker · Linux · Azure · GitHub Actions'} |`;
  template = template.replace(/\{\{\s*tech_stack_table\s*\}\}/g, tsTable);
}

// Render featured_work
if (Array.isArray(data.featured_work)) {
  const fwMd = data.featured_work.map(item => {
    let md = `### ${item.name}\n*${item.tagline}*\n\n`;
    if (Array.isArray(item.details)) {
      md += item.details.map(d => {
        const colonIdx = d.indexOf(':');
        if (colonIdx !== -1) {
          const label = d.slice(0, colonIdx).trim();
          const val = d.slice(colonIdx + 1).trim();
          return `* **${label}**: ${val}`;
        }
        return `* ${d}`;
      }).join('\n') + '\n';
    }
    return md;
  }).join('\n<br />\n\n');
  template = template.replace(/\{\{\s*featured_work\s*\}\}/g, fwMd);
}

// Render dynamic currently building
let currentlyBuildingText = 'Currently exploring and shipping new software projects.';
if (fs.existsSync(currentlyBuildingPath)) {
  const raw = fs.readFileSync(currentlyBuildingPath, 'utf8').trim();
  if (raw) currentlyBuildingText = raw;
}
template = template.replace(/\{\{\s*currently_building_dynamic\s*\}\}/g, currentlyBuildingText);

// Render principles
if (Array.isArray(data.principles)) {
  const pList = data.principles.map(item => `* ${item}`).join('\n');
  template = template.replace(/\{\{\s*engineering_principles\s*\}\}/g, pList);
}

fs.writeFileSync(outputPath, template, 'utf8');
console.log('Successfully generated README.md from template and profile.yml');
