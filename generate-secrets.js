#!/usr/bin/env node

/**
 * Generate Production Secrets for ProjectHub
 * 
 * Run this script to generate secure random secrets for your production deployment.
 * Usage: node generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 ProjectHub - Production Secrets Generator\n');
console.log('='.repeat(60));
console.log('\nCopy these values to your production environment variables:\n');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('JWT_SECRET=');
console.log(jwtSecret);
console.log('');

// Generate JWT Refresh Secret
const jwtRefreshSecret = crypto.randomBytes(32).toString('hex');
console.log('JWT_REFRESH_SECRET=');
console.log(jwtRefreshSecret);
console.log('');

// Generate PostgreSQL Password
const dbPassword = crypto.randomBytes(16).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
console.log('POSTGRES_PASSWORD=');
console.log(dbPassword);
console.log('');

console.log('='.repeat(60));
console.log('\n⚠️  IMPORTANT: Keep these secrets secure!');
console.log('   - Never commit them to git');
console.log('   - Store them in your deployment platform\'s environment variables');
console.log('   - Use different secrets for each environment (dev/staging/prod)\n');
console.log('📖 See DEPLOYMENT.md for full deployment instructions\n');
