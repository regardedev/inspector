# Inspector Linking Implementation Plan

## Table of Contents

- [Goal](#goal)
- [Verified Upstream Behavior](#verified-upstream-behavior)
- [Local Decision](#local-decision)
- [Package Strategy](#package-strategy)
- [Implementation Steps](#implementation-steps)
- [Open Questions](#open-questions)

## Goal

Add local inspector-link emission for Jazz apps running in this repo so `pnpm dev` can print a local inspector URL that opens `web-inspector` at `/conn/new` with strict upstream parity fragment params.

## Verified Upstream Behavior

- `packages/jazz-tools/src/dev/managed-runtime.ts` emits:
  - `[jazz] using server from env: ...`
  - `[jazz] app id: ...`
  - `[jazz] schema published`
- `packages/jazz-tools/src/dev/vite.ts` emits:
  - `[jazz] Open the inspector: ${buildInspectorLink(...)}`
- `packages/jazz-tools/src/dev/inspector-link.ts` builds a URL with:
  - base `https://jazz2-inspector.vercel.app/`
  - hash params `serverUrl`, `appId`, `adminSecret`
  - `encodeURIComponent` for each fragment value

## Local Decision

- Match strict upstream emitted param parity first
- Use local inspector base URL:
  - `http://regarde.inspector.localhost:1355/conn/new`
- Emit only:
  - `serverUrl`
  - `appId`
  - `adminSecret`
- Do not emit `env` or `branch` in the terminal URL for the first version

## Package Strategy

This repo already depends on the external package name `jazz-tools`.

Do not create a local workspace package also named `jazz-tools` because that would create resolution ambiguity.

Preferred local package shape:

- `packages/jazz-dev-tools`

Suggested files:

- `packages/jazz-dev-tools/package.json`
- `packages/jazz-dev-tools/src/dev/jazzInspectorLink.ts`
- `packages/jazz-dev-tools/src/dev/jazzInspectorPlugin.ts`
- `packages/jazz-dev-tools/src/index.ts`

The local package should import the upstream Jazz dev API from the official package where possible.

## Implementation Steps

### 1. Create a local dev-tools wrapper package

Create a new workspace package for local Jazz dev helpers.

Reason:

- avoid modifying `apps/my-jazz-app` with large inline plugin code
- keep the wrapper reusable for other Jazz apps in this repo
- avoid naming collision with the upstream `jazz-tools` package

### 2. Add a local inspector link builder

Implement a helper based on upstream `inspector-link.ts` behavior.

Requirements:

- use `encodeURIComponent`
- emit only `serverUrl`, `appId`, `adminSecret`
- base URL must be `http://regarde.inspector.localhost:1355/conn/new`

### 3. Add a local Jazz Vite wrapper plugin

Implement a wrapper plugin that preserves upstream Jazz Vite behavior while changing the emitted inspector URL.

Requirements:

- base it on verified upstream `packages/jazz-tools/src/dev/vite.ts`
- preserve `ManagedDevRuntime` initialization behavior
- preserve upstream dev logs from managed runtime
- replace only the final inspector link emission

### 4. Update `apps/my-jazz-app/vite.config.ts`

Replace direct usage of `jazzPlugin()` with the local wrapper plugin.

Target behavior:

- `pnpm dev` still runs Jazz managed runtime through Vite
- terminal prints the local inspector URL

### 5. Keep `web-inspector` prefill handling aligned

`web-inspector` should continue to parse the emitted strict parity params:

- `serverUrl`
- `appId`
- `adminSecret`

It may also support manual form fields for:

- `name`
- `env`
- `branch`

### 6. Verify end-to-end with `apps/my-jazz-app`

Success criteria:

- run `pnpm dev` in `apps/my-jazz-app`
- see the Jazz runtime logs
- see `Open the inspector: http://regarde.inspector.localhost:1355/conn/new#...`
- open the URL
- `/conn/new` shows the connection form with strict parity prefill values populated

## Open Questions

- How thin can the wrapper be while still accessing `managed.adminSecret` cleanly?
- Do we fork the upstream Vite plugin logic directly, or factor a smaller local wrapper once we inspect the import surface from the published package?
