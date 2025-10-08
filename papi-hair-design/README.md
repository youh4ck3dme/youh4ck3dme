# Papi Hair Design PWA

Luxusná Angular PWA aplikácia pre kadernícky salón Papi Hair Design so zameraním na výkon, offline režim a prémiovú UX/UI identitu.

## Obsah
- [Funkcie](#funkcie)
- [Inštalácia](#inštalácia)
- [Vývoj a skripty](#vývoj-a-skripty)
- [Build a nasadenie](#build-a-nasadenie)
- [NGINX konfigurácia](#nginx-konfigurácia)
- [Lighthouse checklist](#lighthouse-checklist)
- [Performance budget](#performance-budget)
- [Budúce API integrácie](#budúce-api-integrácie)
- [Bezpečnostné hlavičky](#bezpečnostné-hlavičky)

## Funkcie
- Standalone Angular 17 s prísnou konfiguráciou TypeScriptu
- PWA s vlastným manifestom, service workerom a offline fallback stránkou
- I18n pre SK/EN s perzistenciou jazyka
- Viackroková rezervácia s offline frontou a synchronizáciou po pripojení
- Štruktúrované dáta (JSON-LD), SEO helper a meta tagy pre každú stránku
- 4D parallax hero sekcia, animácie, glassmorphism komponenty
- Runtime cache stratégie pre obrázky, JSON dáta a shell

## Inštalácia
```bash
npm install
```
> Počas `npm install` sa automaticky spustí skript `npm run generate:assets`, ktorý:
> - z vektorového súboru `src/assets/icons/icon-base.svg` vygeneruje všetky PWA PNG ikony,
> - pomocou `scripts/generate-media.ts` vytvorí všetky hero/galéria/avatary ako WebP obrázky (bez binárnych assetov v gite).
> V prípade potreby môžeš skript spustiť aj manuálne.

### Vygenerovanie nového workspace-u

Ak potrebuješ čistú kópiu projektu (napr. na experimentovanie), môžeš použiť skript `bootstrap.sh`:

```bash
# z koreňa repozitára
./papi-hair-design/bootstrap.sh papi-hair-design-playground

# alebo pre prepis existujúcej zložky
./papi-hair-design/bootstrap.sh --force papi-hair-design
```

Skript vytvorí nové Angular workspace, nanesie Papi Hair Design scaffold a projekt pripraví na spustenie (`npm run start`).

## Vývoj a skripty
```bash
npm run start      # dev server
npm run build      # produkčný build
npm run lint       # ESLint s Prettier pravidlami
npm run test       # Unit testy
npm run generate:icons  # manuálna regenerácia PWA ikon
npm run generate:media  # manuálna regenerácia dynamických WebP assetov
npm run generate:assets # spustí oba skripty naraz
```

## Build a nasadenie
```bash
npm run build
```
Výstup sa uloží do priečinka `dist/papi-hair-design`.

### NGINX konfigurácia
```nginx
server {
    listen 443 ssl;
    server_name papi-hair.example;

    root /var/www/papi-hair-design;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    brotli on;
    brotli_types text/plain text/css application/javascript application/json image/svg+xml;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header Referrer-Policy no-referrer-when-downgrade;
    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self';";

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(?:jpg|jpeg|gif|png|webp|avif|css|js|woff2?)$ {
        expires 30d;
        access_log off;
    }
}
```

## Lighthouse checklist
- PWA score: 100
- Performance: ≥ 95
- Accessibility: ≥ 95
- SEO: 100
- Offline dostupnosť pre domov, služby, stylistov a rezerváciu
- prefer-reduced-motion: parallax sa deaktivuje

## Performance budget
- Initial JS bundle ≤ 220 kB
- Initial CSS ≤ 80 kB
- Largest Contentful Paint < 2.5 s (mobil)
- Total Blocking Time < 200 ms

## Budúce API integrácie
- **Node/Express proxy:** využitie `server.ts` a `ng serve --proxy-config proxy.conf.json`
- **Next.js edge API:** nasadiť API ako serverless endpoint a využívať `fetch` v službách
- Aktivovať CORS s allowlistom domén a rate limitingom

## Bezpečnostné hlavičky
- `Strict-Transport-Security`
- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`

Príklad CSP:
```
Content-Security-Policy: default-src 'self'; img-src 'self' data: https://maps.googleapis.com; script-src 'self'; style-src 'self' 'unsafe-inline';
```
