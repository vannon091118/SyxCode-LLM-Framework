# SyxCode LLM Framework - Usage Example

This directory demonstrates how to use SyxCode as a standalone validation framework in your project.

## Quick Start

### 1. Install SyxCode

```bash
npm install github:vannon091118/SyxCode-LLM-Framework
```

Or add to `package.json`:
```json
{
  "dependencies": {
    "syxcode-llm-framework": "github:vannon091118/SyxCode-LLM-Framework"
  }
}
```

### 2. Configure for Your Project

Create `syxcode.config.json` in your project root:

```json
{
  "framework_name": "My Project",
  "version": "1.0.0",
  "paths": {
    "init_root": "src/data/init",
    "data_root": "src/data",
    "doku": "documentation",
    "scripts": "src/scripts",
    "extension": ".json"
  },
  "validation": {
    "require_llm_entry": true,
    "check_integrity": true,
    "check_graph": true,
    "check_governance": true,
    "require_state_hash": true
  },
  "governance": {
    "enable_tamper_protection": true,
    "enable_interlock_audit": true,
    "enable_preflight_security": true
  }
}
```

### 3. Set Up Your Data Structure

```
your-project/
├── src/
│   ├── data/
│   │   ├── init/
│   │   │   ├── inventory_map.json
│   │   │   ├── dependency_graph.json
│   │   │   └── string_matrix.json
│   │   └── entities/
│   │       └── example.json
│   └── scripts/
├── documentation/
│   ├── HISTORY.md
│   └── GOVERNANCE_PLAN.md
├── package.json
└── syxcode.config.json
```

### 4. Create Data Files with LLM.entry Headers

Every data file must include LLM.entry metadata:

```json
{
  "_llm_entry": {
    "STRUCTURE_EXPLANATION": "What this entity represents",
    "ENGINE_DEFAULTS": "Default behavior when values omitted",
    "VERSION": "0.0.35",
    "STATE_HASH": "auto-generated",
    "LAST_ENTRY": "Entry N from HISTORY.md",
    "FILE_CONTEXT": "path/to/this/file.json"
  },
  "name": "Example Entity",
  "description": "Localized with ¤¤prefix"
}
```

### 5. Run Validation

```bash
npm test
```

This runs the complete three-layer validation pipeline:
- **Layer 1:** Preflight Security (Git audit, SOT presence)
- **Layer 2:** SOT Cross-Audit (Recursive interlock verification)
- **Layer 3:** Tamper Protection (SHA-256 governance hashes)

### 6. Update Governance (after framework changes)

```bash
npm run governance:update
```

## Project Structure

Your project should contain:

### Core Files
- `syxcode.config.json` — Your project's configuration
- `src/data/init/` — Root SOT maps (inventory_map.json, dependency_graph.json, string_matrix.json)
- `src/data/entities/` — Your domain-specific data files
- `documentation/HISTORY.md` — Structural changelog

### What SyxCode Provides
- Validation pipeline (preflight → SOT → tamper detection)
- Automatic version syncing from HISTORY.md
- SHA-256 integrity verification
- LLM.entry enforcement
- Zero-Trust Governance

## Common Patterns

### Adding a New Entity Type

1. Create `src/data/entities/MyEntity.json`
2. Add entry to `src/data/init/inventory_map.json`
3. Add entry to `src/data/init/dependency_graph.json`
4. Add entry to `src/data/init/string_matrix.json`
5. Run `npm test`

### Extending Validation

Modify `syxcode.config.json` validation rules to match your domain requirements.

## Exit Codes

- **0** — Validation passed
- **1** — Validation failed (data/configuration issue)
- **2** — Tamper detected (framework file modified, run governance:update)

## See Also

- [SyxCode-LLM-Framework](https://github.com/vannon091118/SyxCode-LLM-Framework) — Main framework repo
- [GOVERNANCE_PLAN.md](../doku/GOVERNANCE_PLAN.md) — Detailed governance workflow
- [LLM_ENTRY_DEFINITION.md](../doku/LLM_ENTRY_DEFINITION.md) — LLM.entry standards
