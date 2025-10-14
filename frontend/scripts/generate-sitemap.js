const fs = require('fs');
const path = require('path');

// URLs principais do site
const urls = [
  {
    url: '/',
    changefreq: 'daily',
    priority: 1.0
  },
  {
    url: '/marketplace',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/fretes',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/sobre',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: '/contato',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: '/planos',
    changefreq: 'weekly',
    priority: 0.8
  }
];

// Gerar XML do sitemap
const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(page => `
    <url>
      <loc>https://agroisync.com${page.url}</loc>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
  `).join('')}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap gerado com sucesso!');
};

generateSitemap();