---
name: implement-feature
description: Implement one scoped, verifiable increment of the resume website, following the repository workflow. Use when asked to implement a feature, increment, or phase.
---

# Implement Feature

Follow the workflow in `AGENTS.md`. This skill adds the concrete steps.

## 1. Confirm scope

Restate the increment in one or two sentences, including what is explicitly out of scope. If the request is ambiguous in a way that affects files, content, or design, ask before proceeding.

## 2. Plan

Before editing, list:

- commands to run
- files to create or modify
- dependencies to add, each with a justification (prefer none)
- personal content required that has not been supplied (use placeholders, never invent)

## 3. Implement

Make only the changes in the plan. If the plan needs to change, say so and why.

## 4. Verify

- Run focused checks for the changed area.
- Run `./scripts/verify.sh`.
- Review the full diff (`git diff` and `git status --short`), including untracked files.

## 5. Report

- changed files
- verification commands and results
- warnings or known issues
- remaining work and suggested next increment

Do not commit. The owner commits after reviewing.
