# SyxCode Governance Plan (V0.0.35)

## 🚨 Priority 0: The Untouchable Gate

**Korrekt vor Schnell.** Every change must be validated through `npm test`. Manipulation of the Gate (Validator) is strictly forbidden.

### Never Breaking Rules:

1. **Validator is SOT-Authority:** A failed test requires a correction of the data, the SOT, or the documentation. The Gate is never bypassed or disabled.
2. **Auto-Sync Mandate:** The Validator performs automatic synchronization of versions (`package.json`, `pom.xml`, `syxcode.config.json`) and file headers (`LLM.entry`) based on `HISTORY.md` as its first action.

---

## 🏗️ Three-Layer Governance Architecture

### **Layer 1: Preflight Security (Zero-Trust)**
- **Purpose:** Prevent unauthorized data injection before validation begins.
- **Checks:**
  - Git staging environment audit (forbidden directories)
  - Core SOT maps presence verification
  - Duplicate entry detection (SHA-256)
- **Exit Code:** 1 on failure

### **Layer 2: SOT Cross-Audit (Recursive Interlock)**
- **Purpose:** Ensure all SOT files are synchronized and consistent.
- **Checks:**
  - `inventory_map.json` → `dependency_graph.json` (every entity has a node)
  - `inventory_map.json` → `string_matrix.json` (localization mapping)
  - Entity integrity (STATE_HASH validation)
- **Exit Code:** 1 on failure

### **Layer 3: Governance Tamper Protection (Untouchable Gate)**
- **Purpose:** Detect unauthorized modifications to core framework files.
- **Mechanism:** SHA-256 hashes stored in `governance_hashes.json`
- **Protected Files:**
  - `tools/validator.js`
  - `tools/schema_whitelist.json`
  - `tools/integrity_hashes.json`
  - `syxcode.config.json`
  - `doku/LLM_ENTRY_DEFINITION.md`
  - `doku/GOVERNANCE_PLAN.md`
- **Exit Code:** 2 on tampering detected

---

## 📋 Governance Workflow

### **When to Update Governance:**

1. **After modifying core framework files:**
   ```bash
   npm run governance:update
   ```

2. **After significant version bumps:**
   - Update `package.json` version
   - Update `syxcode.config.json` version
   - Increment `HISTORY.md` entry
   - Run `npm run governance:update`

3. **Before committing protected files:**
   - `tools/validator.js` changes → update governance
   - `syxcode.config.json` changes → update governance
   - Documentation changes → update governance

---

## ⚠️ Governance Violations & Resolution

### **Scenario 1: Failed Preflight Audit**
```
!!! PREFLIGHT FAILED !!!
[PREFLIGHT] Forbidden data in staging: node_modules/
```
**Resolution:** Remove forbidden files from staging:
```bash
git reset HEAD node_modules/
```

### **Scenario 2: SOT Interlock Failure**
```
!!! SOT INTERLOCK FAILURE !!!
[INTERLOCK] Entity EXAMPLE (category) missing node in dependency_graph.json
```
**Resolution:** Add missing entity to `dependency_graph.json`:
```json
{
  "nodes": {
    "EXAMPLE": { "category": "category", "depends_on": [] }
  }
}
```

### **Scenario 3: Tamper Detection**
```
[TAMPER] Unauthorized modification in tools/validator.js! Expected: abc123...
```
**Resolution:** Either:
1. Revert the unauthorized change, OR
2. If the change is authorized, update governance:
   ```bash
   npm run governance:update
   ```

---

## 🔐 Mandatory Tags & Standards

### **LLM.entry Header (Required in all data files)**
```txt
# LLM.entry
# STRUCTURE_EXPLANATION: [Describe the entity structure]
# ENGINE_DEFAULTS: [Describe default engine behavior]
# VERSION: 0.0.35
# STATE_HASH: a1b2c3d4e5f6
# LAST_ENTRY: Entry 35
# FILE_CONTEXT: V70/init/race/EXAMPLE.txt
```

### **Mandatory Tag: _ignoreVanilla**
Every data file MUST include:
```
_ignoreVanilla: true,
```

### **Format Standard: Brace-and-Key**
```
KEY: VALUE,
NESTED: {
  CHILD: VALUE,
},
```

---

## 📊 Version Management

### **Automatic Version Sync**
The validator automatically updates:
- `package.json` version
- `pom.xml` version (if exists)
- `syxcode.config.json` version
- All `# LLM.entry` VERSION fields

**Source:** Latest `### Entry N` in `HISTORY.md` → Version becomes `0.0.N`

---

## 🛠️ Maintenance Commands

```bash
# Validate entire project
npm test

# Update governance hashes
npm run governance:update

# Check for tampering (part of npm test)
# Automatically runs at start of validation
```

---

## 📜 Governance Checklist

Before committing changes:

- [ ] All data files have `_ignoreVanilla: true`
- [ ] All data files have valid `# LLM.entry` headers
- [ ] `HISTORY.md` has a new entry documenting the change
- [ ] `npm test` passes with SUCCESS
- [ ] If framework files changed: `npm run governance:update` run
- [ ] `tools/governance_hashes.json` updated (if needed)
- [ ] No BYPASS_INTEGRITY or SKIP_VALIDATION tags exist
- [ ] No Git forbidden directories in staging

---

*Governance-First Development. Fail-Closed Architecture. LLM-Safe Framework.*
