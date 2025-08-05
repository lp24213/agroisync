if (!self.define) {
  let t,
    e = {};
  const a = (a, s) => (
    (a = new URL(a + '.js', s).href),
    e[a] ||
      new Promise(e => {
        if ('document' in self) {
          const t = document.createElement('script');
          ((t.src = a), (t.onload = e), document.head.appendChild(t));
        } else ((t = a), importScripts(a), e());
      }).then(() => {
        let t = e[a];
        if (!t) throw new Error(`Module ${a} didn’t register its module`);
        return t;
      })
  );
  self.define = (s, c) => {
    const o = t || ('document' in self ? document.currentScript.src : '') || location.href;
    if (e[o]) return;
    let r = {};
    const i = t => a(t, o),
      n = { module: { uri: o }, exports: r, require: i };
    e[o] = Promise.all(s.map(t => n[t] || i(t))).then(t => (c(...t), r));
  };
}
define(['./workbox-a4119755'], function (t) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    t.clientsClaim(),
    t.precacheAndRoute(
      [
        { url: '/manifest.json', revision: '319254e42c1c16af2717b2b32ea204af' },
        { url: '/robots.txt', revision: '5d93ddffbf9c1f41d8b3f409b9dcd8ec' },
        { url: '/sitemap.xml', revision: '57a8f57e302eb6127e825182c02ad5b6' },
        {
          url: 'https://agrotm.com/_next/app-build-manifest.json',
          revision: '18ff8044fee18e198dd34ebf1943c17b',
        },
        {
          url: 'https://agrotm.com/_next/static/agrotm-1753927779529/_buildManifest.js',
          revision: 'a873315f06bb96c562fee01b95165bca',
        },
        {
          url: 'https://agrotm.com/_next/static/agrotm-1753927779529/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/66.5d42bb1df5abac44.js',
          revision: '5d42bb1df5abac44',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/app/_not-found/page-42d07605d59bed68.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/app/dashboard/page-06e8e11771b11f82.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/app/demo/metamask-purchase/page-ed76829e5b10a6b9.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/app/farm/page-d4939ef03bce8178.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/app/governance/page-a72ed2c69fe295dc.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/app/layout-0baa7a8bc19878c1.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/app/marketplace/buy/page-a1d488f555fce3c2.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/app/nft-marketplace/page-6c92d8d6241bef91.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/app/page-744f1b1ae3ce263b.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/app/staking/page-6b91d0988b59bd1a.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/app/swap/page-b921ef2722a2f81b.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/common-c467e496dfbc24fb.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/main-25f143cf06d3e16a.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/main-app-4a580de7704f96a3.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/pages/_app-0c51b9ac73ae9888.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/pages/_error-59c810d3cc9f7ca8.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: 'https://agrotm.com/_next/static/chunks/webpack-7d9dd084fb83874f.js',
          revision: 'agrotm-1753927779529',
        },
        {
          url: 'https://agrotm.com/_next/static/css/f873a58c0ae1e3d5.css',
          revision: 'f873a58c0ae1e3d5',
        },
        {
          url: 'https://agrotm.com/_next/static/media/26a46d62cd723877-s.woff2',
          revision: 'befd9c0fdfa3d8a645d5f95717ed6420',
        },
        {
          url: 'https://agrotm.com/_next/static/media/55c55f0601d81cf3-s.woff2',
          revision: '43828e14271c77b87e3ed582dbff9f74',
        },
        {
          url: 'https://agrotm.com/_next/static/media/581909926a08bbc8-s.woff2',
          revision: 'f0b86e7c24f455280b8df606b89af891',
        },
        {
          url: 'https://agrotm.com/_next/static/media/7cba1811e3c25a15-s.p.woff2',
          revision: '294acfe5ae5fedf82364d309dd284fc4',
        },
        {
          url: 'https://agrotm.com/_next/static/media/8e9860b6e62d6359-s.woff2',
          revision: '01ba6c2a184b8cba08b0d57167664d75',
        },
        {
          url: 'https://agrotm.com/_next/static/media/97e0cb1ae144a2a9-s.woff2',
          revision: 'e360c61c5bd8d90639fd4503c829c2dc',
        },
        {
          url: 'https://agrotm.com/_next/static/media/9a4ee768fed045da-s.p.woff2',
          revision: '51eee31e9cbbffe82e6d01f1c5f876a1',
        },
        {
          url: 'https://agrotm.com/_next/static/media/b7387a63dd068245-s.woff2',
          revision: 'dea099b7d5a5ea45bd4367f8aeff62ab',
        },
        {
          url: 'https://agrotm.com/_next/static/media/df0a9ae256c0569c-s.woff2',
          revision: 'd54db44de5ccb18886ece2fda72bdfe0',
        },
        {
          url: 'https://agrotm.com/_next/static/media/e1aab0933260df4d-s.woff2',
          revision: '207f8e9f3761dbd724063a177d906a99',
        },
        {
          url: 'https://agrotm.com/_next/static/media/e4af272ccee01ff0-s.p.woff2',
          revision: '65850a373e258f1c897a2b3d75eb74de',
        },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    t.cleanupOutdatedCaches(),
    t.registerRoute(
      '/',
      new t.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: t, response: e, event: a, state: s }) =>
              e && 'opaqueredirect' === e.type
                ? new Response(e.body, { status: 200, statusText: 'OK', headers: e.headers })
                : e,
          },
        ],
      }),
      'GET',
    ),
    t.registerRoute(
      /^https:\/\/api\.agrotm\.com\/.*$/,
      new t.NetworkFirst({
        cacheName: 'api-cache',
        plugins: [
          new t.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 86400 }),
          new t.CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
      }),
      'GET',
    ),
    t.registerRoute(
      /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      new t.CacheFirst({
        cacheName: 'images-cache',
        plugins: [new t.ExpirationPlugin({ maxEntries: 1e3, maxAgeSeconds: 2592e3 })],
      }),
      'GET',
    ),
    t.registerRoute(
      /\.(?:woff|woff2|eot|ttf|otf)$/,
      new t.CacheFirst({
        cacheName: 'fonts-cache',
        plugins: [new t.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 31536e3 })],
      }),
      'GET',
    ));
});
