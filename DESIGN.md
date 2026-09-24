---
name: Sports Center Management
description: Energetic, trustworthy sports-center experiences with a clear path from discovery to action.
colors:
  pine-primary: "#1d4c43"
  pine-hover: "#286557"
  pine-deep: "#101c1a"
  pine-gradient-start: "#274e45"
  pine-gradient-mid: "#172b28"
  oat-surface: "#f4efe5"
  oat-light: "#fbf4e9"
  pale-sage: "#f2f7ef"
  ink: "#1c2824"
  muted-ink: "#68756d"
  quiet-ink: "#89948c"
  pine-muted: "#47564d"
  honey-accent: "#f1b56d"
  honey-focus: "#e09d57"
  border: "#d8d8cc"
  divider: "#cfd5ca"
  white: "#ffffff"
  success-bg: "#dcfce7"
  success-ink: "#166534"
  error-bg: "#fee2e2"
  error-ink: "#991b1b"
typography:
  display:
    fontFamily: "Georgia, serif"
    fontSize: "clamp(3.3rem, 6vw, 6.4rem)"
    fontWeight: 400
    lineHeight: 0.98
  body:
    fontFamily: "Trebuchet MS, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
  label:
    fontFamily: "Trebuchet MS, Segoe UI, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    letterSpacing: "0.18em"
rounded:
  sm: "2px"
  md: "4px"
  lg: "8px"
  pill: "100px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.pine-primary}"
    textColor: "{colors.oat-light}"
    rounded: "{rounded.sm}"
    padding: "15px 18px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.pine-hover}"
  package-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Sports Center Management

## 1. Overview

**Creative North Star: “The Training Ground.”**

The visual system should feel energetic and trustworthy: sport is present, but clarity and dependable service lead. The current sign-in screen pairs a deep pine gradient with a warm, quiet form surface; authenticated screens carry that palette into practical class and package workflows. Keep public discovery and signed-in operations visibly distinct while making the transition between them easy to understand.

Use the selected Pine / Oat / Honey names for the existing CSS colors; the hex values above are extracted from the current implementation, not a palette refresh. The intended direction is more dimensional than the current mostly-flat screens, but elevation must clarify hierarchy rather than decorate it. Reject high-pressure sales, false scarcity, unsupported health or performance claims, and generic fitness clichés.

**Key Characteristics:** grounded green, warm neutral surfaces, a restrained amber signal, editorial Georgia headings, and task-focused controls.

## 2. Colors

The palette combines Pine structure, Oat breathing room, and Honey energy; keep semantic status colors separate from brand colors.

### Primary
- **Pine Green** (`#1d4c43`): Primary actions, active navigation, and the authenticated brand mark.
- **Deep Pine** (`#101c1a`): The dark sign-in shell and deepest background tone.
- **Pine Canopy** (`#274e45` to `#172b28`): Start and middle stops in the sign-in hero gradient; the gradient resolves into Deep Pine.
- **Pine Lift** (`#286557`): Primary-button hover state.

### Secondary
- **Honey Signal** (`#f1b56d`): The sign-in accent, brand-mark separator, and small status signals. Keep it a signal, not a large decorative fill.
- **Honey Focus** (`#e09d57`): Focus underline treatment on form controls.

### Neutral
- **Warm Oat** (`#f4efe5`): Main authenticated surface and sign-in form panel.
- **Oat Light** (`#fbf4e9`): Light text on Pine actions.
- **Pale Sage** (`#f2f7ef`): Headline text on the dark sign-in hero.
- **Training Ink** (`#1c2824`): Main text on light surfaces.
- **Pine Muted** (`#47564d`) and **Muted Sage** (`#68756d`): Supporting text and labels.
- **Quiet Sage** (`#89948c`): Secondary metadata; check contrast before using for essential small text.
- **Soft Divider** (`#d8d8cc`) and **Sage Rule** (`#cfd5ca`): Borders and separators.

### Semantic States
- **Success:** pale green (`#dcfce7`) with dark green (`#166534`); success copy also uses `#1d6b4f`.
- **Error:** pale red (`#fee2e2`) with dark red (`#991b1b`); inline errors also use `#a33f35`.
- Existing package-category badges also use blue, violet, yellow, and slate fills. Treat these as category/status indicators only; do not promote them into the core brand palette.

**The Honey Signal Rule.** Honey marks focus and small points of attention. Never rely on it alone to communicate status.

## 3. Typography

- **Display Font:** Georgia, serif
- **Body Font:** Trebuchet MS, Segoe UI, sans-serif
**Label/Mono Font:** No separate mono family is used.

**Character:** Georgia gives the sign-in and section headings an editorial, confident voice; the system sans-serif stack keeps forms, package data, and operational copy familiar and readable. Preserve this contrast without using display type for controls or dense data.

### Hierarchy
- **Display** (regular, `clamp(3.3rem, 6vw, 6.4rem)`, line-height `0.98`): The sign-in hero headline.
- **Headline** (regular Georgia, up to `7rem`, line-height `0.95`): Dashboard and member page headings. The current CSS scales these fluidly; verify wrapping at narrow widths.
- **Title** (regular Georgia, `2rem`–`3rem`): Class names and package-section headings.
- **Body** (regular, `1rem` baseline; `1.1rem` for leads): Instructions, descriptions, and member-facing details. Keep prose comfortably readable and avoid long unbroken lines.
- **Label** (bold, typically `0.72rem`–`0.78rem`, letter spacing up to `0.18em`, sometimes uppercase): Form labels and small section identifiers. Use sparingly; do not add an eyebrow to every content block.

**The Task-Type Rule.** Georgia belongs to editorial headings. Buttons, inputs, labels, and operational data stay in the sans-serif stack.

## 4. Elevation

The current interface is mostly flat, with tonal contrast and borders doing most of the structural work. The selected direction allows more depth where it improves hierarchy: package cards may lift subtly on hover, and dialogs may sit clearly above the page. Preserve shadows as functional depth cues rather than ambient decoration.

### Shadow Vocabulary
- **Package-card hover** (`0 8px 24px rgba(28, 40, 36, 0.08)`): A restrained lift paired with a small upward movement.
- **Dialog** (`0 20px 40px rgba(0, 0, 0, 0.2)`): A structural shadow that separates the modal from its backdrop.
- **Sign-in orbit:** The hero's concentric rings are an ambient brand motif, not a reusable card shadow.

**The Purposeful Depth Rule.** Use stronger elevation only to communicate interaction or layer order; never add shadows uniformly to every panel.

## 5. Components

### Buttons
- **Shape:** Tight corners (`2px`) for primary actions.
- **Primary:** Pine Green background, Oat Light text, bold sans-serif, `15px 18px` padding. Hover shifts to Pine Lift; disabled buttons reduce opacity and stop accepting input.
- **Ghost / tab:** Transparent surface with Pine text or muted text; the active tab uses a Pine underline.
- **Focus:** The current CSS does not define a distinct button focus-visible treatment. Add a clear, high-contrast keyboard focus indicator when extending these components.

### Chips
- **Style:** Filter chips use a transparent background, Soft Divider border, and pill corners (`100px`).
- **State:** Selected filters use Pine Green fill and Oat Light text. Keep selection understandable without color alone.

### Cards / Containers
- **Corner Style:** Package cards and dialogs use gently rounded corners (`8px`); category/status badges are tighter (`4px`).
- **Background:** White package cards sit on Warm Oat; class rows use Warm Oat with a shared divider behind the list.
- **Shadow Strategy:** Cards are bordered and flat at rest; use the package-card hover shadow only as interaction feedback. Dialogs use the structural shadow above.
- **Internal Padding:** Package cards use `24px`; class rows use `26px`.

### Inputs / Fields
- **Style:** Login fields are transparent with a bottom rule; search fields use a white fill, border, and `4px` radius.
- **Focus:** Form controls shift to Honey Focus and gain a visible underline treatment. Preserve keyboard visibility and do not remove the browser outline without a sufficient replacement.
- **Error / Disabled:** Pair error text with an explicit message/state; disabled controls must remain distinguishable beyond cursor changes.

### Navigation
- **Style:** A simple top bar separates the brand, tabs, and logout action. Tabs are sans-serif and muted by default; the selected tab uses Pine text and a Pine underline.
- **Responsive:** At the existing `800px` breakpoint, stack the sign-in panels, class rows, and package controls rather than forcing desktop columns onto narrow screens.

### Feedback and Dialogs
- **Feedback bars:** Use explicit success/error copy with the semantic green/red treatments above; feedback is not color-only.
- **Dialog:** Keep the existing centered, scroll-bounded package form treatment for focused edits. Do not use a modal as the default answer for unrelated member tasks.

## 6. Do's and Don'ts

### Do:
- **Do** preserve the selected “The Training Ground” direction: athletic energy grounded in trustworthy information.
- **Do** use Pine for primary actions, Oat for calm working surfaces, and Honey for focused signals.
- **Do** keep public discovery distinct from authenticated member and manager workflows.
- **Do** provide visible keyboard focus, semantic feedback, reduced-motion behavior, and contrast checked against WCAG AA before reusing colors for small text.
- **Do** keep responsive behavior structural; the existing layout stacks at `800px`.
- **Do** use layered elevation deliberately where it clarifies cards, dialogs, or interaction.

### Don't:
- **Don't** use high-pressure sales tactics, false scarcity, or unsupported health and performance claims.
- **Don't** let marketing language or visual decoration obscure the next useful action.
- **Don't** use generic fitness clichés that make the center feel interchangeable.
- **Don't** use Honey or any other color as the only way to communicate status or focus.
- **Don't** spread heavy shadows across every surface; depth must communicate hierarchy.
