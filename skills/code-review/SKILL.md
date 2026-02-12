---
name: code-review
description: Code Review - comprehensive security and quality review of uncommitted changes. Invokes code-reviewer agent.
disable-model-invocation: true
---

# Code Review Command

This command invokes the **code-reviewer** agent to perform comprehensive security and quality review of uncommitted changes.

## What This Command Does

1. **Run git diff** to identify changed files
2. **Security review** - Hardcoded secrets, injection risks, input validation, OWASP Top 10
3. **Code quality** - Function/file size, nesting, error handling, naming
4. **Generate report** - CRITICAL, HIGH, MEDIUM, LOW with locations and suggested fixes
5. **Block commit** if CRITICAL or HIGH issues found

## When to Use

Use `/code-review` when:
- After writing or modifying code (MUST BE USED for all code changes)
- Before committing changes
- When security-sensitive code was added (auth, API, user input)
- When preparing for PR/code review

## How It Works

The code-reviewer agent will run git diff, focus on modified files, and provide feedback organized by priority (Critical → Warnings → Suggestions) with specific fix examples.

## Related

- Agent: `agents/code-reviewer.md`
- Use **security-reviewer** for deeper security audits on auth/API/payment code
