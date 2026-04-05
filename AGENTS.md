# AGENTS.md

## Cursor Cloud specific instructions

This is a fresh/empty repository (`WIZARD_FRESH`). There is currently no application code, no build system, and no services to run.

### Available system tools
- **Git**: 2.43
- **Node.js**: v22 (managed via nvm)
- **npm**: 10.x, **pnpm**: 10.x, **yarn**: 1.x
- **Python**: 3.12

### Notes
- When application code is added, update this file with build/run/test/lint instructions.
- The update script (`SetupVmEnvironment`) is currently a no-op (`echo 'No dependencies to install'`). Update it when a dependency manifest (e.g. `package.json`, `requirements.txt`) is added.
