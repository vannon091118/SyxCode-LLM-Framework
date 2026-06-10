# LLM.entry Standard Definition (V0.0.35)

## 🎯 Purpose

The `# LLM.entry` header is a structured documentation block embedded in every data file. It serves as the **bridge between human intent and LLM understanding**, enabling the validator to audit both structural and semantic correctness.

---

## 📋 Mandatory Fields

Every data file MUST include all fields in this exact order:

```txt
# LLM.entry
# STRUCTURE_EXPLANATION: [Description of what this entity does]
# ENGINE_DEFAULTS: [Default behavior expected from the engine]
# VERSION: 0.0.35
# STATE_HASH: a1b2c3d4e5f6
# LAST_ENTRY: Entry 35
# FILE_CONTEXT: V70/init/race/EXAMPLE.txt
```

### **Field Specifications:**

| Field | Type | Min Length | Purpose |
|-------|------|-----------|----------|
| `STRUCTURE_EXPLANATION` | Text | 20 chars | Explain entity purpose & structure |
| `ENGINE_DEFAULTS` | Text | 20 chars | Document engine behavior expectations |
| `VERSION` | Semantic | N/A | Synced automatically from HISTORY.md |
| `STATE_HASH` | SHA-256 (16 chars) | 16 | First 16 chars of content hash |
| `LAST_ENTRY` | Entry Reference | N/A | References `### Entry N` in HISTORY.md |
| `FILE_CONTEXT` | Path | N/A | Relative path from repo root |

---

## ✅ Validation Rules

### **Rule 1: Entry Completeness**
Every file must contain all 7 mandatory fields in LLM.entry.

**Failure:**
```
[VALIDATION] Missing LLM.entry in V70/init/race/EXAMPLE.txt
```

**Fix:** Add complete LLM.entry block.

---

### **Rule 2: Explanation Quality**
`STRUCTURE_EXPLANATION` must be at least 20 characters and meaningful.

**Failure:**
```
[ENTRY] EXPLANATION in V70/init/race/EXAMPLE.txt too short.
```

**Fix:**
```txt
# STRUCTURE_EXPLANATION: Defines a humanoid race with specific traits and starting conditions.
```

---

### **Rule 3: Defaults Quality**
`ENGINE_DEFAULTS` must be at least 20 characters and meaningful.

**Failure:**
```
[ENTRY] DEFAULTS in V70/init/race/EXAMPLE.txt too short.
```

**Fix:**
```txt
# ENGINE_DEFAULTS: Loads this race as an available starting option. Initializes with base attributes from V70 engine templates.
```

---

### **Rule 4: Entry Reference Validity**
`LAST_ENTRY` must reference an existing entry in `HISTORY.md`.

**Failure:**
```
[ENTRY] V70/init/race/EXAMPLE.txt references invalid Entry 999.
```

**Fix:** Update `LAST_ENTRY` to match latest entry in `HISTORY.md`.

---

### **Rule 5: STATE_HASH Correctness**
`STATE_HASH` must be the first 16 characters of the SHA-256 hash of the file's data section (excluding LLM.entry).

**How the validator calculates it:**
1. Strip `# LLM.entry` block and everything up to `# VERSION:`
2. Hash the remaining data
3. Extract first 16 hex characters
4. Compare with `STATE_HASH` field

**Failure:** Validator auto-corrects or flags as tampering attempt.

---

### **Rule 6: Mandatory Tag Presence**
Every file MUST include `_ignoreVanilla: true` as a content tag.

**Failure:**
```
[COMPATIBILITY] V70/init/race/EXAMPLE.txt missing mandatory "_ignoreVanilla: true".
```

**Fix:** Add to file:
```
_ignoreVanilla: true,
```

---

### **Rule 7: File Context Accuracy**
`FILE_CONTEXT` must match the actual file's relative path.

**Automatic:** Validator auto-syncs this field during Phase 0.2 (Multi-Root Syncing).

---

### **Rule 8: No Bypass Tags**
Files must NOT contain bypass or skip validation tags.

**Forbidden:**
```
SKIP_VALIDATION
BYPASS_INTEGRITY
```

**Failure:**
```
[SECURITY] Bypass in V70/init/race/EXAMPLE.txt
```

---

### **Rule 9: HISTORY.md Cross-Reference**
Every file must be documented in `HISTORY.md`.

**Failure:**
```
[DOCS] V70/init/race/EXAMPLE.txt not in HISTORY.md
```

**Fix:** Add entry to HISTORY.md documenting file creation/modification.

---

## 📝 Example: Complete Valid File

```txt
# LLM.entry
# STRUCTURE_EXPLANATION: Defines a humanoid race with affinities to climate zones, learning bonuses, and cultural traits.
# ENGINE_DEFAULTS: V70 engine loads as a playable starting race with base attributes, climate affinity, and tech restrictions.
# VERSION: 0.0.35
# STATE_HASH: a1b2c3d4e5f6
# LAST_ENTRY: Entry 35
# FILE_CONTEXT: V70/init/race/HUMAN.txt

_ignoreVanilla: true,

RACE_ID: HUMAN,
NAME: ¤¤Human_Name,
DESCRIPTION: ¤¤Human_Desc,

ATTRIBUTES: {
  STRENGTH: 10,
  WISDOM: 11,
  INTELLIGENCE: 10,
  CONSTITUTION: 10,
},

CLIMATE_AFFINITY: {
  TEMPERATE: 1.1,
  DESERT: 0.9,
  ARCTIC: 0.8,
},
```

---

## 🚀 Workflow: Adding a New File

1. **Create file in correct location** (e.g., `V70/init/race/NEWRACE.txt`)
2. **Add LLM.entry header** with all fields
3. **Add content** with `_ignoreVanilla: true`
4. **Add entry to HISTORY.md** documenting the addition
5. **Run `npm test`**
   - Validator auto-syncs VERSION, STATE_HASH, and FILE_CONTEXT
   - Validator validates entry completeness and quality
6. **Commit with updated governance** (if framework files changed)

---

## 🔍 Validation Phases

### **Phase 0: Preflight Security**
- Git environment audit
- Core SOT map verification

### **Phase 0.1: SOT Cross-Audit**
- Inventory → Graph → Matrix interlock check

### **Phase 0.2: Multi-Root Syncing**
- Auto-sync VERSION from HISTORY.md
- Auto-sync STATE_HASH (recalculated)
- Auto-sync LAST_ENTRY to latest Entry
- Auto-sync FILE_CONTEXT to correct path

### **Phase 1: File Validation**
- LLM.entry completeness
- Mandatory tag presence (_ignoreVanilla)
- Bypass tag detection
- HISTORY.md cross-reference

---

## ⚠️ Priority 0: Gate Integrity Mandate

**It is strictly forbidden to bypass the validator or disable validation to resolve a failed test.**

Rules are immutable. When `npm test` fails:

1. **Never modify validator.js to skip checks**
2. **Never remove validation logic**
3. **Never add bypass tags** (SKIP_VALIDATION, BYPASS_INTEGRITY)
4. **Always fix the root cause:**
   - Correct the data (file content)
   - Correct the SOT (inventory_map.json, etc.)
   - Correct the documentation (HISTORY.md)

The validator remains fail-closed and prevents shortcuts.

---

*LLM-Safe Standards. Fail-Closed Validation. Governance-First Development.*
