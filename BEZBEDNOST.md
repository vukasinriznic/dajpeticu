# Bezbednost i devops — šta je urađeno i šta ostaje

## Već u kodu (19.09.2026.)

- **API `/api/porudzbine`:** samo zahtevi sa našeg sajta (provera `Origin` / `Sec-Fetch-Site`),
  samo `application/json`, telo do 20 KB, najviše 10 stavki, ograničene dužine svih polja,
  Place ID samo u obliku pravog ID-a, e-mail bez više primalaca, honeypot, cena uvek na serveru.
- **Ograničenje učestalosti:** 30 zahteva / 10 min i 5 važećih porudžbina / 10 min po IP adresi
  (u memoriji instance — hvata skripte, ali NIJE distribuirana zaštita, vidi ispod).
- **Mejlovi:** sav korisnički tekst prolazi kroz `esc()` (`src/lib/html.ts`) — nema ubacivanja
  HTML-a u mejl vlasniku ni kupcu.
- **Zaglavlja** (`next.config.ts`): CSP podskup (`frame-ancestors 'none'`, `base-uri`, `form-action`,
  `object-src`), `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS,
  bez `X-Powered-By`.
- **Tajne:** `.env*` i folder sa lozinkom baze su u `.gitignore` i nikad nisu bili u git istoriji.
  Supabase klijent (service role) je `server-only`.
- **CI** (`.github/workflows/ci.yml`): tipovi + `npm audit` (high) + build na svakom pushu/PR-u.
  **Dependabot** nedeljno predlaže ažuriranja.

## Ručno (nalozi, ne mogu iz koda)

**Vercel**
1. *Firewall → Rate limiting*: pravilo za putanju `/api/porudzbine`, npr. 5 zahteva / 10 min
   po IP (ovo je prava zaštita; ona u kodu je samo dodatni sloj).
2. *Settings → Deployment Protection*: uključi zaštitu za Preview deployment-e (da se
   probne verzije ne indeksiraju i ne primaju porudžbine).
3. *Environment Variables*: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` samo
   za Production (i po potrebi Preview sa drugim/test ključevima). Nikad `NEXT_PUBLIC_` za tajne.
4. Uključi obaveštenja o neuspelim deploy-ima i proveri *Logs* posle prve prave porudžbine.

**GitHub**
1. Uključi 2FA na nalogu.
2. *Settings → Code security*: Secret scanning + Push protection, Dependabot alerts.
3. *Settings → Branches*: zaštita `main` (traži da CI prođe pre merge-a; za rad direktno na
   `main` bar isključi force-push i brisanje grane).
4. Proveri da je repo **privatan** ako ne treba da bude javan.

**Supabase**
1. Besplatni projekat se **pauzira posle ~7 dana bez aktivnosti** — porudžbine bi tad padale.
   Ili pređi na plaćeni plan, ili podesi povremeni "ping" (npr. Vercel Cron na laganu rutu).
2. Besplatan plan **nema automatske rezervne kopije koje se mogu vratiti** — povremeno
   izvezi tabelu `porudzbine` (CSV) ili pređi na plan sa backup-om pre pravog saobraćaja.
3. Proveri da je RLS uključen na `porudzbine` (bez policy-ja) i da je service-role ključ
   samo na Vercel-u, nikad u klijentskom kodu.

**Resend / domen (kad domen bude spreman)**
1. Verifikuj domen (SPF, DKIM) i dodaj **DMARC** zapis (`v=DMARC1; p=none; rua=mailto:...`).
2. Zameni pošiljaoca `onboarding@resend.dev` u `src/lib/resend.ts` — dok se to ne uradi,
   potvrde kupcima stižu SAMO na adresu vlasnika Resend naloga.
3. Google Maps ključ (kad se uključi): ograniči na HTTP referrer (tvoj domen) i samo Places API.

## Preporučeno kasnije

- **Cloudflare Turnstile** (besplatan CAPTCHA) na formi za plaćanje — najbolja zaštita od
  botova i zloupotrebe potvrdnog mejla ("mail bombing" tuđe adrese). Traži site/secret ključ.
- Praćenje grešaka (npr. Sentry) i uptime provera na `/`.
- Pun CSP sa `script-src` (nonce) kad se dodaju Google Maps / Analytics.
