#!/usr/bin/env node

/**
 * Attempt to find team/project info from a Figma file
 * and then list all files in that project/team
 * 
 * Usage:
 *   node find-team-from-file.js <file_key>
 * 
 * Requires FIGMA_ACCESS_TOKEN environment variable
 */

const https = require('https');

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

if (!FIGMA_ACCESS_TOKEN) {
  console.error('Error: FIGMA_ACCESS_TOKEN environment variable is required');
  process.exit(1);
}

const fileKey = process.argv[2];

if (!fileKey) {
  console.error('Usage: node find-team-from-file.js <file_key>');
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

async function findTeamAndListFiles() {
  try {
    console.log(`Analyzing file: ${fileKey}...\n`);

    // Get file info
    const fileUrl = `https://api.figma.com/v1/files/${fileKey}`;
    const fileData = await makeRequest(fileUrl);
    
    console.log('📄 File Information:');
    console.log(`   Name: ${fileData.name}`);
    console.log(`   Key: ${fileKey}`);
    console.log(`   Last Modified: ${fileData.lastModified || 'N/A'}\n`);

    console.log('⚠️  Note: Figma API does not return team/project IDs from the file endpoint.');
    console.log('To list all files, you need your Team ID.\n');
    console.log('📋 How to find your Team ID:');
    console.log('   1. Open your Figma file in a browser');
    console.log('   2. Look at the URL - if it shows the old format:');
    console.log('      figma.com/files/team/{TEAM_ID}/project/{PROJECT_ID}/file/{FILE_KEY}');
    console.log('   3. The TEAM_ID is the number after /team/\n');
    console.log('   OR for the new format (like yours):');
    console.log('   1. Go to your Figma team dashboard');
    console.log('   2. The URL will be: figma.com/files/team/{TEAM_ID}/...');
    console.log('   3. Copy that TEAM_ID number\n');
    console.log('Once you have the Team ID, run:');
    console.log(`   node list-figma-files.js <team_id>\n`);

    // Try to get file comments which might have project context
    try {
      const commentsUrl = `https://api.figma.com/v1/files/${fileKey}/comments`;
      const comments = await makeRequest(commentsUrl);
      console.log(`📝 Found ${comments.meta ? comments.meta.comment_count || 0 : 0} comments on this file`);
    } catch (e) {
      // Comments endpoint might not be available or might fail
    }

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

findTeamAndListFiles();

