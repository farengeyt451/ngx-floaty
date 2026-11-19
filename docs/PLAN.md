# ngx-floaty — implementation plan

Derived from [HANDOFF.md](./HANDOFF.md). Each phase is one PR or a small set of PRs and ends with CI green.

## Phase 0 — finish scaffold, reserve name

- [x] Node 26 via nvm, `.nvmrc` = `26`, `engines` in root `package.json`.
- [x] Library peer range `"@angular/core": ">=21.0.0"`, `"@angular/common": ">=21.0.0"`; add `@floating-ui/dom` dependency (regular dependency, allowlisted in `ng-package.json`).
- [x] Component/directive prefix `lib` → `floaty`.
- [x] `tsconfig.json` paths: map `ngx-floaty` and `ngx-floaty/*` to library sources for development; `dist` only for e2e/consumer tests.
- [x] Entry points (ng-packagr allows primary → secondary imports only):
  - `ngx-floaty/core` — engine, `provideFloaty`, `FloatyService`, registry, types.
  - `ngx-floaty/tooltip`, `ngx-floaty/popover` — depend on `core`.
  - `ngx-floaty` — re-exports core, tooltip, popover.
  - `ngx-floaty/testing` — later (Phase 5).
- [ ] Vitest: unit-test builder with jsdom; browser-mode config via `@vitest/browser-playwright` (Chromium) for layout tests.
- [ ] Playwright e2e on demo (Chromium/Firefox/WebKit) + `@axe-core/playwright`.
- [ ] angular-eslint, Prettier, husky + lint-staged.
- [ ] GitHub Actions: lint, unit, browser unit, e2e, consumer matrix (Angular 21/22/next × Node 24/26), size budget, release with npm provenance.
- [ ] Publish `0.0.1` placeholder README with `--registry=https://registry.npmjs.org/`; create npm org `@ngx-floaty`.

## Phase 1 — feature spec + scenarios

- [ ] `docs/features.md`: each Tippy prop/behavior → keep / rename / drop, floaty name, tooltip default, popover default, acceptance criterion.
- [x] Tooltip vs popover split follows Radix UI (HANDOFF decision 8): fixed triggers per directive, no `trigger` prop, HoverCard deferred to v2.
- [ ] Resolve: named registry (global with dev-mode errors vs scoped); tooltip rendering (top layer vs `body`); touch behavior for tooltips; Popover API fallback.
- [ ] Map Tippy `trigger` / `interactive` / `hideOnClick` combinations to floaty equivalents (or "not supported") for the migration guide.
- [ ] Playwright scenario list per feature, including RTL, scroll containers, transformed ancestors, shadow DOM, iframes.

## Phase 2 — core engine (`ngx-floaty/core`)

1. [ ] Positioning adapter (`computePosition` + `autoUpdate`, `strategy: 'fixed'`, offset/flip/shift/arrow/size/hide/inline, virtual elements) behind an interface.
2. [ ] Pure open/close state machine (closed → opening → open → closing) with delays/durations; fake-timer tests.
3. [ ] Triggers (hover, focus, click, manual) + hover safe area.
4. [ ] Content rendering: string, `ng-template` + context, component + inputs. Per-instance injector/VCR, no mutation of user context, idempotent destroy.
5. [ ] Popover API integration + light dismiss.
6. [ ] Animation lifecycle: `data-state` + Web Animations API hook.
7. [ ] SSR (`afterNextRender`), zoneless (`markForCheck` after user hooks).
8. [ ] Registry, `FloatyService` (instances signal + observable, `hideAll({ exclude })`), `provideFloaty`.

Layout-dependent behavior is tested in Vitest browser mode.

## Phase 3 — tooltip

- [ ] Directive: hover + focus with delay, closes on trigger activation / Esc, `role="tooltip"`, `aria-describedby`, WCAG 1.4.13.
- [ ] Global `delayDuration` / `skipDelayDuration` via `provideFloaty` (Radix `Tooltip.Provider` semantics).
- [ ] Dev-mode warning when content contains focusable elements.
- [ ] Singleton, group (`contentChildren()`), `followCursor`.

## Phase 4 — popover

- [ ] Directive: opens on trigger activation or programmatically, `[(floatyOpen)]` via `model()`, `aria-expanded`/`aria-controls`/`aria-haspopup`, optional `role="dialog"`.
- [ ] Focus in on open, Esc closes and returns focus to trigger; `close` in template context.
- [ ] Optional anchor element separate from the trigger (Radix `Popover.Anchor`).
- [ ] Nested popovers (`popover="auto"` stacking).

## Phase 5 — themes, animations, DX

- [ ] Themes: light, dark, material-like. Presets: fade, scale, shift-away, perspective.
- [ ] `ng add` schematic (CSS + provider).
- [ ] `ngx-floaty/testing` harnesses.

## Phase 6 — demo, docs, release

- [ ] Demo pages as e2e fixtures; screenshot tests (themes, placements); SSR + hydration smoke.
- [ ] Migration guide from ngx-tippy-wrapper.
- [ ] `0.x` / `1.0.0-next` prereleases → `1.0.0`.

## Phase 7 — retire ngx-tippy-wrapper

- [ ] `6.3.1` README-only, `npm deprecate`, banner + pinned issue, answer #72.
