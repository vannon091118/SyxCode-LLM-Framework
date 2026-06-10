# LLM Safe SyxCode Framework

A robust, LLM-optimized modding framework for **Songs of Syx**. This project is designed to be fully manageable by Large Language Models while maintaining 100% structural integrity and compatibility with the Steam Workshop.

## Core Mandates: "Source of Truth" (SOT)
This framework operates on a multi-layer validation system that prevents "hallucinations" and silent logical failures.

### 1. The LLM.entry Protocol
Every file contains a mandatory `LLM.entry` header explaining:
- **Structural Logic**: How the engine interprets the file.
- **Engine Defaults**: Fallback values for omitted XML attributes.
- **Side Effects**: How Java scripts interact with these data points.

### 2. Validation Suite (`npm test`)
An automated validator ensures that:
- Every resource/race/tech is tracked in `inventory_map.json`.
- Every localization string is mapped in `string_matrix.json`.
- Every asset offset is recorded in `asset_map.json`.
- Integrity hashes (`integrity_hashes.json`) detect unauthorized or inconsistent changes.

### 3. Dependency Graph
A non-intrusive `dependency_graph.json` tracks logical chains (e.g., Tech -> Requires -> Resource) and detects cross-system conflicts before they break the game.

## Project Structure
- `V70/data/init/`: Original-compliant XML structures.
- `src/main/java/`: Java-based mod logic (Maven framework).
- `doku/`: Continuous documentation (`HISTORY.md`) with a mandatory "No Removal" policy.
- `tools/`: The integrity and validation engine.

## Development Workflow
1. **Research**: LLM analyzes SOT files.
2. **Strategy**: Implementation plan update in `doku/`.
3. **Execution**: Atomic changes to XML/Java + sync of Maps/Graph.
4. **Validation**: `npm test` must be green.
5. **Documentation**: `HISTORY.md` update with diffs.

---
*Created by Gemini CLI & Vannon | Powered by LLM Safe SyxCode Technology*
