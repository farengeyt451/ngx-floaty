# ngx-floaty — handoff

Context for continuing work on a new machine/chat. Decisions made on 2026-11-18/19.

## Background

- Current library: [ngx-tippy-wrapper](https://github.com/farengeyt451/ngx-tippy-wrapper) 6.3.0 — Angular wrapper for Tippy.js (Popper v2 under the hood).
- Tippy.js (6.3.7) and Popper (2.11.8) are unmaintained. Popper's successor is Floating UI (`@floating-ui/dom` 1.8.0, actively maintained).
- Spike result: published 6.3.0 builds and works in a fresh Angular 21 app (zoneless, standalone, esbuild, Vitest). It has no Angular `peerDependencies`, so it installs on 14–22 without blocking. The "Angular 17–20 gap" is a declaration/testing gap, not a code gap.
- Angular support status (Nov 2026): v22 active, v21 LTS until 2027-06, v20 LTS ends 2026-11-28, v17–19 EOL. Majors are now yearly (v23 ~June 2027).

## Decisions

1. **ngx-tippy-wrapper stays at 6.3.x**, frozen, maintenance only.
   - Final `6.3.1`: README-only — "works on Angular 14–22, maintenance mode, successor: ngx-floaty".
   - `npm deprecate ngx-tippy-wrapper "Moved to ngx-floaty (Floating UI based, Angular 21+)"`.
   - Banner + pinned issue in old repo; answer issue #72 with the link.
2. **New package: `ngx-floaty`** — new repo, clean history; README says "Successor of ngx-tippy-wrapper".
   - Name verified free on public npm (`ngx-floaty`, lookalikes, `@ngx-floaty/core`) and on GitHub (repo + org) as of 2026-11-19.
   - Reserve: create GitHub repo/org and npm org `@ngx-floaty`; publish `0.0.1` with a real README.
   - Work machine's npm points to a corporate Azure feed — always publish with `--registry=https://registry.npmjs.org/`.
3. **Angular 21 is the floor.** Peer range `"@angular/core": ">=21.0.0"` (open-ended), enforced by a CI matrix: 21, 22, `next`.
   - Build the library with the Angular 21 toolchain (partial compilation is forward compatible).
   - Node: 26 LTS "Lithium" (26.13.1, LTS since 2026-10) for development; `.nvmrc` = 26. Angular 21 allows `^20.19 || ^22.12 || >=24`, Angular 22 lists 26 explicitly. Angular 21 predates Node 26, so CI runs on Node 24 and 26.
4. **Engine:** `@floating-ui/dom` for positioning + native **Popover API** for top-layer rendering and light dismiss. Tippy.js is used only as a feature/API reference — no code dependency.
5. **Animations:** no animation library. CSS presets driven by `data-state` attributes (fade, scale, shift-away, perspective) + optional Web Animations API hook (`animation: (el, phase) => Animation`). Angular `animate.enter/leave` does not apply (floating element is created imperatively and appended outside templates).
6. **Testing:**
   - Unit: Vitest 4 via `@angular/build:unit-test` (stable/default in Angular 21; the builder compiles with esbuild and runs the `vitest` package, peer `vitest ^4.0.8`). Plain Vitest API (`describe/it/vi`) + `TestBed`. happy-dom/jsdom for logic; Vitest browser mode (Playwright Chromium) for anything needing layout (positioning, flip/shift, arrow, animation events).
   - E2E: Playwright against the demo app (demo doubles as e2e target), Chromium/Firefox/WebKit, axe a11y checks, screenshot tests for themes/placements, SSR + hydration smoke.
   - CI consumer matrix: scaffold app per Angular major (21, 22, next) → install packed tgz → build → Playwright smoke.
7. **Demo:** plain Angular app with own small CSS. No Taiga UI / DOMPurify.
8. **Component split follows Radix UI** (decided 2026-11-19). The choice is made by content, not by trigger, and triggers are fixed per directive — no `trigger` prop:
   - Tooltip: opens on hover + focus only; closes on trigger activation (click/Enter/Space), pointer leave, blur, Esc. Non-interactive content only; never receives focus. Global delays like Radix `Tooltip.Provider` (`delayDuration` 700, `skipDelayDuration` 300). No click "toggletip" mode.
   - Popover: opens on trigger activation (click/Enter/Space) or programmatically (`[(floatyOpen)]`, `FloatyService`). Esc closes and returns focus to the trigger. Optional anchor element separate from the trigger.
   - Hover-triggered interactive content = Radix `HoverCard` (sighted users only) — not in v1, candidate for v2 together with `floatyMenu`.
   - One `FloatyService` controls instances of both kinds by name.
   - Dev-mode warning when tooltip content contains focusable elements, pointing to `floatyPopover`.

## Scope v1: tooltip + popover

Shared internal core, two directives with different defaults and a11y semantics.

**Core:** Floating UI positioning (`computePosition`, `autoUpdate`, `offset/flip/shift/arrow/size/hide/inline`, virtual elements) · open/close state machine with delays/durations · triggers (hover, focus, click, manual) with hover safe-area for interactive content · animations · content rendering (string, `ng-template` + context, component + inputs) · named-instance registry.

| | Tooltip | Popover |
|---|---|---|
| Opens on | hover + focus, delayed (fixed, see decision 8) | click / programmatic (fixed, see decision 8) |
| Content | short, non-interactive | interactive |
| A11y | `role="tooltip"`, `aria-describedby`; hoverable, persistent, Esc-dismissible (WCAG 1.4.13) | `aria-expanded`, `aria-controls`, `aria-haspopup`, optional `role="dialog"`; focus in on open, return on close |
| Dismiss | pointer leave, blur, Esc | Esc, outside click, `close()` |
| Rendering | top layer or `body` | top layer (`popover="auto"`) |
| Extras | singleton, group, followCursor | `[(floatyOpen)]`, nested popovers, `close` in template context |

**API sketch:**

```html
<button floatyTooltip="Save changes">Save</button>
<button [floatyTooltip]="tipTpl" [floatyProps]="{ placement: 'right' }">Info</button>

<button [floatyPopover]="menuTpl" floatyName="userMenu" [(floatyOpen)]="isOpen">Account</button>
<ng-template #menuTpl let-close="close">
  <a routerLink="/profile">Profile</a>
  <button (click)="close()">Sign out</button>
</ng-template>
```

```ts
bootstrapApplication(App, { providers: [provideFloaty({ placement: 'top', animation: 'fade' })] });
inject(FloatyService).show('userMenu');
```

Also in v1: `FloatyService` (show/hide/setContent by name, hideAll with exclude, instances signal + observable), `provideFloaty`, themes (light, dark, material-like), CSS animation presets, SSR-safe (`afterNextRender`), zoneless-friendly (markForCheck after user hooks), `ng add` schematic (CSS + provider), secondary entry points `ngx-floaty/tooltip`, `ngx-floaty/popover`, optional `ngx-floaty/testing` harnesses.

**Out of scope v1:** dropdown menus with keyboard nav, combobox/select, context menu, modal dialog, toasts (candidate v2 `floatyMenu`).

## Lessons from ngx-tippy-wrapper 6.x (do not repeat)

- Root-singleton `NgxViewService` with a mutable `viewContainerRef` — components were created in the last-initialized directive's container. Create views per instance with the directive's own injector/VCR.
- `hideAll({ duration, ...exclude })` spread the instance instead of `{ exclude }` — `excludeName` never worked; the spec only spied on itself. Test behavior, not calls.
- Stored instance was a spread copy of the tippy instance → stale `props` after `setProps`.
- `TplRef.destroy` compared `rootNodes[0] !== 1` (always true); `setContent` threw literal `'message'`; user `tippyContext` was mutated (`$implicit`); double destroy after `service.destroy()`; group component never destroyed its instances.
- Group/singleton found children via DOM query in `ngAfterViewInit` — use `contentChildren()` so `@for`-added items work.
- Default import of a CJS-main package broke Jest and module federation (#33, #41) — ship ESM only with named exports.
- Global name registry caused "already exists" / "does not exist" errors (#26, #46) — consider scoped registry, clear dev-mode messages.

## Risks to watch

- Behavior edge cases: touch "hold", focus+click trigger combos, first-show animation, `hideOnClick: 'toggle'`, iframes, shadow DOM, RTL, scroll containers, virtual-scroll recycling.
- Floating UI is positioning only — triggers/dismiss/focus/aria are our code. Fix the feature list before building.
- Top layer + positioning: use `strategy: 'fixed'`; test transformed ancestors and scroll containers.
- `popover="hint"` / `interestfor` would suit tooltips but are not cross-browser yet — keep the engine swappable.
- Popover API `auto` does not trap focus (correct for non-modal) — focus in/out handling is ours.

## Next steps

See [PLAN.md](./PLAN.md) for the phased plan derived from these steps.

1. Create GitHub repo `ngx-floaty` (+ npm org `@ngx-floaty`), reserve npm name with `0.0.1` + README.
2. Scaffold on Node 26 LTS:
   ```bash
   npx @angular/cli@21 new ngx-floaty --create-application=false
   cd ngx-floaty
   npx ng g library ngx-floaty
   npx ng g application demo --style=css --ssr
   ```
   Then: secondary entry points (`tooltip`, `popover`, internal `core`), Vitest (unit-test builder, browser mode via `@vitest/browser-playwright`), Playwright e2e on demo, angular-eslint, Prettier, husky + lint-staged, GitHub Actions (lint, unit, e2e, consumer matrix on Node 24 + 26, size budget, release with npm provenance).
3. Write feature list + Playwright scenarios (Tippy docs as reference).
4. Build core → tooltip → popover → themes/animations → demo/docs.
5. `0.x` / `1.0.0-next` prereleases, migration guide from ngx-tippy-wrapper, then 1.0.0.
6. Publish `ngx-tippy-wrapper@6.3.1` README + `npm deprecate` pointing to ngx-floaty.
