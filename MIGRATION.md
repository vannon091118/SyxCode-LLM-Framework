# SyxCode LLM Framework - Migration & Cleanup Notes

## What Changed (v0.0.35 Cleanup)

### Removed (SyxCraft-Specific Content)

#### `_Info.txt`
- **Before:** Identified as "Syxcraft Overhaul" v0.0.1
- **After:** Now identifies as "SyxCode LLM Framework" v0.0.35
- **Reason:** This repository is the generic framework, not the SyxCraft mod project

#### `pom.xml`
- **Why it existed:** SyxCraft (mod project) uses Maven for Java compilation and Songs of Syx JAR integration
- **Why removed:** Not relevant to this framework repository (JavaScript/Node.js)
- **SyxCraft Impact:** SyxCraft project has its own `pom.xml` in its separate repository

#### `V70/` Directory (entire folder)
- **Why it existed:** V70 = Songs of Syx version 70 data (XML templates, race definitions, tech trees, etc.)
- **Why removed:** Framework should not be bundled with game-specific data
- **SyxCraft Impact:** SyxCraft project contains its own V70/ with actual mod data

#### `local.properties.example`
- **Why it existed:** Maven configuration for Songs of Syx game path detection
- **Why removed:** Maven is gone, and this is framework-specific to SyxCraft

### Updated

#### `syxcode.config.json`
- **Before:** Hardcoded `"init_root": "V70/init"`, `"data_root": "V70/data"`
- **After:** Generic defaults: `"init_root": "data/init"`, `"data_root": "data"`
- **Impact:** Projects using SyxCode can now override paths in their own `syxcode.config.json`
- **Note:** Added `_note` field explaining override pattern

#### `_Info.txt`
- **Before:** SyxCraft project identity (name, version 0.0.1, author info)
- **After:** Generic framework identity (version now 0.0.35, matching validator)
- **Impact:** Framework now has single source of truth for version (HISTORY.md → validator → _Info.txt)

### Added

#### `example/` Directory
- **Purpose:** Demonstrates how to use SyxCode for non-SyxCraft projects
- **Contents:**
  - `example/README.md` — Setup guide, project structure, common patterns
  - Shows how to configure paths, create data files with LLM.entry headers
  - Explains three-layer validation pipeline and exit codes

#### `MIGRATION.md` (this file)
- **Purpose:** Documents why changes were made, clarifies framework vs. project roles

---

## Architectural Clarity

### SyxCode-LLM-Framework (this repo)
**What it is:** Reusable validation & governance framework
- Validator pipeline (preflight → SOT cross-audit → tamper protection)
- LLM.entry header enforcement
- Zero-Trust Governance architecture
- Generic configuration system

**What it's NOT:** A mod project or Songs of Syx specific tool
- No game-specific data (V70 removed)
- No Java/Maven toolchain (pom.xml removed)
- No hardcoded game paths

### SyxCraft (separate repo)
**What it is:** Mod project using SyxCode framework
- Contains `pom.xml` for Java compilation
- Contains V70/ with actual Songs of Syx mod data
- Depends on `syxcode-llm-framework` as validation layer
- Project-specific `syxcode.config.json` with SyxCraft paths

---

## For Framework Users

1. Clone or install `syxcode-llm-framework`
2. Create your project with your own `syxcode.config.json`
3. Override paths for your domain (see `example/README.md`)
4. Use the validator for data integrity & LLM safety
5. Framework handles the rest

## For SyxCraft Continuation

SyxCraft will live in a separate repository and:
- Depend on `syxcode-llm-framework` (github.com/vannon091118/SyxCode-LLM-Framework)
- Maintain its own `pom.xml`, V70/, and mod data
- Use its own `syxcode.config.json` with SyxCraft-specific paths
- Continue advancing mod systems independently

---

## Version Notes

- **SyxCode Framework Version:** 0.0.35 (from HISTORY.md Entry 2)
- **_Info.txt Version:** Now matches framework (0.0.35)
- **Consistency Rule:** Validator auto-syncs all versions on first run — this is intentional
