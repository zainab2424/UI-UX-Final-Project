#!/usr/bin/env node

/**
 * List Figma files from a specific project
 * 
 * Usage:
 *   node list-project-files.js <project_id>
 * 
 * Requires FIGMA_ACCESS_TOKEN environment variable
 */

const https = require('https');

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

if (!FIGMA_ACCESS_TOKEN) {
  console.error('Error: FIGMA_ACCESS_TOKEN environment variable is required');
  process.exit(1);
}

const projectId = process.argv[2];

if (!projectId) {
  console.error('Usage: node list-project-files.js <project_id>');
  process.exit(1);
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'X-Figma-Token': FIGMA_ACCESS_TOKEN
      }
    };

    https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Failed to parse JSON response'));
          }
        } else {
          reject(new Error(`API request failed with status ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function listProjectFiles() {
  try {
    console.log(`Fetching files for project: ${projectId}...\n`);

    const filesUrl = `https://api.figma.com/v1/projects/${projectId}/files`;
    const files = await makeRequest(filesUrl);

    if (files.files && files.files.length > 0) {
      console.log(`Found ${files.files.length} file(s) in this project:\n`);
      
      files.files.forEach((file, index) => {
        console.log(`${index + 1}. ${file.name}`);
        console.log(`   Key: ${file.key}`);
        console.log(`   Last Modified: ${file.last_modified || 'N/A'}`);
        console.log(`   URL: https://www.figma.com/design/${file.key}`);
        console.log('');
      });
    } else {
      console.log('No files found in this project.');
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('401')) {
      console.error('\nAuthentication failed. Please check your FIGMA_ACCESS_TOKEN.');
    } else if (error.message.includes('403')) {
      console.error('\n⚠️  Permission denied. Your access token needs the "projects:read" scope.');
      console.error('To fix this:');
      console.error('1. Go to https://www.figma.com/developers/api#access-tokens');
      console.error('2. Delete your current token');
      console.error('3. Create a new token and make sure to select the "projects:read" scope');
      console.error('4. Update your FIGMA_ACCESS_TOKEN with the new token');
    } else if (error.message.includes('404')) {
      console.error('\nProject not found. Please check your project ID.');
    }
    process.exit(1);
  }
}

listProjectFiles();

