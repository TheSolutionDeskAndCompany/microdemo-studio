#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STAGING_URL = 'https://staging.microdemo.app';
const PRODUCTION_URL = 'https://app.microdemo.com';

// Get environment from command line argument
const env = process.argv[2] || 'staging';
const isProduction = env === 'production';
const targetUrl = isProduction ? PRODUCTION_URL : STAGING_URL;

console.log(`Building extension for ${env} environment`);
console.log(`Using Studio URL: ${targetUrl}`);

// Paths
const extensionDir = path.join(__dirname, '../apps/extension');
const backgroundPath = path.join(extensionDir, 'entrypoints/background.ts');
const outputDir = path.join(extensionDir, 'dist');

// Read the background script
let backgroundCode = fs.readFileSync(backgroundPath, 'utf8');

// Replace the STUDIO_BASE_URL
backgroundCode = backgroundCode.replace(
  /const STUDIO_BASE_URL = '[^']*'/, 
  `const STUDIO_BASE_URL = '${targetUrl}'`
);

// Write the modified file back
fs.writeFileSync(backgroundPath, backgroundCode, 'utf8');

// Build the extension
console.log('Building extension...');
try {
  // Run WXT build
  execSync('pnpm build', { 
    cwd: extensionDir,
    stdio: 'inherit'
  });

  console.log(`\n✅ Extension built successfully for ${env}!`);
  console.log(`Output directory: ${outputDir}`);
  
  // For production, create a zip file
  if (isProduction) {
    console.log('\nCreating production zip...');
    const zipCommand = `cd ${outputDir} && zip -r ../microdemo-extension-${env}.zip .`;
    execSync(zipCommand, { stdio: 'inherit' });
    console.log(`\n✅ Production zip created: ${outputDir}/../microdemo-extension-${env}.zip`);
  }
  
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
} finally {
  // Revert the changes to the background script
  const defaultUrl = 'http://localhost:3001';
  backgroundCode = backgroundCode.replace(
    /const STUDIO_BASE_URL = '[^']*'/, 
    `const STUDIO_BASE_URL = '${defaultUrl}'`
  );
  fs.writeFileSync(backgroundPath, backgroundCode, 'utf8');
}
