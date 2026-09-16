# Daj Peticu — Design System

NFC cards that turn a paying customer into a Google review with one tap. Sold direct to small
Serbian businesses — cafés, hair salons, restaurants, clinics, car washes — through Instagram and a
one-page site with an order form. Physical product, one-off price, delivered by post, cash on delivery.

**The audience decides most of this system.** The buyer is a 40+ shop owner reading on a phone, in
daylight, between customers. Everything here is therefore high-contrast, large-type, generously
tappable, and written in plain Serbian.

---

## Sources given

| Source | What it was | How it was used |
| --- | --- | --- |
| `uploads/cc6e35a89cf3458f5777833a6f897696.jpg` | Landing page for a *skincare* brand ("Velvéa") — deep royal blue, serif display type, lavender-grey surfaces, sparkle accents | **Structural reference only.** Its system shape was carried over; its blue was deliberately not. |
| Live Instagram bio (pasted in chat) | `Konkurencija nije bolja od vas. Samo ima više recenzija. / Kartice tamo gde mušterija plaća → jedan tap → 5⭐ / 📦 Poruči za 1 minut, stiže poštom 👇` | The only real brand copy. It sets the entire voice. |

**Not given, and therefore not in here:** no logo, no live site, no Figma file, no codebase, no product
photography, no font files, no real prices or testimonials. Everything of that kind in this system is
explicitly flagged as a placeholder.

---

## The colour decision (still open)

The reference's royal blue could not be used: this product sells *Google* review cards, and a blue
primary would read as Google's own branding. Three primaries were built instead, all far from
`#4285F4`, all tested against gold. **Direction A (Ink Indigo) is the default**; B and C are live in the
same stylesheet behind a `data-brand` attribute, so switching costs one line.

| | Primary | Feel |
| --- | --- | --- |
| **A · Ink Indigo** *(default)* | `#262f6b` | Closest to the reference's mood, pushed deep and inky. Trustworthy. Gold reads as gold leaf on navy. |
| **B · Deep Teal** | `#0e5c55` | Furthest from Google, freshest. Modern, hygienic — suits salons and clinics. Gold pops hardest. |
| **C · Oxblood** | `#7a2233` | The warm option. Domestic and human rather than techy, on a faintly warm page. Gold reads as a matched metal. |

```html
<html data-brand="teal">   <!-- or "oxblood"; omit for Ink Indigo -->
```

See `guidelines/primary-directions.html` for all three applied to a real phone-width page.

**Gold `#FFC53D` is reserved for star glyphs only** — never a button, surface, border or text colour.
The only sanctioned use is the `StarRating` component.

---

## Fonts — chosen and verified

Serbian latinica needs Latin Extended (č ć š ž đ Č Ć Š Ž Đ). Many elegant display serifs ship
latin-only; these two do not.

| Role | Face | Diacritics |
| --- | --- | --- |
| Display / headings | **Playfair Display** (400–800, Google Fonts) | latin-ext subset present; **rendered and confirmed** — see `guidelines/type-display.html` |
| Body / UI | **Plus Jakarta Sans** (300–800, Google Fonts) | latin-ext subset present; **rendered and confirmed** — see `guidelines/type-body.html` |

Both are loaded from the Google Fonts CDN in `tokens/fonts.css` (no font binaries were supplied, so
none are vendored). **These are substitutions chosen by me, not brand fonts** — if Daj Peticu has or
buys real faces, drop the files in `assets/fonts/` and swap the `@font-face` block; nothing else changes.

**Serbian strings run 15–25% longer than English.** Consequences baked into the system: no fixed
button widths (only `--btn-min-w: 150px`, labels may wrap to two lines), fluid `clamp()` type scale,
`text-wrap: balance` on headings and `pretty` on paragraphs, `align-items: stretch` on card grids, and
`minmax()` auto-fit grids rather than fixed column counts. `guidelines/type-length.html` demonstrates this.

---

## CONTENT FUNDAMENTALS

**Language: Serbian (latinica) only.** No English anywhere in the product — not in buttons, not in
error messages, not as a loanword where a Serbian word exists ("Poruči", never "Order"; "Cijene",
never "Pricing"). Technical terms that have no Serbian equivalent stay as they are: *NFC*, *QR*,
*Google*, *SMS*, *WiFi*.

**Address: vi (formal plural), consistently.** The buyer is an adult stranger who owns a business.
Formal-but-warm, the way a good supplier talks. Never *ti*. Never corporate third person ("naša
kompanija vam nudi mogućnost…").

**Person:** *you* far more than *we*. The copy is about the reader's problem and the reader's
customers. *We* appears only where it means "we do the work so you don't": *"Mi je podesimo."*

**Sentence shape: short, declarative, one idea each.** The Instagram bio is the model — three lines,
three full stops, no subordinate clauses:

> Konkurencija nije bolja od vas. Samo ima više recenzija.

Fragments are welcome as emphasis: *"Bez aplikacije. Bez struje. Bez pretplate."*

**Frame the problem as neutral, never as the reader's failure.** The bio's move — *your competitor
isn't better, they just have more reviews* — is the brand's whole argument. Copy reassures; it never
scolds or implies the business is doing badly.

**Concrete over abstract.** Numbers, objects, timeframes: *"34 nove recenzije za dvije nedjelje"*,
*"stiže poštom za 2 dana"*, *"traje minut"*. Never "poboljšajte svoju online reputaciju".

**Casing: sentence case everywhere.** Headings, buttons, labels, badges — all sentence case. The one
exception is the eyebrow, which is UPPERCASE with `0.12em` tracking at 14px. No Title Case (it is an
English convention and looks wrong in Serbian). No ALL CAPS for emphasis.

**Punctuation:** Serbian quotation marks „ “ for quotes (the `TestimonialCard` adds them — don't type
them into the string). Em dash — with spaces for asides. Prices with a thin space as the thousands
separator and no decimals: *1 990 RSD*, *12 900 RSD*. Phone numbers as *+381 60 123 4567*.
Exclamation marks: at most one per page, and usually zero.

**Emoji: in social copy, never in the interface.** The Instagram bio uses 📦 ⭐ 👇 and that is correct
for Instagram. In the product, a star is the `StarRating` component and an arrow is a Lucide icon.
Never emoji in buttons, headings, cards or form labels.

**Buttons say what happens, with the object included:** *"Poruči karticu"*, *"Poruči 3 kartice"*,
*"Pošalji recenziju"*. Never bare *"Pošalji"*, never *"Klikni ovde"*, never *"Saznaj više"*.

**Errors are short, human, and tell you what to do:** *"Unesite naziv objekta."*,
*"Potrebno je prihvatiti uslove."* No error codes, no "Došlo je do greške".

**Reassurance is a content type of its own.** Every commitment gets a small removal-of-risk line next
to it: *"Plaćate pouzećem, kada paket stigne."*, *"Zamjena bez pitanja u prvih 30 dana."*,
*"Zovemo samo ako nešto nije jasno."*, *"javlja se čovjek, ne robot."*

**Do / don't** — rendered as a card in `guidelines/voice.html`.

| Write | Don't write |
| --- | --- |
| Konkurencija nije bolja od vas. Samo ima više recenzija. | Inovativno NFC rešenje za optimizaciju reputacije |
| Jedan tap — i recenzija je gotova. | Boost your Google reviews today! |
| Poruči za 1 minut, stiže poštom. | Naša kompanija vam nudi mogućnost da… |
| Bez aplikacije. Bez struje. Bez pretplate. | 🚀🔥 NAJBOLJA PONUDA!!! 💯 |

---

## VISUAL FOUNDATIONS

**The shape of the system.** One saturated primary, one dark neutral ramp for all text, near-white
page with white cards, and gold for stars. Four colours doing four jobs — no secondary accent, no
tertiary palette, no gradients standing in for hierarchy.

**Colour.** Page is `--surface-1` (`#f6f7fa`, near-white); cards are pure white `--surface-0`; the
sunken tone `--surface-2` marks nested panels. Text is never pure black: `--ink-900` for headings,
`--ink-700` for body, `--ink-500` for captions. The primary carries links, icons, numbers, the step
markers and the primary button — nothing else. Semantic colours (`--success`, `--warning`, `--danger`)
appear in form validation and order status only, never decoratively.

**Backgrounds.** Flat colour, full-bleed sections alternating light / alt / inverse for rhythm. **No
photography is in the system** (none was supplied). **No repeating patterns, no textures, no grain, no
hand-drawn illustration, no confetti.** The single permitted gradient in the whole system is a very
soft radial glow behind the hero product shot: `radial-gradient(60% 60% at 50% 45%, var(--primary-quiet), transparent 70%)`.
No linear gradients, no bluish-purple gradient washes, no gradient text, no gradient buttons.

**Imagery — when it exists.** Warm, daylight, real Serbian interiors: a café counter, a salon
reception, hands holding a phone over the card. Not stock-corporate, not cool-toned, not black and
white, no heavy grain or filters. Photos sit at `--radius-image` (28px) and are cropped, never framed
with a border. Until real photos arrive, the product itself is rendered by `CardMock` from brand
elements only — no fake photography, no AI imagery.

**Type.** Playfair Display for anything that is a heading, a price, or a quote — display sizes are
tight (`--lh-display: 1.06`, `-0.02em` tracking) and weight 600. Plus Jakarta Sans for body, labels,
buttons and captions at `--lh-body: 1.6`. Body floor is **17px**; nothing in the UI goes below 15px.
Prose measures cap at 62ch. Never set body copy in the serif; never set a heading in the sans.

**Spacing.** 4px base scale, `--space-1` … `--space-32`. Section rhythm is
`--section-y: clamp(56px, 9vw, 120px)`; gutters 20px on mobile, 32px up; container 1160px, prose
container 760px. Inside a card, `--space-6` (24px); card grids use `--space-5` (20px) gaps.
**All sibling groups are laid out with flex/grid + `gap`** — never margins between siblings.

**Corner radii.** Soft and generous, not squared and not fully-rounded-everything: fields 14px, cards
20px, images 28px, and **buttons and badges are full pills** (`999px`). The pill button is the single
most recognisable shape in the system.

**Cards** are white, `20px` radius, a **1px hairline** `--border-soft` (`#e6e9f1`), and a very low
shadow `--shadow-sm`. Border *and* shadow together, always — never shadow alone, never border alone.
A featured card (the recommended price tier) gets a **2px primary border** and `--shadow-lg` instead of
any colour fill. **No card ever has a coloured left border only.**

**Shadows** are tinted with the primary hue, never neutral black:
`rgb(var(--shadow-hue) / .07)`. Four steps — `xs` hairline, `sm` resting card, `md` hover,
`lg` featured/floating. Inner shadow appears in exactly one place: a 1px inset on form fields.

**Borders.** Three weights of hairline (`--border-soft` inside cards, `--border` on fields,
`--border-strong` on field hover) plus a 2px `--border-w-strong` for outline buttons and featured
cards. Dividers are 1px `--border-soft` — the FAQ list is built from them.

**Transparency and blur** are used once, deliberately: the sticky header is
`rgb(255 255 255 / .88)` with `backdrop-filter: blur(12px)`. On the inverse section, nested cards use
`rgb(255 255 255 / .07)`. Nothing else is translucent — no glassmorphism, no frosted modals.

**Protection gradients: not used.** Because there is no imagery-over-text, text never needs a scrim.
Ratings and labels that sit over anything use an opaque **capsule** instead (white pill, hairline
border, `--shadow-sm`) — see `guidelines/star-motif.html`.

**Animation.** Calm and short. Durations 120 / 200 / 340ms, easing `cubic-bezier(.2, .7, .3, 1)`.
Permitted: opacity fades, colour transitions, and a 3px upward lift on interactive cards. **No bounce,
no spring, no scale-in entrances, no parallax, no scroll-jacking, no autoplaying carousels.** In-page
navigation uses native smooth scroll. Motion is decoration here, never information.

**Hover** darkens: primary button `--primary` → `--primary-hover` plus a shadow step up. Quiet
buttons move to a slightly stronger tint. Ghost buttons pick up a `--surface-2` fill. Interactive
cards lift 3px, gain `--shadow-md`, and their border turns `--primary-line`. **Never opacity-fade on
hover** — it looks like something is disabled.

**Press** shrinks: `scale(0.985)` plus the darkest primary step `--primary-active`. No ripple.

**Focus** is a 3px primary-tinted ring, `--shadow-focus`, always visible and never removed — a large
share of these users tab through forms.

**Disabled** is a flat grey fill (`--surface-3`) with `--ink-400` text at full opacity, not a faded
version of the live button — faded buttons are unreadable in daylight.

**Layout rules.** Sticky blurred header, `z-index: 20`. Nothing else is fixed — no sticky CTA bar, no
floating chat bubble, no cookie banner in the design. The order summary is `position: sticky` inside
its column on desktop and simply flows on mobile. Mobile nav collapses to a burger below 760px.
Hit targets are never below `--hit-min: 48px`; form fields are 54px, buttons 44/52/60px.

**The one brand device is five gold stars.** Allowed: rating rows, testimonial cards, the hero proof
line, the product card art, the footer. Not allowed: stars as list bullets, background sparkle fields,
scattered confetti, or gold used for anything that is not a star.

---

## ICONOGRAPHY

**No icon set was supplied.** Substituted: **Lucide 0.544.0** from CDN
(`https://unpkg.com/lucide@0.544.0/dist/umd/lucide.js`) — 2px stroke, rounded caps, geometric, which
matches the system's soft-but-plain register better than a filled or duotone set. **This is a
substitution and should be reviewed.**

- **Stroke only, 2px, never filled.** Sizes 18 / 20 / 22 / 24; 20 inline with body text, 22–24 standalone.
- **Icons take `currentColor`** — primary inside tinted tiles, `--ink-700` on neutral surfaces, white on inverse. Icons are never gold.
- **Icon tiles**: 52px square, `--radius-md`, `--primary-quiet` fill, icon in `--primary`. This is the `FeatureCard` pattern.
- **The vocabulary actually in use:** `nfc`, `qr-code`, `smartphone`, `star`, `truck`, `shield-check`, `banknote`, `badge-percent`, `zap-off`, `store`, `check`, `plus`, `minus`, `menu`, `x`, `arrow-right`, `arrow-left`.
- **The gold star is not a Lucide icon.** It is a filled path owned by `StarRating`, so its colour and geometry stay under brand control. It is the only filled glyph in the system.
- **No icon font, no sprite sheet, no PNG icons.** Lucide renders inline SVG via `lucide.createIcons()`.
- **No emoji in the interface** (social copy only). **No Unicode characters used as icons** — no ✓, ★, →, ✕ in markup; use the component.
- **No hand-drawn or hand-rolled SVG illustration.** Where an illustration would go, the system shows the product (`CardMock`) or nothing.

Every page that renders components must load the Lucide UMD script and call `lucide.createIcons()`
after mount; `Icon.jsx` calls it on every render as a safety net.

### assets/
`assets/` currently holds **no logo and no imagery** — none was provided. The brand renders as type
via the `Wordmark` component. See "Logo slot" below.

---

## Logo slot (mark pending, by design)

There is no Daj Peticu mark yet — it will be designed after this system's primary is locked, and
**nothing here approximates or invents one**. The slot it will occupy is fully specified now:

| Token | Value |
| --- | --- |
| `--logo-h-header` / `--logo-h-header-lg` | 30px / 34px |
| `--logo-h-footer` | 28px |
| `--logo-h-hero` | 56px |
| `--logo-mark-box` | 34px square, left of the wordmark |
| `--logo-gap` | 10px between mark and wordmark |
| `--logo-clear-space` | 0.5 × slot height, all four sides |
| `--logo-max-w` | 200px |

Always render the brand name through `<Wordmark>` — never hand-typeset it. When the mark exists, save
it to `assets/logo.svg` and pass `markSrc`; no layout changes. Specimen:
`guidelines/logo-slot.html`.

---

## Index

### Root
| File | What |
| --- | --- |
| `styles.css` | The single entry point consumers link. `@import` lines only. |
| `readme.md` | This file. |
| `SKILL.md` | Agent-skill front matter for use outside this project. |
| `thumbnail.html` | Homepage tile for the design system. |

### `tokens/`
`fonts.css` (Google Fonts + family vars) · `colors.css` (ramps, semantic aliases, `data-brand`
alternates) · `typography.css` (fluid scale, line-heights, weights, measures) · `space.css` (spacing,
radii, shadows, motion, logo slot) · `components.css` (button / field / badge / card state tokens).

### Components
**`components/core/`** — `Button`, `Badge`, `Card`, `StarRating`, `Wordmark`, `Icon`
**`components/forms/`** — `Input`, `Select`, `Choice`
**`components/marketing/`** — `SectionHeading`, `FeatureCard`, `StepItem`, `TestimonialCard`, `PriceCard`, `FaqItem`

Each has a sibling `.d.ts` (props contract) and `.prompt.md` (what & when + usage). Each directory has
one `@dsCard` HTML showing its states.

**Intentional additions** (no source defined a component inventory, so a standard set sized to a
one-page site + order form was authored):
- `Icon` — a thin wrapper over Lucide, so the icon source can be swapped in one file.
- `Wordmark` — exists specifically to hold the logo slot until a mark is designed.
- `StarRating` — the brand device needed to be a component so gold stays contained.
- `Choice` — checkbox and radio are one component because they differ only by `type` and both need the same 48px hit area and `boxed` tile mode.

### `ui_kits/website/`
`index.html` (interactive click-through) · `Home.jsx` · `Order.jsx` · `Confirmation.jsx` ·
`Chrome.jsx` (`Header`, `Footer`, `Section`) · `CardMock.jsx` · `README.md`.
**Net-new, not a recreation** — no site or codebase existed to copy.

### `guidelines/`
`primary-directions.html` (the three primaries applied) · colour cards (`color-primary`, `color-gold`,
`color-neutrals`, `color-surfaces`, `color-semantic`, `color-alternates`) · type cards
(`type-display`, `type-body`, `type-length`) · `spacing-scale`, `radius-scale`, `shadow-scale`,
`motion` · brand cards (`logo-slot`, `star-motif`, `voice`).

---

## Open questions for the brand owner
1. **Which primary?** A / B / C — everything else is locked and re-skins from one attribute.
2. **Fonts** are my substitutions. Approve, or supply real faces (must cover č ć š ž đ).
3. **Icons** are Lucide by substitution. Approve or replace.
4. **No logo, no photography, no real prices, testimonials or contact details** — every such value in here is a placeholder.
