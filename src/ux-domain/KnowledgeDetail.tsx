import { MarkdownRenderer } from './commpornents/MarkdownRenderer.js';
import { Layout } from './Layout.js';

interface KnowledgeDetailProps {
  knowledge?: {
    id: string;
    content: string;
    authorId: string;
    createdAt: number;
    updatedAt: number;
  };
}

export function KnowledgeDetail({ knowledge }: KnowledgeDetailProps) {
  if (!knowledge) {
    return (
      <Layout>
        <div class="text-center py-3xl">
          <p class="text-16 text-gray-600">
            ナレッジが見つかりません
          </p>
          <a class="text-blue-500 text-14 mt-s inline-block" href="/knowledge">
            一覧に戻る
          </a>
        </div>
      </Layout>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('ja-JP');
  };

  return (
    <Layout>
      <article class="bg-white rounded-8 shadow-sm border border-gray-200 p-l">
        {/* メタ情報 */}
        <div class="border-b border-gray-200 pb-s mb-l">
          <p class="text-12 text-gray-500">作成者: {knowledge.authorId}</p>
          <p class="text-12 text-gray-500">作成: {formatDate(knowledge.createdAt)}</p>
          {knowledge.updatedAt !== knowledge.createdAt && (
            <p class="text-12 text-gray-500">更新: {formatDate(knowledge.updatedAt)}</p>
          )}
        </div>

        {/* Markdownコンテンツ */}
        <div class="markdown-content">
          <MarkdownRenderer content={knowledge.content} />
        </div>

        {/* アクション */}
        <div class="mt-l pt-s border-t border-gray-200 flex gap-s">
          <a
            class="px-s py-2xs bg-blue-500 text-white text-14 rounded-4 hover:bg-blue-600"
            href={`/knowledge/${knowledge.id}/edit`}
          >
            編集
          </a>
          <button
            class="px-s py-2xs bg-red-500 text-white text-14 rounded-4 hover:bg-red-600"
            onclick={`deleteKnowledge('${knowledge.id}')`}
            type="button"
          >
            削除
          </button>
          <a class="px-s py-2xs bg-gray-500 text-white text-14 rounded-4 hover:bg-gray-600" href="/knowledge">
            一覧に戻る
          </a>
        </div>
      </article>

      {/* 削除用JavaScript */}
      <script>{`
            function deleteKnowledge(id) {
                if (confirm('本当に削除しますか？')) {
                    fetch('/knowledge/' + id, { method: 'DELETE' })
                    .then(() => window.location.href = '/knowledge')
                    .catch(err => alert('削除に失敗しました'));
            }
            }
        `}</script>
    </Layout>
  );
}
