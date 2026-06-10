const fs = require('fs');
const path = require('path');
const { DOMParser } = require('xmldom');
const crypto = require('crypto');

const MOD_PATH = '.';
const CONFIG_FILE = path.join(MOD_PATH, 'syxcode.config.json');

if (!fs.existsSync(CONFIG_FILE)) {
    console.error('Configuration file syxcode.config.json missing!');
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
const DOKU_PATH = path.join(MOD_PATH, config.paths.doku);
const DATA_PATH = path.join(MOD_PATH, config.paths.data_init);
const INTEGRITY_FILE = path.join(MOD_PATH, 'tools/integrity_hashes.json');

function getHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

function validateFiles() {
    console.log(`--- Starting SyxCode Validation (${config.game_version}) ---`);
    let errors = [];
    let integrity = {};
    if (fs.existsSync(INTEGRITY_FILE)) {
        integrity = JSON.parse(fs.readFileSync(INTEGRITY_FILE, 'utf8'));
    }

    const xmlFiles = getAllFiles(DATA_PATH, '.xml');
    const inventory = JSON.parse(fs.readFileSync(path.join(MOD_PATH, 'inventory_map.json'), 'utf8'));
    const matrix = JSON.parse(fs.readFileSync(path.join(MOD_PATH, 'string_matrix.json'), 'utf8'));
    const history = fs.readFileSync(path.join(DOKU_PATH, 'HISTORY.md'), 'utf8');
    const graph = JSON.parse(fs.readFileSync(path.join(MOD_PATH, 'dependency_graph.json'), 'utf8'));

    let currentIntegrity = {};

    // 1. Structural, LLM.entry & Anti-Bypass
    xmlFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const fileName = path.relative(MOD_PATH, file).replace(/\\/g, '/');
        const fileHash = getHash(content);
        currentIntegrity[fileName] = fileHash;

        // ACTUAL LLM.entry CHECK
        if (config.validation.require_llm_entry) {
            if (!content.includes('LLM.entry') || !content.includes('STRUCTURE_EXPLANATION') || !content.includes('ENGINE_DEFAULTS')) {
                errors.push(`[VALIDATION] Missing or incomplete LLM.entry in ${fileName}. Requirements: LLM.entry, STRUCTURE_EXPLANATION, ENGINE_DEFAULTS.`);
            }
        }

        const forbiddenPatterns = [/if\s*\(?\s*false\s*\)?\s*==\s*PASS/i, /SKIP_VALIDATION/i, /BYPASS_INTEGRITY/i];
        forbiddenPatterns.forEach(pattern => {
            if (pattern.test(content)) {
                errors.push(`[SECURITY] Injection/Bypass detected in ${fileName}: ${pattern}`);
            }
        });

        if (!history.includes(fileName)) {
            errors.push(`[DOCS] File ${fileName} is not documented in HISTORY.md`);
        }
    });

    // 2. Dependency Graph Audit
    if (config.validation.check_graph) {
        console.log('--- Auditing Dependency Graph ---');
        graph.edges.forEach(edge => {
            const fromNode = graph.nodes[edge.from];
            const toNode = graph.nodes[edge.to];

            if (!fromNode) errors.push(`[GRAPH] Source node "${edge.from}" not defined in nodes.`);
            if (!toNode) errors.push(`[GRAPH] Target node "${edge.to}" not defined in nodes.`);

            const invStr = JSON.stringify(inventory);
            if (!invStr.includes(`"${edge.from}"`)) errors.push(`[GRAPH] Node "${edge.from}" missing from inventory_map.`);
            if (!invStr.includes(`"${edge.to}"`)) errors.push(`[GRAPH] Node "${edge.to}" missing from inventory_map.`);
        });
    }

    // 3. Data Integrity & Hash Comparison
    if (config.validation.check_integrity) {
        for (const category in inventory) {
            for (const [id, data] of Object.entries(inventory[category])) {
                const fullPath = path.join(MOD_PATH, data.path);
                if (!fs.existsSync(fullPath)) {
                    errors.push(`[INVENTORY] ${category}:${id} references missing file: ${data.path}`);
                    continue;
                }

                const xmlContent = fs.readFileSync(fullPath, 'utf8');
                const doc = new DOMParser().parseFromString(xmlContent, 'text/xml');
                const tags = doc.getElementsByTagName('*');
                let found = false;

                for (let i = 0; i < tags.length; i++) {
                    const node = tags[i];
                    if (node.getAttribute('id') === id || node.getAttribute('identifier') === id) {
                        found = true;
                        const entryHash = getHash(node.toString());
                        const entryId = `${category}:${id}`;
                        
                        if (integrity[entryId] && integrity[entryId] !== entryHash) {
                            errors.push(`[INTEGRITY] Unauthorized change in ${entryId}. Run must be approved.`);
                        }
                        currentIntegrity[entryId] = entryHash;
                    }
                }

                if (!found) {
                    errors.push(`[DATA] ${category}:${id} defined in inventory map but missing in ${data.path}`);
                }
            }
        }
    }

    // 4. String Matrix Sync
    const usedStrings = new Map();
    xmlFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        matrix.strings.forEach(str => {
            if (content.includes(str)) {
                if (!usedStrings.has(str)) usedStrings.set(str, []);
                usedStrings.get(str).push(path.relative(MOD_PATH, file));
            }
        });
    });

    matrix.strings.forEach(str => {
        if (!usedStrings.has(str)) {
            errors.push(`[MATRIX] String "${str}" in matrix is unused.`);
        }
    });

    fs.writeFileSync(INTEGRITY_FILE, JSON.stringify(currentIntegrity, null, 2));

    if (errors.length > 0) {
        console.error('\n!!! VALIDATION FAILURE !!!');
        errors.forEach(err => console.error(err));
        process.exit(1);
    } else {
        console.log('--- SUCCESS: Integrity & Configuration verified ---');
    }
}


function getAllFiles(dirPath, extension) {
    let files = [];
    if (!fs.existsSync(dirPath)) return files;
    const items = fs.readdirSync(dirPath);
    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(getAllFiles(fullPath, extension));
        } else if (item.endsWith(extension)) {
            files.push(fullPath);
        }
    });
    return files;
}

validateFiles();
