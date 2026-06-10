# LLM.entry Definition

The `LLM.entry` is a mandatory metadata block required for every script or configuration file in the Syxcraft Overhaul. It serves as the structural bridge between the LLM and the Songs of Syx engine logic.

## Purpose
- **Structural Mapping**: Explains how the specific file fits into the Songs of Syx data hierarchy.
- **Validation Basis**: Provides the "Source of Truth" for automated validation tools.
- **Context Preservation**: Ensures that the LLM understands the game's internal logic for every modified value.

## Format (XML)
```xml
<!--
LLM.entry
STRUCTURE_EXPLANATION: [Detailed explanation of the game logic for this file]
FILE_CONTEXT: [Relative path to the file]
VERSION: [Mod version]
-->
```

## Mandatory Content
1. **STRUCTURE_EXPLANATION**: Must explain the role of tags based on official Songs of Syx modding standards.
2. **ENGINE_DEFAULTS**: Must list the engine's fallback values for any omitted attributes in this file.
3. **FILE_CONTEXT**: Must match the actual path in the workspace.
4. **VERSION**: Current mod version.
