# Landing Page Prompt — "Daj Peticu"

> Paste this whole file as the brief. Build ONE interactive landing page that
> introduces the product and takes the visitor all the way to a placed order.

---

## 1. What to build

A **single-page, mobile-first landing page** that sells **one physical product** — an NFC card that gets a local business more Google reviews — and carries the visitor from "what is this" to a **completed order** (package → address → payment method → confirmation).

This is **not** a portfolio site and **not** a multi-product store. One product, three package sizes, one goal: a placed order.

---

## 2. Brand

| | |
|---|---|
| Name | **Daj Peticu** |
| Domain | `dajpeticu.rs` |
| Instagram | `@dajpeticu` |

**Name meaning (use it in the copy):** *"daj peticu"* is Serbian for **high five**, and *petica* is also the **top grade (5)** — which maps directly onto **5 stars**. An NFC tap is physically a small high five between a phone and a card. All three meanings should feel present without ever being explained.

**Tone of voice:** relaxed, direct, warm, domestic. Talk to the business owner as a peer, not as a client. No corporate language, no English buzzwords, no "solutions" or "platforms". Short sentences. Confident, occasionally a little cheeky, never salesy-desperate.

**Existing brand voice sample** (this is the live Instagram bio — the page must sound like it):

```
Konkurencija nije bolja od vas. Samo ima više recenzija.
Kartice tamo gde mušterija plaća → jedan tap → 5⭐
📦 Poruči za 1 minut, stiže poštom 👇
```

---

## 3. The product

A **plastic card, credit-card sized (85.6 × 54 mm)**, with an NFC chip inside (NTAG213). The business puts it wherever customers pay — counter, table, bar, register. The customer taps it with their phone and **the Google review form for that exact business opens instantly** — no searching, no typing, no app, no QR code.

Key facts to work into the copy:

- Works on **every modern phone**, no app needed
- **We program each card** with that specific business's Google link before shipping
- The chip is **locked** after programming, so nobody can redirect it
- **No subscription, no monthly fee** — you buy the card and it is yours
- **No battery, no maintenance** — it works for years
- Ships by post across Serbia

---

## 4. Audience

Owners of **small local businesses in Serbia**: hair and beauty salons, restaurants, cafés, fast food, tradespeople, gyms, car washes, dentists, small shops.

Assume the visitor:

- Is **not technical**. Never say NFC/NTAG/NDEF without immediately explaining it in plain words.
- Is **40+**, reading on a phone, possibly in daylight, possibly in a hurry between customers.
- Is **sceptical** — has been sold "digital marketing" before and it did not work.
- Knows their Google rating matters but has **no idea how to actually get reviews**, and feels awkward asking customers for them.

The emotional core: *my competitor is not better than me, they just have more reviews.* Everything on the page serves that one feeling.

---

## 5. Language

**All copy in Serbian (latinica).** Do not translate anything to English — not headings, not buttons, not form labels, not error messages. Use the polite plural ("vi") form throughout. Serbian diacritics (č, ć, š, ž, đ) must render correctly, so pick fonts with Latin Extended support.

---

## 6. Traffic context — this dictates the design

**Nearly every visitor arrives from the Instagram bio link, on a phone.** Design mobile-first and treat desktop as the secondary case. The visitor has just read a one-line hook and tapped through — they arrive curious but impatient.

Practical consequences:

- The **first screen on a phone** must make the product obvious without scrolling
- A **sticky "Poruči" button** should be reachable at all times on mobile
- The whole page must be usable **one-handed, with a thumb**
- Fast: no heavy assets, no layout shift

---

## 7. Visual direction

**Reference feel:** light and airy, generous whitespace, an elegant display face for headings paired with a clean sans for body text, the product photographed as the hero of the page, soft rounded cards, restrained sparkle/star accents, one full-bleed band of strong colour used sparingly as a rhythm break.

**Adapt, do not copy.** The reference is a seven-product skincare catalogue. We have **one product in three package sizes**, so the "featured collection" grid becomes the **package selector** — which is the single most important section on this page and deserves the strongest visual treatment.

Product imagery: the card shown on a real counter or table, at an angle, with a phone approaching it. If real photography is unavailable, use a clean 3D-style mockup of a card and a phone — never clip-art.

---

## 8. Colour — propose it, do not assume it

**The palette is not decided yet. Propose 2–3 complete palettes and show them applied.** The primary colour chosen here will become the brand's logo colour afterwards, so it has to carry weight on its own.

Constraints:

- **Avoid Google blue (`#4285F4`) and Google red.** The page talks about Google reviews and must never look like it is pretending to be Google.
- Must sit well **next to gold `#FFC53D`** — stars appear throughout the page and gold is reserved exclusively for them.
- **High contrast, large type.** Many visitors are 40+ on a phone screen in daylight.
- Structure each palette as: one **primary**, one **dark neutral**, one **light background**, plus gold for stars only.
- A light background is preferred (matching the reference), but include one darker option so there is a real choice.

---

## 9. Typography

- Headings: an elegant display face with character (a modern serif or a distinctive geometric sans)
- Body: a highly legible sans, minimum **17px on mobile**
- Must support **č ć š ž đ** — verify before committing
- Never more than two families

---

## 10. Page structure

Build the sections in exactly this order.

### 10.1 Sticky header
Logo left, **`Poruči`** button right. Stays visible on scroll. On mobile it shrinks but never disappears.

### 10.2 Hero
- Headline carrying the competitive tension. Starting point: **`Konkurencija nije bolja od vas. Samo ima više recenzija.`**
- Subhead in one sentence: what the card is and what it does
- Primary CTA: **`Poruči karticu`** · secondary text link: `Kako radi ↓`
- Hero image: card on a counter, phone approaching
- Trust strip directly under the CTA: `Bez pretplate` · `Plaćanje pouzećem` · `Slanje širom Srbije`

### 10.3 The problem
Name the pain before naming the product. Content: satisfied customers leave and forget; nobody types a review unprompted; asking for reviews feels awkward; meanwhile the competitor down the street collects them. Keep it to three or four short lines — recognition, not a lecture.

### 10.4 How it works — three steps
Big numbered steps with simple illustrations:

1. **`Postavite karticu`** — wherever customers pay
2. **`Mušterija prisloni telefon`** — the Google review form opens instantly
3. **`Stiže vam recenzija`** — no app, no typing, no searching

Include a small **interactive tap demo**: tapping or hovering a card graphic animates a phone approaching and a review form appearing. This section must kill the "my customers will not know how" objection visually.

### 10.5 Package selector — THE most important section
Three cards, side by side on desktop, stacked or swipeable on mobile:

| Package | Positioning |
|---|---|
| **3 kartice** | for a small salon or shop |
| **5 kartica** | **`NAJPOPULARNIJE`** badge — most businesses need several spots |
| **10 kartica** | for restaurants and cafés — one per table |

Each card shows: quantity, **total price**, **price per card** (which falls with volume — this is the whole reason packages exist), one line describing who it fits, and a select button. Selecting one visibly highlights it and **updates the order summary live**.

Prices are placeholders — use `{CENA_3}`, `{CENA_5}`, `{CENA_10}` and `{CENA_PO_KOMADU}` as tokens to be filled in later.

Also offer a **quantity stepper for custom amounts**, and a small upsell line: printing with the client's own logo and business name for an extra fee.

### 10.6 Why it works — benefit cards
Four short cards, benefit first, mechanism second:

- `Bez aplikacije, bez QR koda, bez kucanja`
- `Radi na svakom telefonu`
- `Bez pretplate — platite jednom`
- `Mi je programiramo, vi je samo stavite na pult`

### 10.7 Who it is for
A row of business types with icons: `frizerski salon`, `restoran`, `kafić`, `brza hrana`, `zanatlija`, `teretana`, `auto-perionica`, `zubar`. The visitor must find themselves here in under a second.

### 10.8 Social proof
Testimonials with name, business type and city; a small before/after review-count visual. **Use clearly marked placeholder content** — do not invent fake named customers or fake numbers presented as real.

### 10.9 FAQ — objection handling (accordion)
Must answer at minimum:

- `Da li radi na svakom telefonu?` — iPhone 7 and newer read it with no app; on Android, NFC must be switched on in settings
- `Gde tačno mušterija prislanja telefon?` — the **top** of the phone, not the middle or the back; that is why the card has an arrow
- `Šta ako mušterija nema Google nalog?` — most people are already signed in to Google on their phone
- `Da li plaćam nešto mesečno?` — no, one-time purchase
- `Koliko brzo stiže?` — ships by post, from stock
- `Šta ako se pokvari?` — no battery, nothing to break; replacement policy
- `Može li neko da promeni link na kartici?` — no, the chip is locked after programming
- `Da li mi treba Google profil?` — yes; add a short line about how to create one if they do not have it

### 10.10 Order form
The conversion point. Keep it on the same page — no separate checkout step.

Fields:

- Selected package and quantity (pre-filled from the selector, editable)
- `Ime i prezime`
- `Naziv firme`
- `Telefon`
- `Adresa za dostavu`, `Grad`, `Poštanski broj`
- **`Link vaše Google stranice`** — *critical*: this is what we need to program the card. Add a helper: `Ne znate link? Upišite naziv firme i grad, mi ćemo pronaći.` and make the field satisfiable either way.
- `Način plaćanja`: **`Pouzećem (plaćate poštaru)`** as the **default and first option** — this is how Serbia buys online and it removes almost all purchase friction. Bank transfer as the second option.
- `Napomena` (optional)

Also: a live order summary with the total including shipping, inline validation with Serbian error messages, a visible **`Poruči`** button, and a clear success state explaining what happens next (we program the card with your Google link and ship it).

### 10.11 Guarantee and final CTA
Short reassurance — what happens if it does not work, and how to reach a human (phone / WhatsApp / Viber / Instagram) — then one last CTA.

### 10.12 Footer
Contact, Instagram link, business details, terms and privacy links (placeholders).

---

## 11. Interactive requirements

- Package selection updates the summary and total **live**
- Quantity stepper recalculates per-unit price and total
- Smooth scroll from every CTA to the order form
- Sticky bottom CTA bar on mobile showing the selected package and price
- Accordion FAQ
- The tap demo animation in "How it works"
- Full inline form validation before submit
- Success state after submit — do not navigate away
- Subtle scroll-reveal animations; nothing that delays reading

---

## 12. Technical requirements

- **Mobile-first.** Design at 375px, then scale up.
- Fully responsive, no horizontal scrolling at any width
- Accessible: semantic HTML, labelled form fields, visible focus states, AA contrast, tap targets ≥ 44px
- Fast: no heavy libraries, no layout shift, images sized and lazy-loaded
- Self-contained and runnable — inline the CSS and JS, no external dependencies
- Clean, readable, commented code — **this page will be handed off and coded into a real site afterwards**, so structure matters as much as looks

---

## 13. Do not

- Do not use Google's logo, wordmark, or brand colours in a way that implies endorsement
- Do not invent fake testimonials, fake customer names, or fake statistics presented as real
- Do not use English anywhere in the visible copy
- Do not add a subscription, a tiered pricing table, or a login
- Do not build a multi-product catalogue
- Do not use stock-photo clichés (handshakes, generic smiling call-centre people)
- Do not bury the price — it must be visible without hunting

---

## 14. Deliverable

One complete, working, self-contained landing page, plus:

1. The **2–3 colour palettes** from section 8, shown applied to the hero so they can actually be compared
2. A short list of every placeholder token used (`{CENA_3}`, testimonials, contact details) so they can be filled in
