# Linde Corrotech: brand files

| Folder / file | What's inside |
|---|---|
| `1 Logo/` | Final logo: SVG + PNG in every version (English, Arabic, bilingual; colour, black, white, reversed), website and app icons, `guidelines.png` (how to use the logo), `mockups.png`. Start with `1 Logo/README.md`. |
| `2 Stationery/` | Letterhead (Word + PDF), business cards, envelope, company stamp, email signature, social banner. Start with `2 Stationery/README.md`. |
| `Linde-Corrotech-Brand-Package.zip` | **Everything for the client in one file:** `1 Logo` + `2 Stationery` + this README. |
| `Linde-Corrotech-logo-kit.zip` | The `1 Logo` folder zipped, ready to send to a printer, sign maker or web developer. |
| `Linde-Corrotech-stationery.zip` | The `2 Stationery` folder zipped. |
| `_Working files/` | Not needed day to day. `generator/` holds the scripts and page sources that produce the final files (used to update phone numbers, names, etc.); `old concepts/` holds every earlier logo round for reference. |

Final logo: **Global Route**, Route Black `#111418` + Sky Blue `#1E9BFF`, on white.

## Website

`website/` is the site (static HTML, no framework). English is `website/index.html`; Arabic text sits next to each English string in `data-ar` attributes.
After any text change run `node tools/build.mjs`: it rebuilds `website/ar/index.html`, the structured data, `sitemap.xml`, `robots.txt` and `llms.txt`.
Upload the whole `website/` folder to the host for www.lindecorrotechksa.com.
