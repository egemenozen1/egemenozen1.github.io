# GitHub Pages release checklist

## Verified target

- Repository: `egemenozen1/egemenozen1.github.io`
- Default branch: `main`
- Existing site: `https://egemenozen1.github.io/`
- Current Pages publishing source: `main` branch, repository root (`/`); no custom domain is configured and HTTPS is enforced.
- Existing main commit `3eca72aa716905e0eaef2f9972be5fc9a810d687` is preserved on remote branch `backup/pre-astro-portfolio-2026-10-27` and under `legacy-site-backup/` on the migration branch.

## Release gate

`npm run check:release` requires:

- `src/pages/impressum.astro`
- `src/pages/privacy.astro`
- `release-approval.json` with `contentReviewed`, `legalReviewed` and `liveLinksVerified` explicitly reviewed as `true`.

These pages and approvals are intentionally absent until the site owner supplies and reviews accurate information. Do not use blank legal pages or placeholder data.

## Owner information needed

- Confirm whether the portfolio operator is an individual or an entity/business, and the exact legal provider name. If an entity, supply its legal form and representative.
- Provide a publishable service/registered address and confirm the public contact email. The current Astro config uses `egemen.oezen@gmail.com`, which is not confirmed for launch. Provide a direct communication channel as applicable.
- Confirm whether registration numbers, VAT/business identifiers, regulator, or professional-register details apply; provide only the applicable real details.
- Review the privacy notice facts: GitHub Pages hosting and its visitor-IP logging, the public contact route, any analytics/cookies/embeds (the current Astro source contains no analytics, form, or third-party embed), data-controller contact, any appointed privacy contact, and the processing/retention basis to publish.
- Review the resulting legal text and approve site content and live links before setting the release approval flags.

## Safe publication sequence

1. Keep `main` root publishing untouched while user details and legal review are pending; the current live site remains available.
2. Complete the real legal pages and approval file, then run source, build, preview, dist and release checks.
3. Change GitHub Pages source from `main`/root to **GitHub Actions** before merging or pushing the release to `main`, so a Pages branch publish cannot bypass the release gate.
4. Merge/push the approved commit to `main`; check the Actions deployment, deployed commit, and the existing HTTPS address.
