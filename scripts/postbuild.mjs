import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';

// Use this deployment's domain for social sharing without relying on Sites.
const deploymentHost = process.env.VERCEL_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
if (deploymentHost) {
  const imageUrl = new URL('/assets/photos/hero-summer-1200.webp', `https://${deploymentHost}`).href;
  const html = await readFile('dist/index.html', 'utf8');
  await writeFile('dist/index.html', html.replace(
    'property="og:image" content="/assets/photos/hero-summer-1200.webp"',
    `property="og:image" content="${imageUrl}"`,
  ));
}

const routes = ['suite', 'suite/suite-bosco', 'suite/suite-dolomiti', 'suite/suite-panorama', 'spa', 'health-club', 'ristoranti', 'wine-library', 'cigar-library', 'esperienze', 'galleria', 'contatti'];
for (const route of routes) {
  await mkdir(`dist/${route}`, { recursive: true });
  await copyFile('dist/index.html', `dist/${route}/index.html`);
}
await copyFile('dist/index.html', 'dist/404.html');
await writeFile('dist/robots.txt', 'User-agent: *\nDisallow: /\n');
console.log(`Prepared ${routes.length} directly accessible routes and 404 fallback.`);
