# GitHub Pages release checklist

## Verified target

- Repository: `egemenozen1/egemenozen1.github.io`
- Default branch: `main`
- Existing site: `https://egemenozen1.github.io/`
- Current Pages publishing source: `main` branch, repository root (`/`); no custom domain is configured and HTTPS is enforced.
- Existing main commit `3eca72aa716905e0eaef2f9972be5fc9a810d687` is preserved on remote branch `backup/pre-astro-portfolio-2026-10-27` and under `legacy-site-backup/` on the migration branch.

## Legal review and release gate

The owner has confirmed this is an individual portfolio for job applications, with no company and no sale of products or services. The owner has supplied a postal address for the Impressum; it is kept off the homepage.

- **DDG § 5(1):** it applies to digital services offered on a business basis and usually for remuneration. On the supplied facts, there is no clear indication of remuneration, so this provision may not apply. If it does apply, it requires the provider's name and establishment address and contact information including email. Legal-entity form/representative, regulator, register, professional-chamber and VAT/business identifiers are conditional fields and do not apply based on the owner's information (DDG § 5(1) nos. 1–7).
- **MStV § 18(1):** separately requires the name and address of providers of telemedia that do not serve exclusively personal or family purposes. It does not state a remuneration condition. Because this portfolio is expressly intended for professional job applications and presents public case studies, the personal/family exception does not clearly fit. The wording therefore strongly indicates a public name-and-address requirement even if DDG § 5 does not apply. This is an interpretation of the stated purpose, not a binding legal determination.
- **MStV § 18(2):** adds a responsible editor's name and address for journalistic-editorial services within that paragraph. The current site is a portfolio of project case studies and does not appear to be a periodical/news publication; whether its content crosses that threshold is not definitively determined here. Paragraph (2) is not being treated as the basis for the present address block; paragraph (1) is.

Neither § 18(1) nor § 5(1) creates a general privacy exception or an automatic substitute such as a PO box. The owner has now supplied an address and it is published only on the Impressum page. Company, registry and VAT information is not added because the owner confirmed there is no company and no such identifier.

Official texts: [DDG § 5](https://www.gesetze-im-internet.de/ddg/__5.html), [MStV § 18](https://www.gesetze-bayern.de/Content/Document/MStV-18?view=Print), [GDPR Article 13](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679).

`npm run check:release` requires:

- `src/pages/impressum.astro`
- `src/pages/privacy.astro`
- `release-approval.json` with `contentReviewed`, `legalReviewed` and `liveLinksVerified` explicitly reviewed as `true`.

The Impressum and privacy notice are present. The release approval file is created only after content, official-source and live-link review is complete; its `legalReviewed` flag means the stated facts and disclosures were checked against official statutory text, not that a lawyer provided an opinion.

## Release verification

- The owner has confirmed individual operation, no company, no products/services for sale, and `egemen.oezen@gmail.com` as public contact. Company and business identifiers are inapplicable on the supplied facts.
- The owner-provided address appears in the Impressum only, not on the homepage. This statutory-source review is not a formal legal opinion.
- Review the privacy notice facts: GitHub Pages hosting and visitor-IP logging, email contact, no analytics/cookies/forms/embeds in source, no specific GitHub log-retention period stated in GitHub Pages docs, and whether the notice accurately reflects the owner's handling of email correspondence.
- Complete content, statutory-source and live-link review before setting the release approval flags.

## Safe publication sequence

1. Preserve the old `main` site on `backup/pre-astro-portfolio-2026-10-27`.
2. Run source, production build, preview, dist, browser, content, statutory-source and live-link checks.
3. Set release approvals only after those checks are actually complete.
4. Change GitHub Pages source from `main`/root to **GitHub Actions** before merging or pushing the release to `main`, so a Pages branch publish cannot bypass the release gate.
5. Merge/push the approved commit to `main`; check the Actions deployment, deployed commit, and the existing HTTPS address.
