#!/usr/bin/env node

// Script to switch between different AI service implementations
const fs = require('fs');
const path = require('path');

const implementations = {
  'original': 'aiService.js',
  'fallback': 'aiService-fallback.js', 
  'static': 'aiService-static.js'
};

const mode = process.argv[2];

if (!mode || !implementations[mode]) {
  console.log('Usage: node switch-ai-service.js <mode>');
  console.log('Available modes:');
  console.log('  original - Use original API-based service (requires working Netlify functions)');
  console.log('  fallback - Use fallback service with multiple retry strategies');
  console.log('  static   - Use static service with pre-generated demo data');
  process.exit(1);
}

const sourceFile = path.join(__dirname, 'src', 'services', implementations[mode]);
const targetFile = path.join(__dirname, 'src', 'services', 'aiService.js');

if (!fs.existsSync(sourceFile)) {
  console.error(`Source file not found: ${sourceFile}`);
  process.exit(1);
}

// Backup current file
const backupFile = targetFile + '.backup';
if (fs.existsSync(targetFile)) {
  fs.copyFileSync(targetFile, backupFile);
  console.log(`Backed up current aiService.js to aiService.js.backup`);
}

// Copy new implementation
fs.copyFileSync(sourceFile, targetFile);
console.log(`Switched to ${mode} AI service implementation`);

// Update the import/export to work properly
let content = fs.readFileSync(targetFile, 'utf8');

// Ensure proper export
if (!content.includes('export default')) {
  if (content.includes('const aiService')) {
    content += '\nexport default aiService;\n';
  } else if (content.includes('const aiServiceFallback')) {
    content += '\nexport default aiServiceFallback;\n';
  } else if (content.includes('const aiServiceStatic')) {
    content += '\nexport default aiServiceStatic;\n';
  }
  fs.writeFileSync(targetFile, content);
}

console.log(`AI Service switched to: ${mode}`);
console.log('');
console.log('Mode descriptions:');
console.log(`  ${mode === 'original' ? '→' : ' '} original: Full API integration (requires OpenAI key and working functions)`);
console.log(`  ${mode === 'fallback' ? '→' : ' '} fallback: Multiple retry strategies with graceful degradation`);
console.log(`  ${mode === 'static' ? '→' : ' '} static: Demo mode with realistic pre-generated responses`);
console.log('');
console.log('Run "npm run build" to rebuild the application with the new service.');
