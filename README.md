# Brand Origin Data

Community-maintained dataset mapping fashion brands to their HQ country. Used by the [Brand Origin Chrome extension](https://github.com/roelvandun/brand-origin-chrome-extension) to show EU-origin badges on Zalando.nl.

---

## Data format

`brands.json` is a flat JSON array, sorted alphabetically by brand name. Each entry:

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

| Field | Type | Required | Description |
|---|---|---|---|
| `brand` | string | yes | Exact brand name as shown on Zalando |
| `hq_country` | string | yes | ISO 3166-1 alpha-2 code (e.g. `"DE"`) |
| `hq_country_name` | string | yes | English country name |
| `eu_member` | boolean | yes | `true` if HQ is in an EU member state |
| `source` | string | optional | URL to a credible source |
| `notes` | string | optional | Caveats or clarifications |

---

## Using this data

The dataset is served via jsDelivr CDN:

```
https://cdn.jsdelivr.net/gh/roelvandun/brand-origin-data@main/brands.json
```

No API key, no authentication, no rate limits.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide. The short version:

1. Fork this repo
2. Edit `brands.json` — add your entry in alphabetical order
3. Open a pull request

CI validates every PR automatically — schema, sort order, uniqueness, and EU membership consistency.

---

## Validation

Run the validator locally:

```bash
npm install
node scripts/validate.js
```

---

## License

Data is released under [CC0 1.0 Universal](./LICENSE) (public domain dedication). You are free to use, copy, modify, and distribute it without restriction.
