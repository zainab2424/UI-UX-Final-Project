#!/usr/bin/env node

/**
 * List Figma teams for the authenticated user
 * 
 * Usage:
 *   node list-figma-teams.js
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

async function listTeams() {
  try {
    console.log('Fetching your teams...\n');

    // Get user info first
    const userUrl = 'https://api.figma.com/v1/me';
    const user = await makeRequest(userUrl);
    
    console.log(`Logged in as: ${user.email}\n`);
    console.log('Note: Figma API requires a team ID to list teams.');
    console.log('To find your team ID:\n');
    console.log('1. Go to your Figma team page in a browser');
    console.log('2. Look at the URL - it will be: figma.com/files/team/{TEAM_ID}/...');
    console.log('3. The TEAM_ID is the numeric part in the URL\n');
    console.log('Alternatively, you can:');
    console.log('- Go to any file in your team');
    console.log('- The URL will contain the team ID\n');
    console.log('Once you have the team ID, run:');
    console.log('  node list-figma-files.js <team_id>\n');

  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('401')) {
      console.error('\nAuthentication failed. Please check your FIGMA_ACCESS_TOKEN.');
    }
    process.exit(1);
  }
}

listTeams();

