# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page static website for "Barber Fratelli" (a Milan barbershop), served directly via GitHub Pages. There is no build system, package manager, bundler, or test suite — it's three hand-written files:

- `index.html` — page markup (content is in Italian)
- `styles.css` — all styling, driven by CSS custom properties on `:root`
- `script.js` — all behavior (no framework, no dependencies except the Google Fonts `<link>` tags in `index.html`)

## Commands

There is no build/lint/test tooling in this repo. To preview changes, serve the directory with any static file server and open it in a browser, e.g.:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. Opening `index.html` directly via `file://` also works for most checks, but prefer a local server since scroll-position math in `script.js` can behave oddly under `file://`.

## Architecture

The page has two interleaved systems that both key off `window.scrollY`, wired up in `script.js`'s single `scroll` listener (which calls `updateJourney`, `updateNavbar`, `updateProgressBar`, and `updateReveal` each frame via `requestAnimationFrame`):

### 1. Scroll-driven "journey" intro (canvas, not Three.js)

Despite `index.html.txt`/`script.js.txt`/`styles.ces.txt` in the repo root showing an old Three.js cube prototype, **the live site does not use Three.js**. The current `script.js` draws a hand-rolled, phase-based 2D scene directly onto a `<canvas>` (`#journeyCanvas`) using the 2D context — there is no 3D library involved.

- `scrollProgress` (0→1) is derived from scroll position against `#scrollTrack`'s height (an invisible tall spacer div that exists purely to give the journey scroll distance).
- `updateJourney(p)` buckets progress into discrete phases (0–5, see the `PHASES` array and thresholds in `updateJourney`): exterior shopfront → entrance door → interior → barber chair → fade into real content.
- Each phase has a dedicated `draw*Scene()` function (`drawExteriorScene`, `drawEntranceScene`, `drawInteriorScene`, `drawBarberChairScene`) composed from smaller canvas-drawing helpers below them (`drawBuildings`, `drawShopFacade`, `drawBarberPole`, `drawMirror`, `drawBarberChair`, etc.). Extend the journey by adding a phase to `PHASES`, a threshold in `updateJourney`, and a corresponding `draw*Scene` branch in `draw(p)`.
- `#journeyOverlay` (intro title + per-phase caption text) fades in/out in sync with the same `scrollProgress`, independent of the canvas drawing.
- Once `scrollProgress` passes the phase-5 threshold, the overlay/canvas fade out and normal page content (`<main>`) takes over.
- `prefersReducedMotion` short-circuits the whole journey overlay (set to invisible, no animation) — preserve this when touching the journey code.

### 2. Multi-step booking wizard

A client-side-only, 4-step form (`#bookingForm`) with no backend: `bookingNext`/`bookingBack` show/hide `.form-step` panels by id (`step1`–`step4`, then `stepConfirm`), `validateStep` gates progression per step, and `updateStepDots` reflects progress in `.step-dot` indicators.

- Step 2's calendar (`renderCalendar`, `selectDate`) is a hand-built month grid (Mon-start weeks, Sundays and past dates disabled) driven by `calYear`/`calMonth` state — not a library.
- Step 3's time slots (`renderTimeSlots`, `TIMES`, `UNAVAILABLE`) are a static list with a hardcoded `UNAVAILABLE` set standing in for real availability data.
- Submission (`bookingForm`'s `submit` handler) just renders a confirmation message from the collected field values — nothing is sent anywhere. Any real booking/calendar integration would replace this handler.

### Other conventions

- Section-reveal-on-scroll animations use a plain `.reveal`/`.in-view` class toggle (`updateReveal`), checked on every scroll tick — not `IntersectionObserver`.
- Visual design tokens (colors, fonts, nav height, transition timing) are centralized as CSS custom properties at the top of `styles.css`; prefer adding to/reusing those over hardcoding new values.
- `styles.css` is organized into clearly delimited banner-comment sections (`/* ─── NAME ─── */`) matching the page's structural pieces (navbar, journey overlay, services, team, gallery, booking, footer, responsive breakpoints, reduced-motion overrides) — keep new styles under the matching section rather than appending to the end.

## Known repo quirks

- `index.html` references `logo.png`, which does not exist in the repo. `poltrona.png` is a stray 2-byte text file (not a valid image) left over from a renamed upload. Treat both as pre-existing issues, not something you introduced.
- `index.html.txt`, `script.js.txt`, and `styles.ces.txt` are leftover drafts from an earlier, unrelated site concept (a generic "Design 3D Ristorazione" page using Three.js). They are not loaded by the live page and are safe to ignore unless the user specifically asks about them.
