---
name: Linde Corrotech
description: Container and flatbed haulage from Jeddah Islamic Port to every region of Saudi Arabia.
colors:
  route-black: "#111418"
  ink-raised: "#171c23"
  ink-line: "#20262f"
  white: "#ffffff"
  paper-2: "#f1f3f5"
  paper-3: "#e4e8ec"
  sky-blue: "#1e9bff"
  sky-blue-hover: "#4cb0ff"
  sky-blue-text: "#0a6cc0"
  on-ink-secondary: "#a9b4c0"
  text-secondary: "#4a5562"
  error: "#b3261e"
  on-ink-body: "#d5dce4"
  on-ink-link: "#c9d2db"
  field-hover: "#b9c2cc"
  placeholder: "#6b7682"
  map-land: "#262d37"
  map-kingdom: "#2b3542"
  map-town: "#8995a3"
  photo-scrim: "rgba(10, 12, 15, .52)"
  mask: "#000"
typography:
  display:
    fontFamily: "Barlow Semi Condensed, Bahnschrift, Arial Narrow, sans-serif"
    fontSize: "clamp(3rem, 7.2vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Barlow Semi Condensed, Bahnschrift, sans-serif"
    fontSize: "clamp(2.4rem, 5.2vw, 4.6rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  lede:
    fontFamily: "Barlow, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 1.5vw, 1.35rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Barlow, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  small:
    fontFamily: "Barlow, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  plate-number:
    fontFamily: "Barlow Semi Condensed, sans-serif"
    fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "0.02em"
  nav:
    fontFamily: "Barlow, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  step-heading:
    fontFamily: "Barlow Semi Condensed, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 700
    lineHeight: 1.05
  plate-number-phone:
    fontFamily: "Barlow Semi Condensed, sans-serif"
    fontSize: "clamp(1.05rem, 4.6vw, 1.3rem)"
    fontWeight: 600
    lineHeight: 1.1
  figure-km:
    fontFamily: "Barlow Semi Condensed, sans-serif"
    fontSize: "clamp(4.5rem, 8vw, 7.5rem)"
    fontWeight: 700
    lineHeight: 0.85
    letterSpacing: "-0.03em"
  figure-count:
    fontFamily: "Barlow Semi Condensed, sans-serif"
    fontSize: "clamp(6rem, 14vw, 12rem)"
    fontWeight: 700
    lineHeight: 0.8
    letterSpacing: "-0.03em"
  arabic:
    fontFamily: "Cairo, Segoe UI, Tahoma, sans-serif"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "0em"
rounded:
  control: "2px"
  pin: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  section: "clamp(88px, 11vw, 168px)"
  surface-gap: "3px"
  max-width: "1360px"
components:
  button-primary:
    backgroundColor: "{colors.sky-blue}"
    textColor: "{colors.route-black}"
    rounded: "{rounded.control}"
    padding: "0 26px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.sky-blue-hover}"
  button-ink:
    backgroundColor: "{colors.route-black}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    height: "52px"
  field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.route-black}"
    rounded: "{rounded.control}"
    height: "56px"
  plate:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.white}"
    padding: "18px 22px"
---

# Design System: Linde Corrotech

## Overview

**The route out of the gate.** The logo is a globe with one sky-blue route, and the site is built as that route. Every load leaves Jeddah Islamic Port, and one Sky Blue line runs from there to its city: on the hero globe, on the ticker, through the steps and on the planner map. Route Black fields and white paper alternate section by section. Sky Blue is the only accent and always means "the route" or "the action".

Mode: Persuade. The visitor is a logistics or procurement manager comparing Jeddah carriers. They should learn in five seconds what we move and from where, see licence numbers they can check, and get to a written quote on WhatsApp.

Motion is part of the identity, not decoration. On the first visit an intro draws the logo's route round the globe. The hero globe then spins from the Atlantic to Arabia and dives in until the Kingdom fills the frame. Routes draw out of Jeddah and trucks run them. Headings rise word by word, and the statement over the port lights up word by word as you scroll.

## Colors

### Primary
- **Sky Blue** `#1E9BFF`: the route. Used for routes, primary buttons, the Jeddah pin, the scroll progress bar, the coverage count and the drenched quote section. Text on it is Route Black (about 6:1); white text on Sky Blue is not allowed below large sizes.
- **Sky Blue text** `#0A6CC0`: Sky Blue as text on white (links), for AA contrast.

### Neutral
- **Route Black** `#111418`: the main dark field (hero, coverage, licences, footer, header over dark sections).
- **Ink raised** `#171C23`: a surface one step up on Route Black (plates, region tiles, licence rows).
- **White** `#FFFFFF` and **Paper 2** `#F1F3F5`: light fields. Paper 2 holds the planner section and the fact rows.
- **Secondary text**: `#A9B4C0` on ink, `#4A5562` on white. Running text is always the full ink, or `#D5DCE4` for long ledes on Route Black.
- **Map greys** (planner map only): land `#262D37`, the Kingdom `#2B3542`, towns `#8995A3`.

### Light and dark mode
Follows the visitor's system setting; the header sun/moon button overrides it and the choice is saved (picking the system's own mode goes back to following it).
- **Deep sections** (hero, coverage, licences) use `--d-*` tokens: pale grey `#E7EBEF` with white tiles and Route Black text in light mode; Route Black `#111418` with `#171C23` tiles and white text in dark mode. Accent text is `#0A6CC0` on light, Sky Blue on dark.
- **Paper sections** (services, planner, steps, FAQ) are white / `#F1F3F5` in light mode and charcoal `#181D24` / `#20262E` in dark mode.
- **Always dark:** the port-photo statement, the footer (full reversed logo across the width), the intro, the planner's output panel, the phone menu and contact bar.
- The hero globe switches palette with the theme: dark ink dots and labels on light, pale dots and white labels on dark.

### Named Rules
- **One accent.** Nothing else is coloured. No red, no green, no gradients.
- **Fields, not borders.** Surfaces separate by a tone step and a 3px gap of the field behind, never by hairlines or shadows.
- **Section rhythm:** dark hero → blue ticker → white services → photo statement → dark coverage → grey planner → white steps → dark licences → blue quote → dark footer.

## Typography

- **Display and headings:** Barlow Semi Condensed 700, the web stand-in for the Bahnschrift the wordmark is drawn from. Tight (0.94–0.98 leading, -0.02em). Headlines stay at two lines or fewer.
- **Text:** Barlow 400/500/600.
- **Numbers that matter** (licence, CR, VAT, km, the 13): Barlow Semi Condensed with tabular figures, always set left-to-right even inside Arabic.
- **Arabic:** Cairo for everything, 800 for headings, letter-spacing 0, leading 1.25.

### Hierarchy
display (h1) → heading (h2, h3 in services) → lede → body → small. Step headings in "How a job runs" are 1.6rem.

## Layout

- One frame: max 1360px, gutter `clamp(16px, 4vw, 56px)`, equal on both sides.
- Sections `clamp(88px, 11vw, 168px)` apart. Section heads are two columns: heading left, lede right.
- Each section has its own composition: split hero, full-bleed ticker, alternating image/text services, full-bleed photo statement, copy + square image, form + dark output panel, five stops on a line, numbers + sticky photo, copy + form on blue, full-width wordmark footer.
- RTL: logical properties throughout; layouts mirror automatically. The ticker stays left-to-right.
- Phones: single column. Fixed bottom bar with Call · WhatsApp · Get a quote, which steps aside when the quote form is on screen.

## Elevation & Depth

Flat. No shadows on anything at rest. Depth comes from the tone step (Route Black → Ink raised) and from the photographs. The only overlays are the neutral 52% scrim on the statement photo and the mobile menu panel.

## Shapes

Square-cornered (2px) controls and panels, matching the geometric wordmark. Circles are used only for map pins, step stops and the replay button.

## Components

### Buttons
- Primary: Sky Blue, Route Black text, 52px tall, arrow that slides 5px on hover (mirrored in RTL).
- Ghost on ink: 1.5px inset white line at 40%, full white on hover.
- Ink (on blue): Route Black with white text.

### Plates
Licence and registration numbers set like number plates: small label above, large condensed tabular number, Ink-raised tile. Licence rows add a Copy button that turns Sky Blue with "Copied".

### Fields
White, 56px, 1.5px inset line; focus is a 2px Sky Blue text-colour inset. Errors: inset red line plus a sentence that names what's missing.

### Route planner
Selects for from/to, a three-way segmented control for 20 ft / 40 ft / flatbed, and a dark output panel: a Saudi map with every route faint and the chosen one drawn in Sky Blue, the km count tweening, days on the road, and WhatsApp/email hand-offs with the message pre-written.

### FAQ
Native `<details>` rows on Paper 2 (Paper 3 when open), 3px gaps, question as an h3 in the summary, a plus that turns to a cross. Heading and lede sit in a sticky left column on desktop.

### Motion vocabulary
Ease `cubic-bezier(.16,1,.3,1)`. Word rise 1s with 55ms stagger; block rise 26px over 0.9s with 85ms stagger; image clip-wipe 1.3s; count-ups 1.4s; Lenis smooth scroll (mouse and trackpad only). With `prefers-reduced-motion`, all travel stops and content shows at once. The intro is skipped, and the globe shows its final state and can still be dragged.

## Do's and Don'ts

- **Do** show only true numbers: licence 63/00063222, CR 7052479644, VAT 314382023100003, 13 regions. **Don't** invent fleet sizes, clients, reviews or prices.
- **Do** describe only containers and flatbeds. **Don't** list reefer, curtainside, rental or cross-border until they're offered.
- **Do** credit every found photograph on `credits.html` (linked from the footer © line) and caption what it shows. **Don't** present a found photo as our own truck, yard or team.
- **Don't** add eyebrow labels above headings, gradient fills, glass, drop shadows, or a second accent colour.
- **Don't** put white body text on Sky Blue.
