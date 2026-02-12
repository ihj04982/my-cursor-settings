---
name: git-workflow
description: Git Workflow
---

Git Workflow

Commit Message Format

<type>: <description>

<optional body>

Types: feat, fix, refactor, docs, test, chore, perf, ci

Note: Attribution disabled globally via ~/.claude/settings.json.

Pull Request Workflow

When creating PRs:

Analyze full commit history (not just latest commit)

Use git diff [base-branch]...HEAD to see all changes

Draft comprehensive PR summary

Include test plan with TODOs

Push with -u flag if new branch

Feature Implementation Workflow

Plan First

Use planner agent to create implementation plan

Identify dependencies and risks

Break down into phases

TDD Approach

Use tdd-guide agent

Write tests first (RED)

Implement to pass tests (GREEN)

Refactor (IMPROVE)

Verify 80%+ coverage

Code Review

Use code-reviewer agent immediately after writing code

Address CRITICAL and HIGH issues

Fix MEDIUM issues when possible

Commit & Push

Detailed commit messages

Follow conventional commits format
