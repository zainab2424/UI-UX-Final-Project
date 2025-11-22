#!/usr/bin/env node

/**
 * List all Figma files accessible to the authenticated user
 * 
 * Usage:
 *   node list-all-figma-files.js
 * 
 * Requires FIGMA_ACCESS_TOKEN environment variable
 */

const https = require('https');

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

if (!FIGMA_ACCESS_TOKEN) {
  console.error('Error: FIGMA_ACCESS_TOKEN environment variable is required');
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

async function listAllFiles() {
  try {
    console.log('Fetching your Figma files...\n');

    // Get user info
    const userUrl = 'https://api.figma.com/v1/me';
    const user = await makeRequest(userUrl);
    console.log(`Logged in as: ${user.email}\n`);

    // Get user's teams - try to get from user endpoint
    // Note: Figma API doesn't have a direct "list my teams" endpoint
    // We need to know team IDs, but we can try to get files from a known file
    
    console.log('Note: Figma API requires a team ID to list files.');
    console.log('However, I can show you information about a specific file.\n');
    
    // If a file key is provided, get its info
    const fileKey = process.argv[2];
    if (fileKey) {
      console.log(`Fetching file: ${fileKey}...\n`);
      const fileUrl = `https://api.figma.com/v1/files/${fileKey}`;
      const fileData = await makeRequest(fileUrl);
      
      console.log('📄 File Information:');
      console.log(`   Name: ${fileData.name}`);
      console.log(`   Key: ${fileKey}`);
      console.log(`   Last Modified: ${fileData.lastModified || 'N/A'}`);
      
      // Try to get project files if we can determine project ID
      // Unfortunately, the file endpoint doesn't return project/team IDs directly
    }

    console.log('\nTo list all files, you need to:');
    console.log('1. Find your team ID from a Figma URL');
    console.log('2. Run: node list-figma-files.js <team_id>');
    console.log('\nOr provide a file key to get its details:');
    console.log('   node list-all-figma-files.js <file_key>');

  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('401')) {
      console.error('\nAuthentication failed. Please check your FIGMA_ACCESS_TOKEN.');
    } else if (error.message.includes('404')) {
      console.error('\nFile not found. Please check your file key.');
    }
    process.exit(1);
  }
}

listAllFiles();

