const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const MOD_PATH = '.';
const CONFIG_FILE = path.join(MOD_PATH, 'syxcode.config.json');
const GOVERNANCE_FILE = path.join(MOD_PATH, 'tools/governance_hashes.json');
const INTEGRITY_FILE = path.join(MOD_PATH, 'tools/integrity_hashes.json');

/**
 * Phase 0: Preflight Security Audit (Zero-Trust)
 */
function runPreflight() {
    console.log('--- Phase 0: Preflight Security Audit ---');
    let preflightErrors = [];
    try {
        const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' });
        const forbidden = ['node_modules/', '.env', 'backups/', 'BASE STRUKTURE/'];
        forbidden.forEach(f => { if (stagedFiles.includes(f)) preflightErrors.push(`[PREFLIGHT] Forbidden data in staging: ${f}`); });
    } catch (e) { }

    const coreMaps = ['inventory_map.json', 'string_matrix.json', 'dependency_graph.json', 'syxcode.config.json'];
    coreMaps.forEach(map => {
        if (!fs.existsSync(path.join(MOD_PATH, map))) preflightErrors.push(`[PREFLIGHT] Missing core map: ${map}`);
    });

    if (preflightErrors.length > 0) {
        console.error('\n!!! PREFLIGHT FAILED !!!');
        preflightErrors.forEach(err => console.error(err));
        process.exit(1);
    }
    console.log('[PREFLIGHT] Environment and SOT maps verified.');
}

/**
 * Cross-Audit: Interlocks Inventory, Matrix, and Graph (Zero-Trust Interlock)
 */
function crossAuditSOT() {
    console.log('--- Phase 0.1: SOT Cross-Audit (Recursive Interlock) ---');
    let errors = [];
    const inventory = JSON.parse(fs.readFileSync(path.join(MOD_PATH, 'inventory_map.json'), 'utf8'));
    const graph = JSON.parse(fs.readFileSync(path.join(MOD_PATH, 'dependency_graph.json'), 'utf8'));
    const matrix = JSON.parse(fs.readFileSync(path.join(MOD_PATH, 'string_matrix.json'), 'utf8'));

    for (const category in inventory) {
        for (const [id, data] of Object.entries(inventory[category])) {
            if (!graph.nodes[id]) {
                errors.push(`[INTERLOCK] Entity ${id} (${category}) missing node in dependency_graph.json`);
            }
            const isLocalized = Object.keys(matrix.mappings).some(key => key.toLowerCase().includes(id.toLowerCase()));
            if (!isLocalized) {
                console.warn(`[INTERLOCK] Entity ${id} (${category}) might be missing localization.`);
            }
        }
    }

    if (errors.length > 0) {
        console.error('\n!!! SOT INTERLOCK FAILURE !!!');
        errors.forEach(err => console.error(err));
        process.exit(1);
    }
    console.log('[INTERLOCK] All entity maps interlocked.');
}

/**
 * Syncs project version and LLM.entry FILE_CONTEXT based on HISTORY.md
 */
function syncProjectVersion() {
    console.log('--- Phase 0.2: Multi-Root Syncing & Evidence Alignment ---');
    const historyPath = path.join(MOD_PATH, 'doku/HISTORY.md');
    if (!fs.existsSync(historyPath)) return;
    const history = fs.readFileSync(historyPath, 'utf8');
    const entryMatches = history.match(/### Entry (\d+)/g);
    if (!entryMatches) return;
    const latestNum = Math.max(...entryMatches.map(m => parseInt(m.match(/\d+/)[0])));
    const v = `0.0.${latestNum}`;
    const lastEntry = `Entry ${latestNum}`;

    const pkgP = path.join(MOD_PATH, 'package.json');
    if (fs.existsSync(pkgP)) { 
        const pkg = JSON.parse(fs.readFileSync(pkgP, 'utf8')); 
        if (pkg.version !== v) { 
            pkg.version = v; 
            fs.writeFileSync(pkgP, JSON.stringify(pkg, null, 2)); 
        } 
    }
    const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    if (cfg.version !== v) { 
        cfg.version = v; 
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2)); 
    }

    const allFiles = [...getAllFiles(path.join(MOD_PATH, cfg.paths.init_root), '.txt'), ...getAllFiles(path.join(MOD_PATH, cfg.paths.data_root), '.txt')];
    
    allFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        const parts = content.split(/#\s*STATE_HASH:[^\n]+/);
        const preHashContent = parts.length > 1 ? (parts[0] + parts[1]) : content;
        const dataOnly = preHashContent.split(/#\s*VERSION:[^\n]+/).pop().trim();
        const currentDataHash = crypto.createHash('sha256').update(dataOnly).digest('hex').substring(0, 16);

        if (!content.includes(`STATE_HASH: ${currentDataHash}`)) {
            if (content.includes('STATE_HASH:')) {
                content = content.replace(/STATE_HASH:\s*[a-f0-9]+/, `STATE_HASH: ${currentDataHash}`);
            } else {
                content = content.replace(/VERSION:\s*[^\n]+/, (m) => `${m}\n# STATE_HASH: ${currentDataHash}`);
            }
            modified = true;
        }

        if (content.includes('LAST_ENTRY:') && !content.includes(`LAST_ENTRY: ${lastEntry}`)) { 
            content = content.replace(/LAST_ENTRY:\s*Entry\s*\d+/, `LAST_ENTRY: ${lastEntry}`); 
            modified = true;
        }
        if (content.includes('VERSION:') && !content.includes(`VERSION: ${v}`)) { 
            content = content.replace(/VERSION:\s*\d+\.\d+\.\d+/, `VERSION: ${v}`); 
            modified = true; 
        }
        const rel = path.relative(MOD_PATH, file).replace(/\\/g, '/');
        if (content.includes('FILE_CONTEXT:') && !content.includes(`FILE_CONTEXT: ${rel}`)) { 
            content = content.replace(/FILE_CONTEXT:\s*[^\n]+/, `FILE_CONTEXT: ${rel}`); 
            modified = true; 
        }
        
        if (modified) fs.writeFileSync(file, content);
    });
}

function validateFiles() {
    runPreflight();
    syncProjectVersion();
    crossAuditSOT();
    
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    console.log(`--- Starting SyxCode Validation (${config.version} - Maximum Integrity) ---`);
    
    let errors = [];
    let integrity = fs.existsSync(INTEGRITY_FILE) ? JSON.parse(fs.readFileSync(INTEGRITY_FILE, 'utf8')) : {};
    const dataFiles = [...getAllFiles(path.join(MOD_PATH, config.paths.init_root), '.txt'), ...getAllFiles(path.join(MOD_PATH, config.paths.data_root), '.txt')];
    const history = fs.readFileSync(path.join(MOD_PATH, 'doku/HISTORY.md'), 'utf8');

    const hashes = new Map();
    dataFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const dataOnly = content.split(/#\s*VERSION:[^\n]+/).pop().trim();
        const hash = crypto.createHash('sha256').update(dataOnly).digest('hex');
        if (hashes.has(hash)) errors.push(`[DUPLICATE] Identical data in ${path.relative(MOD_PATH, file)} and ${path.relative(MOD_PATH, hashes.get(hash))}.`);
        else hashes.set(hash, file);
    });

    let currentIntegrity = {};
    dataFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const fileName = path.relative(MOD_PATH, file).replace(/\\/g, '/');
        currentIntegrity[fileName] = crypto.createHash('sha256').update(content).digest('hex');
        
        if (!content.includes('_ignoreVanilla: true')) errors.push(`[COMPATIBILITY] ${fileName} missing mandatory "_ignoreVanilla: true".`);
        
        const llm = content.match(/#\s*LLM\.entry[\s\S]*?STRUCTURE_EXPLANATION:\s*([\s\S]*?)ENGINE_DEFAULTS:\s*([\s\S]*?)LAST_ENTRY:\s*(Entry\s*\d+)[\s\S]*?FILE_CONTEXT:/);
        if (!llm) errors.push(`[VALIDATION] Missing LLM.entry in ${fileName}.`);
        else {
            if (llm[1].trim().length < 20) errors.push(`[ENTRY] EXPLANATION in ${fileName} too short.`);
            if (llm[2].trim().length < 20) errors.push(`[ENTRY] DEFAULTS in ${fileName} too short.`);
            if (!history.includes(`### ${llm[3].trim()}`)) errors.push(`[ENTRY] ${fileName} references invalid ${llm[3].trim()}.`);
        }
        
        if (/SKIP_VALIDATION|BYPASS_INTEGRITY/i.test(content)) errors.push(`[SECURITY] Bypass in ${fileName}`);
        if (!history.includes(fileName)) errors.push(`[DOCS] ${fileName} not in HISTORY.md`);
    });

    const inventory = JSON.parse(fs.readFileSync(path.join(MOD_PATH, 'inventory_map.json'), 'utf8'));
    for (const cat in inventory) {
        for (const [id, data] of Object.entries(inventory[cat])) {
            if (!fs.existsSync(path.join(MOD_PATH, data.path))) { errors.push(`[INVENTORY] Missing: ${data.path}`); continue; }
            const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(MOD_PATH, data.path), 'utf8')).digest('hex');
            const entryId = `${cat}:${id}`;
            if (integrity[entryId] && integrity[entryId] !== hash) errors.push(`[INTEGRITY] Unauthorized change in ${entryId}.`);
            currentIntegrity[entryId] = hash;
        }
    }

    if (errors.length > 0) {
        console.error('\n!!! VALIDATION FAILURE !!!');
        errors.forEach(err => console.error(err));
        process.exit(1);
    } else {
        fs.writeFileSync(INTEGRITY_FILE, JSON.stringify(currentIntegrity, null, 2));
        console.log('--- SUCCESS: Maximum Integrity verified ---');
    }
}

function getAllFiles(dirPath, ext) {
    let files = [];
    if (!fs.existsSync(dirPath)) return files;
    fs.readdirSync(dirPath).forEach(item => {
        const full = path.join(dirPath, item);
        if (fs.statSync(full).isDirectory()) files = files.concat(getAllFiles(full, ext));
        else if (item.endsWith(ext)) files.push(full);
    });
    return files;
}

// Check Governance (Untouchable Gate - Priority 0)
const gov = JSON.parse(fs.readFileSync(GOVERNANCE_FILE, 'utf8'));
for (const [f, h] of Object.entries(gov)) {
    if (!fs.existsSync(f)) continue;
    if (crypto.createHash('sha256').update(fs.readFileSync(f, 'utf8')).digest('hex') !== h) {
        console.error(`[TAMPER] Unauthorized modification in ${f}! Expected: ${h}`);
        process.exit(2);
    }
}

validateFiles();
