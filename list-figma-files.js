#!/usr/bin/env node

/**
 * List Figma files
 * 
 * Usage:
 *   node list-figma-files.js [team_id]
 * 
 * Requires FIGMA_ACCESS_TOKEN environment variable
 */

const https = require('https');

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

if (!FIGMA_ACCESS_TOKEN) {
  console.error('Error: FIGMA_ACCESS_TOKEN environment variable is required');
  console.error('Get your token from: https://www.figma.com/developers/api#access-tokens');
  process.exit(1);
}

const teamId = process.argv[2];

if (!teamId) {
  console.error('Usage: node list-figma-files.js <team_id>');
  console.error('\nTo find your team ID:');
  console.error('1. Go to your Figma team page');
  console.error('2. The team ID is in the URL: figma.com/files/team/{team_id}/...');
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

async function listFiles() {
  try {
    console.log(`Fetching projects for team: ${teamId}...\n`);

    // First, get all projects for the team
    const projectsUrl = `https://api.figma.com/v1/teams/${teamId}/projects`;
    const projects = await makeRequest(projectsUrl);

    if (!projects.projects || projects.projects.length === 0) {
      console.log('No projects found in this team.');
      return;
    }

    console.log(`Found ${projects.projects.length} project(s):\n`);

    // For each project, get the files
    for (const project of projects.projects) {
      console.log(`📁 Project: ${project.name} (${project.id})`);
      
      try {
        const filesUrl = `https://api.figma.com/v1/projects/${project.id}/files`;
        const files = await makeRequest(filesUrl);

        if (files.files && files.files.length > 0) {
          files.files.forEach((file, index) => {
            console.log(`  ${index + 1}. ${file.name}`);
            console.log(`     Key: ${file.key}`);
            console.log(`     Last Modified: ${file.last_modified || 'N/A'}`);
            console.log('');
          });
        } else {
          console.log('  (No files in this project)');
          console.log('');
        }
      } catch (err) {
        console.error(`  Error fetching files: ${err.message}`);
        console.log('');
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('401')) {
      console.error('\nAuthentication failed. Please check your FIGMA_ACCESS_TOKEN.');
    } else if (error.message.includes('404')) {
      console.error('\nTeam not found. Please check your team ID.');
    }
    process.exit(1);
  }
}

listFiles();

