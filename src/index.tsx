import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { verifyIapJwt } from './services/jwt.service.js';
import { Layout } from './ux-domain/Layout.js';

const app = new Hono();
// biome-ignore lint/complexity/useLiteralKeys: tsc の挙動と一貫性を保つため
const isDebug = process.env['NODE_ENV'] === 'development';
// biome-ignore lint/complexity/useLiteralKeys: tsc の挙動と一貫性を保つため
const iapAudience = process.env['IAP_AUDIENCE'];
// biome-ignore lint/complexity/useLiteralKeys: tsc の挙動と一貫性を保つため
const port = parseInt(process.env['PORT'] ?? '8080');

app.use('/index.css', serveStatic({ path: 'target/index.css' }));
app.use(trimTrailingSlash());
app.use('*', async (ctx, next) => {
  const iapJwt = ctx.req.header('X-Goog-IAP-JWT-Assertion');
  const isVerified = await verifyIapJwt(iapJwt!, iapAudience!);

  if (!isVerified && !isDebug) {
    throw new HTTPException(401, { message: 'IAP-JWT is Unauthorized :(' });
  }

  await next();
});

app.get('/', (ctx) => {
  return ctx.html(<Layout />);
});

const server = serve({
  fetch: app.fetch,
  port,
});

function handleShutdown() {
  server.close(() => process.exit(0));

  setTimeout(() => {
    console.error('The process did not exit gracefully after 1,000 milli-seconds. Exiting forcefully X(');
    process.exit(1);
  }, 1000);
}

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);
