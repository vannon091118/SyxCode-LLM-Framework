# SyxCode LLM Framework (V0.0.35)

> **LLM-safe validation framework with Zero-Trust Governance**
> 
> Universal reusable framework for data integrity, LLM alignment, and fail-closed validation.

---

## 🚨 Priority 0: The Untouchable Gate

**Korrekt vor Schnell.** All changes must pass `npm test`. The validator is never bypassed.

### Never Breaking Rules:
1. **Validator is SOT-Authority:** Failed tests require data/SOT/documentation corrections.
2. **Auto-Sync Mandate:** Validator automatically aligns versions and headers on first run.

---

## 📦 What is SyxCode?

SyxCode is a **framework for governance-first development**. It ensures:

- ✅ **Data Integrity:** SHA-256 hashing and interlock verification
- ✅ **LLM Alignment:** Structured LLM.entry headers prevent hallucinations
- ✅ **Fail-Closed:** No bypasses, shortcuts, or disabled validation
- ✅ **Auto-Sync:** Versions and documentation auto-update from HISTORY.md
- ✅ **Tamper Detection:** Framework files are protected with governance hashes
- ✅ **Universal:** Use for any domain—configure paths for your project

---

## 🏗️ Three-Layer Governance

### **Layer 1: Preflight Security (Zero-Trust)**
- Git environment audit (prevents forbidden data injection)
- Core SOT maps verification
- Duplicate entry detection

### **Layer 2: SOT Cross-Audit (Recursive Interlock)**
- `inventory_map.json` ↔ `dependency_graph.json` ↔ `string_matrix.json`
- Every entity must exist in all three maps
- Localization strings enforced

### **Layer 3: Tamper Protection (Untouchable Gate)**
- SHA-256 hashes stored in `governance_hashes.json`
- Detects unauthorized modifications
- Exit code 2 on tampering (or 0 after `npm run governance:update`)

---

## 🚀 Quick Start

### **1. Install**
```bash
npm install
```

### **2. Configure** (`syxcode.config.json`)
```json
{
  "version": "0.0.35",
  "paths": {
    "init_root": "data/init",
    "data_root": "data",
    "doku": "doku"
  }
}
```
See `example/README.md` for full setup guide.

### **3. Validate**
```bash
npm test
```

### **4. Update Governance** (after framework changes)
```bash
npm run governance:update
```

---

## 📋 Mandatory Standards

### **Every Data File Requires:**

```txt
# LLM.entry
# STRUCTURE_EXPLANATION: [What this entity does]
# ENGINE_DEFAULTS: [Default engine behavior]
# VERSION: 0.0.35
# STATE_HASH: a1b2c3d4e5f6
# LAST_ENTRY: Entry 2
# FILE_CONTEXT: path/to/file.json
```

### **Format: Brace-and-Key**
```
KEY: VALUE,
NESTED: {
  CHILD: VALUE,
},
```

### **Localization: ¤¤ Prefix**
```
NAME: ¤¤Entity_Name,
DESCRIPTION: ¤¤Entity_Description,
```

---

## 📊 Core Files

| File | Purpose |
|------|----------|
| `tools/validator.js` | Main validator (Preflight → SOT Cross-Audit → File Validation) |
| `tools/governance_updater.js` | Maintains governance hashes |
| `syxcode.config.json` | Framework configuration (paths, validation rules) |
| `tools/governance_hashes.json` | SHA-256 hashes of protected framework files |
| `doku/GOVERNANCE_PLAN.md` | Governance workflow & violation resolution |
| `doku/LLM_ENTRY_DEFINITION.md` | LLM.entry standards & validation rules |
| `example/README.md` | Step-by-step usage guide for new projects |

---

## 🔍 Validation Workflow

```
┌─────────────────────────────────────────┐
│ npm test                                 │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│ Phase 0: Preflight Security Audit       │
│ - Git environment check                 │
│ - Core maps verification                │
│ - Duplicate detection                   │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│ Phase 0.1: SOT Cross-Audit              │
│ - Inventory ↔ Graph ↔ Matrix interlock  │
│ - Localization check                    │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│ Phase 0.2: Multi-Root Syncing           │
│ - Auto-sync VERSION from HISTORY.md     │
│ - Auto-sync STATE_HASH                  │
│ - Auto-sync LAST_ENTRY                  │
│ - Auto-sync FILE_CONTEXT                │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│ Phase 0.3: Tamper Detection             │
│ - Verify governance_hashes.json         │
│ - Exit code 2 on tampering              │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│ Phase 1: File Validation                │
│ - LLM.entry completeness                │
│ - Mandatory tag presence                │
│ - Bypass detection                      │
│ - HISTORY.md cross-reference            │
└─────────────────────────────────────────┘
                    │
                    ▼
          SUCCESS or FAILURE
       (Exit code 0 or 1)
```

---

## ✅ Common Issues & Fixes

### **Issue: Preflight failed - forbidden data**
```
[PREFLIGHT] Forbidden data in staging: node_modules/
```
**Fix:**
```bash
git reset HEAD node_modules/
```

### **Issue: SOT interlock failure**
```
[INTERLOCK] Entity EXAMPLE missing node in dependency_graph.json
```
**Fix:** Add entity to `dependency_graph.json`.

### **Issue: Tamper detection**
```
[TAMPER] Unauthorized modification in tools/validator.js!
```
**Fix:** Either revert the change or update governance:
```bash
npm run governance:update
```

---

## 🛠️ Extending the Framework

### **Add a New SOT Map:**
1. Create new JSON file (e.g., `custom_map.json`)
2. Add validation logic to `tools/validator.js`
3. Reference in `syxcode.config.json`
4. Run `npm run governance:update`
5. Test with `npm test`

### **Add a New Validation Rule:**
1. Modify `tools/validator.js` (add validation function)
2. Add documentation to `doku/LLM_ENTRY_DEFINITION.md`
3. Run `npm run governance:update`
4. Update `HISTORY.md` with an entry

---

## 📜 Version Management

Version is automatically derived from `HISTORY.md`:
- Latest `### Entry N` → Version becomes `0.0.N`
- On first run of `npm test`, all versions auto-sync
- No manual version bumping needed

Current Version: **0.0.35**

---

## 📖 Further Reading

- **[MIGRATION.md](MIGRATION.md)** — Explains cleanup and architectural separation
- **[example/README.md](example/README.md)** — Step-by-step setup for your project
- **[GOVERNANCE_PLAN.md](doku/GOVERNANCE_PLAN.md)** — Governance workflow & checklist
- **[LLM_ENTRY_DEFINITION.md](doku/LLM_ENTRY_DEFINITION.md)** — Entry standards & validation rules
- **[HISTORY.md](doku/HISTORY.md)** — Complete structural history

---

## 🎯 Design Philosophy

> **Korrekt vor Schnell** (Correctness before speed)

SyxCode prioritizes:
1. **Data Integrity** over convenience
2. **Fail-Closed** over fail-open
3. **Governance** over permissiveness
4. **Documentation** over guesswork

The validator is the **Source of Truth**. It is never bypassed.

---

*Built with LLM-Safe principles. Governance-First Development. Fail-Closed Architecture.*

**Powered by SyxCode Framework V0.0.35**
