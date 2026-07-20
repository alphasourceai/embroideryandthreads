# Embroidery & Threads Operator Runbook

## Production services

- Website: `https://embroideryandthreads.com`
- Site editor: `https://embroideryandthreads.com/admin/`
- Source: GitHub repository `alphasourceai/embroideryandthreads`, branch `main`
- Hosting and forms: Netlify project `embroideryandthreads`
- DNS, registrar, and analytics: Cloudflare
- Search: Google Search Console and Bing Webmaster Tools

## Normal publishing flow

1. A client image update in Decap creates a commit on `main` through Netlify Git Gateway.
2. GitHub Quality runs content validation, type checking, a production build, metadata checks, browser accessibility checks, and a dependency audit.
3. Netlify independently builds from the monorepo root using `netlify.toml`. The build lifecycle repeats the content and artifact checks before publishing `artifacts/embroidery-site/dist/public`.
4. Check both the GitHub workflow and Netlify deploy log, then verify the custom domain.

For code changes, run this from the repository root before pushing:

```sh
pnpm install --frozen-lockfile
pnpm --filter @workspace/embroidery-site qa
pnpm --filter @workspace/embroidery-site exec playwright install chromium
pnpm --filter @workspace/embroidery-site test:e2e
node artifacts/embroidery-site/scripts/check-production.mjs https://embroideryandthreads.com
pnpm audit --audit-level=high
```

## Monitoring

- GitHub **Production Monitor** checks the home, reviews, privacy, admin, and 404 responses every six hours.
- It also checks DNS, HTTPS certificate lifetime, the `www` redirect, security headers, canonical metadata, and the Netlify form shell.
- GitHub **Monthly Form Delivery Check** opens one issue on the first day of each month. Close it after submitting a real test and confirming both Netlify capture and email delivery.
- Cloudflare Web Analytics provides aggregate page-view and performance data without identifying individual visitors.
- Google and Bing can take several days to begin showing search data after initial verification.

## Failed deployment

1. Open the failed Netlify deploy and read the first failing build command.
2. If an editor upload failed validation, correct the image or description in `/admin/` and publish again.
3. If a code change failed, fix it on a new commit. Do not force-push or rewrite published history.
4. For an urgent rollback, use Netlify **Deploys**, select the last known-good production deploy, and publish it. Then repair `main` so the next automatic build does not reintroduce the problem.

## Form incident

1. Check Netlify **Forms > contact** to determine whether the submission was captured.
2. If captured, verify the form notification destination and spam filters.
3. If not captured, run the production monitor and inspect the latest Netlify build for the hidden static contact form.
4. Do not submit repeated automated tests; one named test inquiry is enough.

## Domain or HTTPS incident

1. Confirm Cloudflare still has the Netlify DNS records and the Google verification TXT record.
2. Confirm Netlify still lists `embroideryandthreads.com` as the primary domain and the certificate is active.
3. Keep the Cloudflare records in the proxy mode Netlify currently validates; do not change nameservers or DNS targets during routine maintenance.
4. Run `node artifacts/embroidery-site/scripts/check-production.mjs` after any DNS change.

## Account security

- Keep client registration invite-only.
- Require unique passwords and two-factor authentication for Netlify, GitHub, Cloudflare, Google, and Bing accounts.
- Store recovery codes in the business password manager.
- Remove former collaborators promptly from every service, not only from the editor.
