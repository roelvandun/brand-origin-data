# Contributing to Brand Origin Data

Thank you for helping keep this dataset accurate. This repository is the community-maintained source of truth for brand → HQ country data, consumed by the [Brand Origin Chrome extension](https://github.com/roelvandun/brand-origin-chrome-extension).

---

## How to add a brand

1. **Fork** this repository
2. **Edit `brands.json`** — insert your entry in **alphabetical position** (case-insensitive, by `brand` name)
3. **Open a pull request** — describe what you're adding and why

CI will automatically validate your PR. If validation fails, check the error output and fix accordingly.

---

## How to correct an existing entry

Same flow: fork → edit `brands.json` → PR. In your PR description, explain:
- What is wrong with the current entry
- What the correct value should be
- A source link supporting the correction

---

## Data format

Each entry in `brands.json` is an object with these fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `brand` | string | yes | Brand name **exactly as it appears on Zalando**. Case-sensitive. |
| `hq_country` | string | yes | ISO 3166-1 alpha-2 country code (e.g. `"DE"`, `"US"`). Uppercase. |
| `hq_country_name` | string | yes | English country name (e.g. `"Germany"`). |
| `eu_member` | boolean | yes | `true` if the HQ country is an EU member state. |
| `source` | string | optional | URL to a credible source (Wikipedia, company website, annual report). |
| `notes` | string | optional | Free-text notes for caveats (e.g. `"Parent company headquartered in FR"`). |

Example entry:

```json
{
  "brand": "adidas",
  "hq_country": "DE",
  "hq_country_name": "Germany",
  "eu_member": true,
  "source": "https://en.wikipedia.org/wiki/Adidas",
  "notes": ""
}
```

---

## Rules enforced by CI

Your PR will fail if any of the following are violated:

- **Schema**: every required field must be present and of the correct type
- **Unique brands**: no two entries may have the same `brand` value (case-insensitive)
- **Sort order**: entries must be in alphabetical order by `brand` (case-insensitive)
- **Whitespace**: `brand` must not have leading or trailing whitespace
- **EU consistency**: `eu_member` must match whether `hq_country` is an EU member state

---

## Source requirement

Every new entry should include a `source` URL pointing to a credible, publicly accessible page confirming the HQ country (Wikipedia article, company website "About" page, annual report, etc.).

PRs without a source may be asked to add one before merging.

---

## Brand name matching

Use the brand name **exactly as it appears on Zalando**. This is critical — the extension matches by exact string (case-insensitive).

- If the brand page URL on zalando.nl is `zalando.nl/tommy-hilfiger/`, the Zalando display name is `Tommy Hilfiger`.
- If unsure, visit the brand's page on zalando.nl and copy the name from the page heading.

---

## Disputed or ambiguous entries

If the HQ country of a brand is genuinely ambiguous (e.g. the brand has multiple holding companies in different countries), **open an issue** to discuss it before submitting a PR. Include your reasoning and sources.

---

## HQ country definition

We use the **operational headquarters** of the brand — the country where executive management is based and where the brand is primarily directed. This is not necessarily:
- The country of legal incorporation
- The country of the parent/holding company
- The country of manufacture

When in doubt, use the HQ country as listed on the brand's own website or Wikipedia.
