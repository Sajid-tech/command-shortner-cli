#!/usr/bin/env node

// This file ensures the post-install script runs for both npm i and npm i -g
const path = require('path');
const fs = require('fs');


const postInstallScript = path.join(__dirname, '..', 'scripts', 'post-install.js');


if (fs.existsSync(postInstallScript)) {
  try {
   
    require(postInstallScript);
  } catch (error) {
    console.error('Failed to run post-install script:', error);
  }
} else {
  console.error('Post-install script not found at:', postInstallScript);
}