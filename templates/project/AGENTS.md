# Project Workflow Contract

This project uses a lightweight four-stage workflow:

1. `plan`
2. `execute`
3. `review`
4. `compound`

The stages stay fixed. Their depth scales with task size and risk.

## 1. Plan

Before implementation, create or update one plan document under `docs/plans/`.

Every plan should state:

- the objective
- the scope
- the non-goals
- the validation approach
- the main risks or open questions

Small tasks may use a short plan. Do not skip the stage; make it brief instead.

## 2. Execute

Implement against the active plan document.

For long-running work, prefer `/goal` so execution continues without stopping at phase boundaries.

Execution should stop only for:

- a missing product or technical decision
- missing credentials, permissions, or external input
- an unsafe or irreversible operation that needs approval
- completed and verified work

## 3. Review

Review the result against the plan.

Minimum review expectations:

- check the scope against the plan
- run focused validation
- check for obvious regressions or drift

Use an independent reviewer or subagent when the task is broad, risky, or user-facing.

## 4. Compound

Capture reusable knowledge under `docs/solutions/` when the task surfaces:

- a non-obvious decision
- a recurring pitfall
- a useful debugging path
- a pattern worth reusing

Small tasks may leave a short note. Larger tasks should write a proper solution artifact.

## Artifact Rules

- Plans live under `docs/plans/`
- Compound notes live under `docs/solutions/`
- Use repository-relative paths in documents
- Keep one active plan file per task

## Working Style

- Prefer small, verifiable changes
- Avoid unrelated refactors during task execution
- If the task is purely informational, answer directly without creating artifacts
- If the task changes code or docs, the four stages still apply; keep them lightweight when appropriate
