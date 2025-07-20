import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { Knowledge } from './core-domain/knowledge.model.js';
import { FileBasedKnowledgeRepository } from './repositories/file-based-knowledge.repository.js';
import { verifyIapJwt } from './services/jwt.service.js';
import { KnowledgeDetail } from './ux-domain/KnowledgeDetail.js';
import { KnowledgeEdit } from './ux-domain/KnowledgeEdit.js';
import { KnowledgeList } from './ux-domain/KnowledgeList.js';
import { KnowledgePost } from './ux-domain/KnowledgePost.js';
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

// UI: ナレッジ一覧ページ表示
app.get('/knowledge', async (c) => {
  try {
    const knowledgeList = await FileBasedKnowledgeRepository.getAll();
    return c.html(
      <Layout>
        <KnowledgeList knowledgeList={knowledgeList} />
      </Layout>,
    );
  } catch (_error) {
    return c.html(
      <Layout>
        <KnowledgeList error="ナレッジの取得に失敗しました" />
      </Layout>,
    );
  }
});

app.get('/knowledge/new', (c) => {
  return c.html(<KnowledgePost />);
});

app.get('/knowledge/:id/edit', async (c) => {
  try {
    const id = c.req.param('id');
    const knowledge = await FileBasedKnowledgeRepository.getById(id);
    return c.html(<KnowledgeEdit knowledge={knowledge} />);
  } catch (_error) {
    return c.html(<KnowledgeEdit error="ナレッジが見つかりません" />);
  }
});

app.get('/knowledge/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const knowledge = await FileBasedKnowledgeRepository.getById(id);
    return c.json(knowledge);
  } catch (_error) {
    return c.json({ error: 'Knowledge not found' }, 404);
  }
});

// 詳細画面表示
app.get('/knowledge/:id/view', async (c) => {
  try {
    const id = c.req.param('id');
    const knowledge = await FileBasedKnowledgeRepository.getById(id);
    return c.html(<KnowledgeDetail knowledge={knowledge} />);
  } catch (_error) {
    return c.html(<KnowledgeDetail />); // エラー時は空の状態
  }
});

app.post('/api/knowledge', async (c) => {
  try {
    let content: string, authorId: string;
    
    // Content-Typeに応じてデータを取得
    const contentType = c.req.header('content-type') || '';
    console.log('POST /api/knowledge - Content-Type:', contentType);
    
    if (contentType.includes('application/json')) {
      // JSON形式の場合
      const body = await c.req.json();
      content = body.content;
      authorId = body.authorId;
      console.log('JSON data:', { content: content?.slice(0, 50), authorId });
    } else {
      // HTMLフォーム形式の場合
      const formData = await c.req.formData();
      content = formData.get('content') as string;
      authorId = formData.get('authorId') as string;
      console.log('Form data:', { content: content?.slice(0, 50), authorId });
    }
    
    if (!content || !authorId) {
      return c.html(
        <Layout>
          <div class="bg-red-50 border border-red-200 rounded-md p-m">
            <p class="text-red-700">作成者IDと内容は必須です</p>
            <a href="/knowledge/new" class="text-blue-500 hover:text-blue-700">戻る</a>
          </div>
        </Layout>
      );
    }
    
    const knowledge = Knowledge.create(content, authorId);
    await FileBasedKnowledgeRepository.upsert(knowledge);
    
    // HTMLフォームの場合はリダイレクト、JSONの場合はJSONレスポンス
    if (contentType.includes('application/json')) {
      return c.json(knowledge, 201);
    } else {
      return c.redirect('/knowledge');
    }
  } catch (_error) {
    if (c.req.header('content-type')?.includes('application/json')) {
      return c.json({ error: 'Failed to create knowledge' }, 400);
    } else {
      return c.html(
        <Layout>
          <div class="bg-red-50 border border-red-200 rounded-md p-m">
            <p class="text-red-700">ナレッジの作成に失敗しました</p>
            <a href="/knowledge/new" class="text-blue-500 hover:text-blue-700">戻る</a>
          </div>
        </Layout>
      );
    }
  }
});

app.put('/api/knowledge/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existing = await FileBasedKnowledgeRepository.getById(id);
    const updated = Knowledge.update(existing, body.content);
    await FileBasedKnowledgeRepository.upsert(updated);
    return c.json(updated);
  } catch (_error) {
    return c.json({ error: 'Failed to update knowledge' }, 400);
  }
});

// HTMLフォームからのPUT/DELETE処理（POSTで_method=PUT/DELETEを送信）
app.post('/api/knowledge/:id', async (c) => {
  try {
    const formData = await c.req.formData();
    const method = formData.get('_method');
    const id = c.req.param('id');
    
    if (method === 'PUT') {
      // 編集処理
      const content = formData.get('content') as string;
      
      if (!content || !content.trim()) {
        return c.html(<KnowledgeEdit error="内容は必須です" />);
      }
      
      const existing = await FileBasedKnowledgeRepository.getById(id);
      const updated = Knowledge.update(existing, content.trim());
      await FileBasedKnowledgeRepository.upsert(updated);
      return c.redirect(`/knowledge/${id}/view`);
      
    } else if (method === 'DELETE') {
      // 削除処理
      await FileBasedKnowledgeRepository.deleteById(id);
      return c.redirect('/knowledge');
    }
    
    return c.json({ error: 'Invalid method' }, 400);
  } catch (_error) {
    const method = (await c.req.formData()).get('_method');
    
    if (method === 'PUT') {
      return c.html(
        <Layout>
          <div class="bg-red-50 border border-red-200 rounded-md p-m">
            <p class="text-red-700">更新に失敗しました</p>
            <a href="/knowledge" class="text-blue-500 hover:text-blue-700">一覧に戻る</a>
          </div>
        </Layout>
      );
    } else {
      return c.html(
        <Layout>
          <div class="bg-red-50 border border-red-200 rounded-md p-m">
            <p class="text-red-700">削除に失敗しました</p>
            <a href="/knowledge" class="text-blue-500 hover:text-blue-700">一覧に戻る</a>
          </div>
        </Layout>
      );
    }
  }
});

// HTMLフォームからのDELETE処理（POSTで_method=DELETEを送信）
app.post('/api/knowledge/:id/delete', async (c) => {
  try {
    const formData = await c.req.formData();
    const method = formData.get('_method');
    
    if (method === 'DELETE') {
      const id = c.req.param('id');
      await FileBasedKnowledgeRepository.deleteById(id);
      return c.redirect('/knowledge');
    }
    
    return c.json({ error: 'Invalid method' }, 400);
  } catch (_error) {
    return c.html(
      <Layout>
        <div class="bg-red-50 border border-red-200 rounded-md p-m">
          <p class="text-red-700">削除に失敗しました</p>
          <a href="/knowledge" class="text-blue-500 hover:text-blue-700">一覧に戻る</a>
        </div>
      </Layout>
    );
  }
});

app.delete('/api/knowledge/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await FileBasedKnowledgeRepository.deleteById(id);
    return c.json({ success: true });
  } catch (_error) {
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