---
title: "Plugins reference"
source: "https://code.claude.com/docs/en/plugins-reference"
author:
  - "[[Claude Code Docs]]"
published:
created: 2026-02-12
description: "Complete technical reference for Claude Code plugin system, including schemas, CLI commands, and component specifications."
tags:
  - "clippings"
---
Looking to install plugins? See [Discover and install plugins](https://code.claude.com/docs/en/discover-plugins). For creating plugins, see [Plugins](https://code.claude.com/docs/en/plugins). For distributing plugins, see [Plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces).

This reference provides complete technical specifications for the Claude Code plugin system, including component schemas, CLI commands, and development tools.

## Plugin components reference

This section documents the types of components that plugins can provide.

### Skills

Plugins add skills to Claude Code, creating `/name` shortcuts that you or Claude can invoke.**Location**: `skills/` or `commands/` directory in plugin root **File format**: Skills are directories with `SKILL.md`; commands are simple markdown files **Skill structure**:**Integration behavior**:
- Skills and commands are automatically discovered when the plugin is installed
- Claude can invoke them automatically based on task context
- Skills can include supporting files alongside SKILL.md
For complete details, see [Skills](https://code.claude.com/docs/en/skills).

### Agents

Plugins can provide specialized subagents for specific tasks that Claude can invoke automatically when appropriate.**Location**: `agents/` directory in plugin root **File format**: Markdown files describing agent capabilities **Agent structure**:**Integration points**:
- Agents appear in the `/agents` interface
- Claude can invoke agents automatically based on task context
- Agents can be invoked manually by users
- Plugin agents work alongside built-in Claude agents
For complete details, see [Subagents](https://code.claude.com/docs/en/sub-agents).

### Agents vs Skills (avoiding duplication)

| | Skills | Agents |
|-|--------|--------|
| **Role** | `/name` shortcuts, context triggers | Specialized subagents, full workflows |
| **Content** | When to use, delegate to agent | Detailed procedures, checklists, tools |

**Recommended patterns:**
- **Skill → Agent delegation**: Skill states "invokes X agent" and when to use; Agent holds full workflow (e.g. `plan` → `planner`, `tdd` → `tdd-guide`, `code-review` → `code-reviewer`).
- **Single source of truth**: Do not duplicate procedures in both skill and agent; keep detailed content in one place (usually Agent).
- **Knowledge-only skills**: Skills can be pure triggers (e.g. "when writing React/Next.js code, apply vercel-react-best-practices") without duplicating the full reference content.

See [agents-vs-skills.md](./agents-vs-skills.md) for the full mapping and patterns used in this repo.

### Hooks

Plugins can provide event handlers that respond to Claude Code events automatically.**Location**: `hooks/hooks.json` in plugin root, or inline in plugin.json **Format**: JSON configuration with event matchers and actions **Hook configuration**:**Available events**:
- `PreToolUse`: Before Claude uses any tool
- `PostToolUse`: After Claude successfully uses any tool
- `PostToolUseFailure`: After Claude tool execution fails
- `PermissionRequest`: When a permission dialog is shown
- `UserPromptSubmit`: When user submits a prompt
- `Notification`: When Claude Code sends notifications
- `Stop`: When Claude attempts to stop
- `SubagentStart`: When a subagent is started
- `SubagentStop`: When a subagent attempts to stop
- `SessionStart`: At the beginning of sessions
- `SessionEnd`: At the end of sessions
- `TeammateIdle`: When an agent team teammate is about to go idle
- `TaskCompleted`: When a task is being marked as completed
- `PreCompact`: Before conversation history is compacted
**Hook types**:
- `command`: Execute shell commands or scripts
- `prompt`: Evaluate a prompt with an LLM (uses `$ARGUMENTS` placeholder for context)
- `agent`: Run an agentic verifier with tools for complex verification tasks

### MCP servers

Plugins can bundle Model Context Protocol (MCP) servers to connect Claude Code with external tools and services.**Location**: `.mcp.json` in plugin root, or inline in plugin.json **Format**: Standard MCP server configuration **MCP server configuration**:**Integration behavior**:
- Plugin MCP servers start automatically when the plugin is enabled
- Servers appear as standard MCP tools in Claude’s toolkit
- Server capabilities integrate seamlessly with Claude’s existing tools
- Plugin servers can be configured independently of user MCP servers

### LSP servers

Looking to use LSP plugins? Install them from the official marketplace: search for “lsp” in the `/plugin` Discover tab. This section documents how to create LSP plugins for languages not covered by the official marketplace.

Plugins can provide [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) (LSP) servers to give Claude real-time code intelligence while working on your codebase.LSP integration provides:
- **Instant diagnostics**: Claude sees errors and warnings immediately after each edit
- **Code navigation**: go to definition, find references, and hover information
- **Language awareness**: type information and documentation for code symbols
**Location**: `.lsp.json` in plugin root, or inline in `plugin.json` **Format**: JSON configuration mapping language server names to their configurations**`.lsp.json` file format**:**Inline in `plugin.json`**:**Required fields:****Optional fields:**

**You must install the language server binary separately.** LSP plugins configure how Claude Code connects to a language server, but they don’t include the server itself. If you see `Executable not found in $PATH` in the `/plugin` Errors tab, install the required binary for your language.

**Available LSP plugins:**Install the language server first, then install the plugin from the marketplace.

---

## Plugin installation scopes

When you install a plugin, you choose a **scope** that determines where the plugin is available and who else can use it:Plugins use the same scope system as other Claude Code configurations. For installation instructions and scope flags, see [Install plugins](https://code.claude.com/docs/en/discover-plugins#install-plugins). For a complete explanation of scopes, see [Configuration scopes](https://code.claude.com/docs/en/settings#configuration-scopes).

---

## Plugin manifest schema

The `.claude-plugin/plugin.json` file defines your plugin’s metadata and configuration. This section documents all supported fields and options.The manifest is optional. If omitted, Claude Code auto-discovers components in [default locations](https://code.claude.com/docs/en/#file-locations-reference) and derives the plugin name from the directory name. Use a manifest when you need to provide metadata or custom component paths.

### Complete schema

### Required fields

If you include a manifest, `name` is the only required field.This name is used for namespacing components. For example, in the UI, the agent `agent-creator` for the plugin with name `plugin-dev` will appear as `plugin-dev:agent-creator`.

### Component path fields

### Path behavior rules

**Important**: Custom paths supplement default directories - they don’t replace them.
- If `commands/` exists, it’s loaded in addition to custom command paths
- All paths must be relative to plugin root and start with `./`
- Commands from custom paths use the same naming and namespacing rules
- Multiple paths can be specified as arrays for flexibility
**Path examples**:

### Environment variables

**`${CLAUDE_PLUGIN_ROOT}`**: Contains the absolute path to your plugin directory. Use this in hooks, MCP servers, and scripts to ensure correct paths regardless of installation location.

---

## Plugin caching and file resolution

For security and verification purposes, Claude Code copies plugins to a cache directory rather than using them in-place. Understanding this behavior is important when developing plugins that reference external files.

### How plugin caching works

Plugins are specified in one of two ways:
- Through `claude --plugin-dir`, for the duration of a session.
- Through a marketplace, installed to the local plugin cache.
When you install a plugin, Claude Code locates its marketplace and the plugin’s `source` field within that marketplace.The source can be one of five types:
- Relative path: copied recursively to the plugin cache. For example, if your marketplace entry specifies `"source": "./plugins/my-plugin"`, the entire `./plugins/my-plugin` directory is copied.
- npm - copied to the plugin cache from npm
- pip - copied to the plugin cache from pip
- url - any https:// URL ending in.git
- github - any owner/repo shorthand

### Path traversal limitations

Plugins cannot reference files outside their copied directory structure. Paths that traverse outside the plugin root (such as `../shared-utils`) will not work after installation because those external files are not copied to the cache.

### Working with external dependencies

If your plugin needs to access files outside its directory, you have two options:**Option 1: Use symlinks** Create symbolic links to external files within your plugin directory. Symlinks are honored during the copy process:The symlinked content will be copied into the plugin cache.**Option 2: Restructure your marketplace** Set the plugin path to a parent directory that contains all required files, then provide the rest of the plugin manifest directly in the marketplace entry:This approach copies the entire marketplace root, giving your plugin access to sibling directories.

Symlinks that point to locations outside the plugin’s logical root are followed during copying. This provides flexibility while maintaining the security benefits of the caching system.

---

## Plugin directory structure

### Standard plugin layout

A complete plugin follows this structure:

```
enterprise-plugin/

├── .claude-plugin/           # Metadata directory (optional)

│   └── plugin.json             # plugin manifest

├── commands/                 # Default command location

│   ├── status.md

│   └── logs.md

├── agents/                   # Default agent location

│   ├── security-reviewer.md

│   ├── performance-tester.md

│   └── compliance-checker.md

├── skills/                   # Agent Skills

│   ├── code-reviewer/

│   │   └── SKILL.md

│   └── pdf-processor/

│       ├── SKILL.md

│       └── scripts/

├── hooks/                    # Hook configurations

│   ├── hooks.json           # Main hook config

│   └── security-hooks.json  # Additional hooks

├── .mcp.json                # MCP server definitions

├── .lsp.json                # LSP server configurations

├── scripts/                 # Hook and utility scripts

│   ├── security-scan.sh

│   ├── format-code.py

│   └── deploy.js

├── LICENSE                  # License file

└── CHANGELOG.md             # Version history
```

The `.claude-plugin/` directory contains the `plugin.json` file. All other directories (commands/, agents/, skills/, hooks/) must be at the plugin root, not inside `.claude-plugin/`.

### File locations reference

---

## CLI commands reference

Claude Code provides CLI commands for non-interactive plugin management, useful for scripting and automation.

### plugin install

Install a plugin from available marketplaces.**Arguments:**
- `<plugin>`: Plugin name or `plugin-name@marketplace-name` for a specific marketplace
**Options:**Scope determines which settings file the installed plugin is added to. For example, —scope project writes to `enabledPlugins` in.claude/settings.json, making the plugin available to everyone who clones the project repository.**Examples:**

### plugin uninstall

Remove an installed plugin.**Arguments:**
- `<plugin>`: Plugin name or `plugin-name@marketplace-name`
**Options:****Aliases:**`remove`, `rm`

### plugin enable

Enable a disabled plugin.**Arguments:**
- `<plugin>`: Plugin name or `plugin-name@marketplace-name`
**Options:**

### plugin disable

Disable a plugin without uninstalling it.**Arguments:**
- `<plugin>`: Plugin name or `plugin-name@marketplace-name`
**Options:**

### plugin update

Update a plugin to the latest version.**Arguments:**
- `<plugin>`: Plugin name or `plugin-name@marketplace-name`
**Options:**

---

## Debugging and development tools

### Debugging commands

Use `claude --debug` (or `/debug` within the TUI) to see plugin loading details:This shows:
- Which plugins are being loaded
- Any errors in plugin manifests
- Command, agent, and hook registration
- MCP server initialization

### Common issues

**Manifest validation errors**:
- `Invalid JSON syntax: Unexpected token } in JSON at position 142`: check for missing commas, extra commas, or unquoted strings
- `Plugin has an invalid manifest file at .claude-plugin/plugin.json. Validation errors: name: Required`: a required field is missing
- `Plugin has a corrupt manifest file at .claude-plugin/plugin.json. JSON parse error: ...`: JSON syntax error
**Plugin loading errors**:
- `Warning: No commands found in plugin my-plugin custom directory: ./cmds. Expected .md files or SKILL.md in subdirectories.`: command path exists but contains no valid command files
- `Plugin directory not found at path: ./plugins/my-plugin. Check that the marketplace entry has the correct path.`: the `source` path in marketplace.json points to a non-existent directory
- `Plugin my-plugin has conflicting manifests: both plugin.json and marketplace entry specify components.`: remove duplicate component definitions or remove `strict: false` in marketplace entry

### Hook troubleshooting

**Hook script not executing**:
1. Check the script is executable: `chmod +x ./scripts/your-script.sh`
2. Verify the shebang line: First line should be `#!/bin/bash` or `#!/usr/bin/env bash`
3. Check the path uses `${CLAUDE_PLUGIN_ROOT}`: `"command": "${CLAUDE_PLUGIN_ROOT}/scripts/your-script.sh"`
4. Test the script manually: `./scripts/your-script.sh`
**Hook not triggering on expected events**:
1. Verify the event name is correct (case-sensitive): `PostToolUse`, not `postToolUse`
2. Check the matcher pattern matches your tools: `"matcher": "Write|Edit"` for file operations
3. Confirm the hook type is valid: `command`, `prompt`, or `agent`

### MCP server troubleshooting

**Server not starting**:
1. Check the command exists and is executable
2. Verify all paths use `${CLAUDE_PLUGIN_ROOT}` variable
3. Check the MCP server logs: `claude --debug` shows initialization errors
4. Test the server manually outside of Claude Code
**Server tools not appearing**:
1. Ensure the server is properly configured in `.mcp.json` or `plugin.json`
2. Verify the server implements the MCP protocol correctly
3. Check for connection timeouts in debug output

### Directory structure mistakes

**Symptoms**: Plugin loads but components (commands, agents, hooks) are missing.**Correct structure**: Components must be at the plugin root, not inside `.claude-plugin/`. Only `plugin.json` belongs in `.claude-plugin/`.If your components are inside `.claude-plugin/`, move them to the plugin root.**Debug checklist**:
1. Run `claude --debug` and look for “loading plugin” messages
2. Check that each component directory is listed in the debug output
3. Verify file permissions allow reading the plugin files

---

## Distribution and versioning reference

### Version management

Follow semantic versioning for plugin releases:**Version format**: `MAJOR.MINOR.PATCH`
- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backward-compatible additions)
- **PATCH**: Bug fixes (backward-compatible fixes)
**Best practices**:
- Start at `1.0.0` for your first stable release
- Update the version in `plugin.json` before distributing changes
- Document changes in a `CHANGELOG.md` file
- Use pre-release versions like `2.0.0-beta.1` for testing

---

## See also

- [Plugins](https://code.claude.com/docs/en/plugins) - Tutorials and practical usage
- [Plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) - Creating and managing marketplaces
- [Skills](https://code.claude.com/docs/en/skills) - Skill development details
- [Subagents](https://code.claude.com/docs/en/sub-agents) - Agent configuration and capabilities
- [agents-vs-skills.md](./agents-vs-skills.md) - This repo's agents/skills relationship and mapping
- [Hooks](https://code.claude.com/docs/en/hooks) - Event handling and automation
- [MCP](https://code.claude.com/docs/en/mcp) - External tool integration
- [Settings](https://code.claude.com/docs/en/settings) - Configuration options for plugins

[Hooks reference](https://code.claude.com/docs/en/hooks)