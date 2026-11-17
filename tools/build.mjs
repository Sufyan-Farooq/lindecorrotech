// Linde Corrotech: static build. No dependencies; run with `node tools/build.mjs`.
// Source of truth is website/index.html (English, with Arabic in data-ar attributes).
// Writes: website/ar/index.html, JSON-LD in both pages, sitemap.xml, robots.txt, llms.txt.
//
// Preview copy (client review, kept out of search engines):
//   node tools/build.mjs --preview <out dir> <public base url>
// copies the built site to <out dir>, marks every page noindex, and points share images at <public base url>.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WEB = join(ROOT, 'website');
const SITE = 'https://www.lindecorrotechksa.com';
const today = new Date().toISOString().slice(0, 10);
const faq = JSON.parse(readFileSync(join(ROOT, 'tools', 'faq.json'), 'utf8'));

const META = {
  en: {
    url: SITE + '/',
    title: 'Container &amp; Flatbed Transport in Jeddah | Linde Corrotech',
    desc: 'Container transport (20 ft, 40 ft) and flatbed trucks from Jeddah Islamic Port to all 13 regions of Saudi Arabia. TGA-licensed carrier. Quote on WhatsApp.',
    ogDesc: '20 ft and 40 ft container transport and flatbed trucks from Jeddah Islamic Port to all 13 regions of Saudi Arabia. Licensed by the Transport General Authority.',
    locale: 'en_US', altLocale: 'ar_SA',
  },
  ar: {
    url: SITE + '/ar/',
    title: 'نقل الحاويات والسطحات في جدة | ليندي كوروتيك',
    desc: 'ناقل مرخّص للبضائع الثقيلة في جدة. نقل حاويات ٢٠ و٤٠ قدمًا وشاحنات سطحة من ميناء جدة الإسلامي إلى جميع مناطق المملكة الثلاث عشرة. اطلب عرض السعر عبر واتساب.',
    ogDesc: 'نقل حاويات ٢٠ و٤٠ قدمًا وشاحنات سطحة من ميناء جدة الإسلامي إلى جميع مناطق المملكة الثلاث عشرة. مرخّص من الهيئة العامة للنقل.',
    locale: 'ar_SA', altLocale: 'en_US',
  },
};

const REGIONS = {
  en: ['Makkah', 'Riyadh', 'Madinah', 'Eastern Province', 'Qassim', 'Asir', 'Tabuk', 'Hail', 'Northern Borders', 'Jazan', 'Najran', 'Al Bahah', 'Al Jawf'],
  ar: ['مكة المكرمة', 'الرياض', 'المدينة المنورة', 'المنطقة الشرقية', 'القصيم', 'عسير', 'تبوك', 'حائل', 'الحدود الشمالية', 'جازان', 'نجران', 'الباحة', 'الجوف'],
};

function jsonLd(lang) {
  const ar = lang === 'ar', m = META[lang];
  const org = SITE + '/#business';
  const service = (id, nameEn, nameAr, descEn, descAr) => ({
    '@type': 'Service', '@id': SITE + '/#' + id,
    name: ar ? nameAr : nameEn, serviceType: ar ? nameAr : nameEn,
    description: ar ? descAr : descEn,
    provider: { '@id': org },
    areaServed: { '@type': 'Country', name: ar ? 'المملكة العربية السعودية' : 'Saudi Arabia' },
  });
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'Organization'], '@id': org,
        name: 'Linde Corrotech International Services Co.',
        alternateName: ['شركة ليندي كوروتيك إنترناشونال سيرفيسز', 'Linde Corrotech'],
        description: m.desc,
        url: SITE + '/', logo: SITE + '/icon-512.png', image: SITE + '/og-image.jpg',
        email: 'info@lindecorrotechksa.com',
        telephone: '+966541916494',
        contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', telephone: '+966541916494', availableLanguage: ['en', 'ar'], areaServed: 'SA' }],
        vatID: '314382023100003', taxID: '314382023100003',
        identifier: [
          { '@type': 'PropertyValue', name: 'Commercial Registration', value: '7052479644' },
          { '@type': 'PropertyValue', name: 'Transport General Authority licence', value: '63/00063222' },
        ],
        address: {
          '@type': 'PostalAddress', streetAddress: 'Building 8594, Prince Muteb St., Al Aziziyah',
          addressLocality: 'Jeddah', addressRegion: 'Makkah Province', postalCode: '23342', addressCountry: 'SA',
        },
        areaServed: REGIONS[lang].map((name) => ({ '@type': 'AdministrativeArea', name })),
        knowsLanguage: ['en', 'ar'],
        makesOffer: [{ '@id': SITE + '/#container-transport' }, { '@id': SITE + '/#flatbed-transport' }].map((s) => ({ '@type': 'Offer', itemOffered: s })),
      },
      service('container-transport', 'Container transport from Jeddah', 'نقل الحاويات من جدة',
        '20 ft, 40 ft and 40 ft high cube container transport between Jeddah Islamic Port, dry ports, yards and factories across Saudi Arabia.',
        'نقل حاويات ٢٠ و٤٠ قدمًا و٤٠ قدمًا عالية بين ميناء جدة الإسلامي والموانئ الجافة والساحات والمصانع في المملكة.'),
      service('flatbed-transport', 'Flatbed transport from Jeddah', 'نقل السطحات من جدة',
        'Flatbed transport of steel, coils, machinery and project cargo from Jeddah to building sites, plants and project sites across Saudi Arabia.',
        'نقل الحديد واللفات والمعدات وحمولات المشاريع بالسطحات من جدة إلى مواقع البناء والمصانع والمشاريع في المملكة.'),
      { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE + '/', name: 'Linde Corrotech', inLanguage: ['en', 'ar'], publisher: { '@id': org } },
      {
        '@type': 'WebPage', '@id': m.url + '#webpage', url: m.url, name: m.title.replace('&amp;', '&'),
        description: m.desc, inLanguage: lang, isPartOf: { '@id': SITE + '/#website' }, about: { '@id': org },
        dateModified: today,
      },
      {
        '@type': 'FAQPage', '@id': m.url + '#faq', inLanguage: lang,
        mainEntity: faq.map(([q, qa, a, aa]) => ({ '@type': 'Question', name: ar ? qa : q, acceptedAnswer: { '@type': 'Answer', text: ar ? aa : a } })),
      },
    ],
  };
}

function setLd(html, lang) {
  const block = '<script type="application/ld+json">\n' + JSON.stringify(jsonLd(lang), null, 1) + '\n</script>';
  const re = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;
  if (!re.test(html)) throw new Error('no JSON-LD block found');
  return html.replace(re, block);
}

const esc = (s) => s.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;').replace(/</g, '&lt;');

function toArabic(src) {
  let h = src;
  const expected = (h.match(/\sdata-ar="/g) || []).length;
  let done = 0;
  // text of every element that carries data-ar (all of them hold plain text only)
  h = h.replace(/<([a-z0-9]+)(\s(?:[^>]*?\s)?data-ar="([^"]*)"[^>]*)>([^<]*)<\/\1>/g, (all, tag, attrs, ar, text) => {
    done++;
    return `<${tag}${attrs} data-en="${text.trim().replace(/"/g, '&quot;')}">${ar}</${tag}>`;
  });
  if (done !== expected) throw new Error(`translated ${done} of ${expected} data-ar elements; one holds markup`);
  h = h.replace(/\salt="([^"]*)"([^>]*?)\sdata-ar-alt="([^"]*)"/g, ' alt="$3"$2 data-ar-alt="$3"');
  h = h.replace(/\saria-label="([^"]*)"([^>]*?)\sdata-ar-label="([^"]*)"/g, ' aria-label="$3"$2 data-ar-label="$3"');
  h = h.replace(/\svalue="([^"]*)"([^>]*?)\sdata-ar-value="([^"]*)"/g, ' value="$3"$2 data-ar-value="$3"');

  // document language, direction and head
  const m = META.ar;
  h = h.replace('<html lang="en" dir="ltr">', '<html lang="ar" dir="rtl">');
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${m.title}</title>`);
  h = h.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${m.desc}">`);
  h = h.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${m.url}">`);
  h = h.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${m.title}">`);
  h = h.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${m.ogDesc}">`);
  h = h.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${m.url}">`);
  h = h.replace('<meta property="og:locale" content="en_US">', '<meta property="og:locale" content="ar_SA">');
  h = h.replace('<meta property="og:locale:alternate" content="ar_SA">', '<meta property="og:locale:alternate" content="en_US">');
  h = h.replace(/<a class="lang" href="ar\/" hreflang="ar" lang="ar" data-lang-link>العربية<\/a>/,
    '<a class="lang" href="../" hreflang="en" lang="en" data-lang-link>English</a>');
  h = h.replace('aria-label="Linde Corrotech, home"', 'aria-label="ليندي كوروتيك، الصفحة الرئيسية"');
  h = h.replace('aria-label="Main"', 'aria-label="القائمة الرئيسية"').replace('aria-label="Mobile"', 'aria-label="قائمة الجوال"')
    .replace('aria-label="Footer"', 'aria-label="روابط التذييل"').replace('aria-label="Quick contact"', 'aria-label="تواصل سريع"')
    .replace('aria-label="Menu"', 'aria-label="القائمة"');

  // relative URLs move one folder down
  h = h.replace(/\s(src|href)="(?!#|https?:|mailto:|tel:|\/|data:|\.\.\/)([^"]+)"/g, ' $1="../$2"');
  return setLd(h, 'ar');
}

// English page: refresh its JSON-LD in place
const enPath = join(WEB, 'index.html');
const en = setLd(readFileSync(enPath, 'utf8'), 'en');
writeFileSync(enPath, en);

// Arabic page
mkdirSync(join(WEB, 'ar'), { recursive: true });
writeFileSync(join(WEB, 'ar', 'index.html'), toArabic(en));

// sitemap with hreflang alternates on every URL (self-reference included)
const alt = `    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE}/ar/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`;
writeFileSync(join(WEB, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${today}</lastmod>
${alt}
  </url>
  <url>
    <loc>${SITE}/ar/</loc>
    <lastmod>${today}</lastmod>
${alt}
  </url>
</urlset>
`);

writeFileSync(join(WEB, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);

// llms.txt: a plain summary for AI assistants and answer engines
const plain = (s) => s.replace(/&amp;/g, '&');
writeFileSync(join(WEB, 'llms.txt'), `# Linde Corrotech International Services Co.

> Licensed heavy freight road carrier based in Jeddah, Saudi Arabia. Container transport (20 ft, 40 ft, 40 ft high cube) and flatbed transport from Jeddah Islamic Port to all 13 regions of Saudi Arabia. Domestic only; no cross-border moves.

- Website (English): ${SITE}/
- Website (Arabic): ${SITE}/ar/
- Phone and WhatsApp: +966 54 191 6494 · +966 55 728 0800 · +966 54 549 4234
- Email: info@lindecorrotechksa.com
- Address: Building 8594, Prince Muteb St., Al Aziziyah, Jeddah 23342, Saudi Arabia (short address JCZB8594)
- Transport General Authority licence: 63/00063222 (heavy freight transport of commercial goods), valid until 2029-09-15
- Commercial registration: 7052479644
- VAT number: 314382023100003

## Services

- Container transport: 20 ft, 40 ft and 40 ft high cube containers between Jeddah Islamic Port, dry ports, yards, factories and distribution centres; empty returns to the named yard.
- Flatbed transport: steel, rebar, coils, sections, machinery and project cargo, secured with chains, straps and dunnage, delivered to building sites, plants and project sites.

## Coverage

${REGIONS.en.join(', ')}. Every route runs from Jeddah.

## Questions

${faq.map(([q, , a]) => `### ${q}\n${a}`).join('\n\n')}

## Getting a quote

Send pickup point, destination, cargo, weight and date by phone, WhatsApp or the form at ${SITE}/#quote. Quotations are given in writing.
`);

console.log('built: index.html (JSON-LD), ar/index.html, sitemap.xml, robots.txt, llms.txt');

// ---- preview copy ----
const pi = process.argv.indexOf('--preview');
if (pi > -1) {
  const out = process.argv[pi + 1], base = (process.argv[pi + 2] || '').replace(/\/$/, '');
  if (!out || !base) throw new Error('usage: --preview <out dir> <public base url>');
  rmSync(out, { recursive: true, force: true });
  cpSync(WEB, out, { recursive: true });
  for (const [page, url] of [['index.html', base + '/'], [join('ar', 'index.html'), base + '/ar/']]) {
    const p = join(out, page);
    let h = readFileSync(p, 'utf8');
    h = h.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">');
    h = h.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
    h = h.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${base}/og-image.jpg">`);
    writeFileSync(p, h);
  }
  rmSync(join(out, 'sitemap.xml'), { force: true });
  writeFileSync(join(out, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  writeFileSync(join(out, '.nojekyll'), '');
  console.log(`preview: ${out} (noindex) for ${base}/`);
}
