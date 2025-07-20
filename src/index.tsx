import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { verifyIapJwt } from './services/jwt.service.js';
import { Layout } from './ux-domain/Layout.js';
import { FileBasedKnowledgeRepository } from './repositories/file-based-knowledge.repository.js';
import { Knowledge } from './core-domain/knowledge.model.js';

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

app.get('/knowledge', async (c) => {
  try {
    const knowledgeList = await FileBasedKnowledgeRepository.getAll();
    return c.json(knowledgeList);
  } catch (error) {
    return c.json({ error: 'Failed to get knowledge list' }, 500);
  }
});

app.get('/knowledge/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const knowledge = await FileBasedKnowledgeRepository.getById(id);
    return c.json(knowledge);
  } catch (error) {
    return c.json({ error: 'Knowledge not found' }, 404);
  }
});

app.post('/knowledge', async (c) => {
  try {
    const body = await c.req.json();
    const knowledge = Knowledge.create(body.content, body.authorId);
    await FileBasedKnowledgeRepository.upsert(knowledge);
    return c.json(knowledge, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create knowledge' }, 400);
  }
});

app.put('/knowledge/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existing = await FileBasedKnowledgeRepository.getById(id);
    const updated = Knowledge.update(existing, body.content);
    await FileBasedKnowledgeRepository.upsert(updated);
    return c.json(updated);
  } catch (error) {
    return c.json({ error: 'Failed to update knowledge' }, 400);
  }
});

app.delete('/knowledge/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await FileBasedKnowledgeRepository.deleteById(id);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete knowledge' }, 400);
  }
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
