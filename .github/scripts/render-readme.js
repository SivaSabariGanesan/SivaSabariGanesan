const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '../..');
const profileYmlPath = path.join(repoRoot, 'profile-content', 'profile.yml');
const templatePath = path.join(repoRoot, 'profile-content', 'README.template.md');
const outputPath = path.join(repoRoot, 'README.md');

function parseSimpleYaml(content) {
  const data = {};
  let currentSection = null;
  
  const lines = content.split('\n');
  for (let line of lines) {
    line = line.trimEnd();
    if (!line || line.startsWith('#')) continue;

    const topMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (topMatch && !line.startsWith(' ')) {
      const key = topMatch[1];
      const val = topMatch[2].trim();
      if (val) {
        data[key] = val.replace(/^["']|["']$/g, '');
      } else {
        currentSection = key;
        data[currentSection] = data[currentSection] || {};
      }
      continue;
    }

    const subMatch = line.match(/^\s{2}([a-zA-Z0-9_]+):\s*(.*)$/);
    if (subMatch && currentSection && typeof data[currentSection] === 'object') {
      const subKey = subMatch[1];
      const subVal = subMatch[2].trim().replace(/^["']|["']$/g, '');
      data[currentSection][subKey] = subVal;
    }
  }
  return data;
}

const profileYml = fs.readFileSync(profileYmlPath, 'utf8');
const data = parseSimpleYaml(profileYml);

let template = fs.readFileSync(templatePath, 'utf8');

template = template.replace(/\{\{\s*name\s*\}\}/g, data.name || 'Sabari');
template = template.replace(/\{\{\s*headline\s*\}\}/g, data.headline || 'Full-Stack Developer');
template = template.replace(/\{\{\s*headline_encoded\s*\}\}/g, encodeURIComponent(data.headline || 'Full-Stack Developer'));
template = template.replace(/\{\{\s*tagline\s*\}\}/g, data.tagline || 'Building things that should exist.');
template = template.replace(/\{\{\s*tagline_encoded\s*\}\}/g, encodeURIComponent(data.tagline || 'Building things that should exist.'));
template = template.replace(/\{\{\s*bio_short\s*\}\}/g, data.bio_short || '');
template = template.replace(/\{\{\s*bio_about\s*\}\}/g, data.bio_about || '');

if (data.social) {
  template = template.replace(/\{\{\s*social\.github\s*\}\}/g, data.social.github || '');
  template = template.replace(/\{\{\s*social\.linkedin\s*\}\}/g, data.social.linkedin || '');
  template = template.replace(/\{\{\s*social\.email\s*\}\}/g, data.social.email || '');
}

if (data.tech_stack) {
  template = template.replace(/\{\{\s*tech_stack\.frontend\s*\}\}/g, data.tech_stack.frontend || '');
  template = template.replace(/\{\{\s*tech_stack\.backend\s*\}\}/g, data.tech_stack.backend || '');
  template = template.replace(/\{\{\s*tech_stack\.database\s*\}\}/g, data.tech_stack.database || '');
  template = template.replace(/\{\{\s*tech_stack\.languages\s*\}\}/g, data.tech_stack.languages || '');
  template = template.replace(/\{\{\s*tech_stack\.infra\s*\}\}/g, data.tech_stack.infra || '');
}

fs.writeFileSync(outputPath, template, 'utf8');
console.log('Successfully generated README.md from template and profile.yml');
