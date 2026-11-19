# Linde Corrotech: website

`website/` is the site (static HTML, no framework). English is `website/index.html`; Arabic text sits next to each English string in `data-ar` attributes.
After any text change run `node tools/build.mjs`: it rebuilds `website/ar/index.html`, the structured data, `sitemap.xml`, `robots.txt` and `llms.txt`.
Upload the whole `website/` folder to the host for www.lindecorrotechksa.com.

Logo files, letterhead, stationery and brand guidelines live separately in `../Brand/`.
