/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://agroisync.com',
  generateRobotsTxt: true,
  outDir: 'public',
};
