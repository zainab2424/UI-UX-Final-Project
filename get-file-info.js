#!/usr/bin/env node

/**
 * Get Figma file information including team/project details
 * 
 * Usage:
 *   node get-file-info.js <file_key>
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
  console.error('Usage: node get-file-info.js <file_key>');
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

async function getFileInfo() {
  try {
    console.log(`Fetching file information for: ${fileKey}...\n`);

    const fileUrl = `https://api.figma.com/v1/files/${fileKey}`;
    const fileData = await makeRequest(fileUrl);

    console.log('📄 File Information:');
    console.log(`   Name: ${fileData.name}`);
    console.log(`   Key: ${fileData.key}`);
    console.log(`   Last Modified: ${fileData.lastModified || 'N/A'}`);
    console.log(`   Version: ${fileData.version || 'N/A'}`);
    
    if (fileData.document) {
      console.log(`   Document Type: ${fileData.document.type || 'N/A'}`);
    }

    // Try to get project info if available
    if (fileData.project) {
      console.log(`\n📁 Project: ${fileData.project.name} (${fileData.project.id})`);
    }

    // Try to get team info
    if (fileData.team) {
      console.log(`\n👥 Team: ${fileData.team.name} (${fileData.team.id})`);
      console.log(`\nTo list all files in this team, run:`);
      console.log(`   node list-figma-files.js ${fileData.team.id}`);
    }

    // Get file nodes count if available
    if (fileData.document && fileData.document.children) {
      const countNodes = (node) => {
        let count = 1;
        if (node.children) {
          node.children.forEach(child => {
            count += countNodes(child);
          });
        }
        return count;
      };
      const nodeCount = countNodes(fileData.document);
      console.log(`\n📊 Total nodes in file: ${nodeCount}`);
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

getFileInfo();

