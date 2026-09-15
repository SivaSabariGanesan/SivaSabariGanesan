const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '../..');
const profileYmlPath = path.join(repoRoot, 'profile-content', 'profile.yml');
const templatePath = path.join(repoRoot, 'profile-content', 'README.template.md');
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

// Render what_i_build table
if (Array.isArray(data.what_i_build)) {
  let html = '<table width="100%">\n';
  for (let i = 0; i < data.what_i_build.length; i += 2) {
    html += '  <tr>\n';
    const item1 = data.what_i_build[i];
    html += `    <td width="50%" valign="top">\n      <h4>${item1.id} — ${item1.title}</h4>\n      <p>${item1.desc}</p>\n    </td>\n`;
    if (i + 1 < data.what_i_build.length) {
      const item2 = data.what_i_build[i + 1];
      html += `    <td width="50%" valign="top">\n      <h4>${item2.id} — ${item2.title}</h4>\n      <p>${item2.desc}</p>\n    </td>\n`;
    }
    html += '  </tr>\n';
  }
  html += '</table>';
  template = template.replace(/\{\{\s*what_i_build\s*\}\}/g, html);
}

// Render tech_stack table
if (data.tech_stack) {
  const tsTable = `| Category | Action-Driven Stack & Tooling |
| :--- | :--- |
| **Crafting Interfaces** | ${data.tech_stack.frontend || ''} |
| **Architecting Backends** | ${data.tech_stack.backend || ''} |
| **Managing Data & Caches** | ${data.tech_stack.database || ''} |
| **Coding In** | ${data.tech_stack.languages || ''} |
| **Deploying & Automating** | ${data.tech_stack.infra || ''} |`;
  template = template.replace(/\{\{\s*tech_stack_table\s*\}\}/g, tsTable);
}

// Render featured_work
if (Array.isArray(data.featured_work)) {
  const fwMd = data.featured_work.map(item => {
    let md = `### 🏟️ ${item.name}\n*${item.tagline}*\n\n`;
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

// Render impact_table
if (Array.isArray(data.impact)) {
  const colWidth = Math.floor(100 / data.impact.length);
  let html = '<table width="100%">\n  <tr>\n';
  data.impact.forEach(item => {
    html += `    <td align="center" width="${colWidth}%">\n      <h3>${item.metric}</h3>\n      <p>${item.label}</p>\n    </td>\n`;
  });
  html += '  </tr>\n</table>';
  template = template.replace(/\{\{\s*impact_table\s*\}\}/g, html);
}

// Render journey_list
if (Array.isArray(data.journey)) {
  const jList = data.journey.map(item => `* ${item}`).join('\n');
  template = template.replace(/\{\{\s*journey_list\s*\}\}/g, jList);
}

// Render currently_building_list
if (Array.isArray(data.currently_building)) {
  const cbList = data.currently_building.map(item => `* ${item}`).join('\n');
  template = template.replace(/\{\{\s*currently_building_list\s*\}\}/g, cbList);
}

// Render outside_code_list
if (Array.isArray(data.outside_code)) {
  const ocList = data.outside_code.map(item => `* ${item}`).join('\n');
  template = template.replace(/\{\{\s*outside_code_list\s*\}\}/g, ocList);
}

fs.writeFileSync(outputPath, template, 'utf8');
console.log('Successfully generated README.md from template and profile.yml');

