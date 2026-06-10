const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Governance Updater Tool
 * Maintains and updates governance_hashes.json for core framework files
 * Usage: npm run governance:update
 */

const GOVERNANCE_FILE = 'tools/governance_hashes.json';
const CORE_FILES = [
    'tools/validator.js',
    'tools/schema_whitelist.json',
    'tools/integrity_hashes.json',
    'syxcode.config.json',
    'doku/LLM_ENTRY_DEFINITION.md',
    'doku/GOVERNANCE_PLAN.md'
];

function calculateHash(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`[GOVERNANCE] File not found: ${filePath}`);
            return null;
        }
        const content = fs.readFileSync(filePath, 'utf8');
        return crypto.createHash('sha256').update(content).digest('hex');
    } catch (e) {
        console.error(`[GOVERNANCE] Error reading ${filePath}: ${e.message}`);
        return null;
    }
}

function updateGovernance() {
    console.log('--- Governance Hash Update ---');
    let governance = {};

    CORE_FILES.forEach(file => {
        const hash = calculateHash(file);
        if (hash) {
            governance[file] = hash;
            console.log(`[OK] ${file}`);
        }
    });

    fs.writeFileSync(GOVERNANCE_FILE, JSON.stringify(governance, null, 2));
    console.log(`\n[SUCCESS] Governance hashes updated in ${GOVERNANCE_FILE}`);
}

updateGovernance();
