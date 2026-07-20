# Embroidery & Threads Quality Baseline

Measured on July 20, 2026 against `https://embroideryandthreads.com` after
Netlify published commit `5feaf9d`.

## Lighthouse

| Profile | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 79 | 100 | 100 | 100 | 3.3 s | 3.9 s | 0 ms | 0 |
| Desktop | 99 | 100 | 100 | 100 | 0.6 s | 0.9 s | 0 ms | 0.003 |

Lighthouse performance scores are lab estimates and vary between runs. The
mobile result is primarily constrained by render-blocking site and web-font
CSS under simulated slow-network conditions. There is no measured main-thread
blocking and no meaningful layout shift.

## Automated checks

- Playwright: 13 passed, 1 intentionally skipped desktop-only duplicate.
- Axe: no critical or serious WCAG 2/2.1 A or AA violations on home, reviews, privacy, or 404 pages.
- TypeScript: full monorepo typecheck passed.
- Production build: content, metadata, form, analytics, required-file, and asset-budget validation passed.
- Dependency audit: no known vulnerabilities.
- Live production monitor: routes, 404 status, canonical metadata, form shell, analytics beacon, security headers, DNS, TLS, and `www` redirect passed.

## Current asset budgets

- JavaScript: 275.26 KB raw, 86.20 KB gzip.
- CSS: 103.31 KB raw, 18.54 KB gzip.
- Enforced limits: 350 KB JavaScript and 130 KB CSS per generated asset.
