import type { Knowledge } from '../core-domain/knowledge.model.js';
import { Layout } from './Layout.js';

interface KnowledgeEditProps {
  knowledge?: Knowledge;
  error?: string;
}

export function KnowledgeEdit({ knowledge, error }: KnowledgeEditProps) {
  if (error) {
    return (
      <Layout>
        <div class="bg-red-50 border border-red-200 rounded-md p-m">
          <p class="text-red-700">エラーが発生しました: {error}</p>
          <a class="text-blue-500 hover:text-blue-700" href="/knowledge">
            戻る
          </a>
        </div>
      </Layout>
    );
  }

  if (!knowledge) {
    return (
      <Layout>
        <div class="bg-yellow-50 border border-yellow-200 rounded-md p-m">
          <p class="text-yellow-700">ナレッジが見つかりません</p>
          <a class="text-blue-500 hover:text-blue-700" href="/knowledge">
            戻る
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div class="bg-white rounded-8 shadow-sm border border-gray-200 p-l">
        <h2 class="text-20 font-bold mb-m">ナレッジ編集</h2>
        <form action={`/api/knowledge/${knowledge.id}`} method="post">
          <input name="_method" type="hidden" value="PUT" />

          <div class="mb-m">
            <label class="block text-14 font-medium text-gray-700 mb-xs" for="authorId">
              投稿者ID
            </label>
            <input
              class="w-full border border-gray-300 rounded-4 p-s text-14 bg-gray-100"
              id="authorId"
              name="authorId"
              readonly
              value={knowledge.authorId}
            />
            <p class="text-12 text-gray-500 mt-xs">投稿者IDは変更できません</p>
          </div>

          <div class="mb-m">
            <label class="block text-14 font-medium text-gray-700 mb-xs" for="content">
              ナレッジ本文 (Markdown)
            </label>
            <textarea
              class="w-full border border-gray-300 rounded-4 p-s text-14"
              id="content"
              name="content"
              placeholder="Markdown 形式で入力してください"
              required
              rows={20}
            >
              {knowledge.content}
            </textarea>
          </div>

          <div class="flex justify-end gap-s">
            <a class="px-s py-2xs bg-gray-200 text-gray-700 rounded-4 text-14 hover:bg-gray-300" href="/knowledge">
              キャンセル
            </a>
            <a
              class="px-s py-2xs bg-blue-200 text-blue-700 rounded-4 text-14 hover:bg-blue-300"
              href={`/knowledge/${knowledge.id}/view`}
            >
              プレビュー
            </a>
            <button class="px-s py-2xs bg-green-500 text-white text-14 rounded-4 hover:bg-green-600" type="submit">
              更新
            </button>
          </div>
        </form>

        <div class="mt-m pt-m border-t border-gray-200">
          <p class="text-12 text-gray-500">作成日時: {new Date(knowledge.createdAt * 1000).toLocaleString('ja-JP')}</p>
          <p class="text-12 text-gray-500">更新日時: {new Date(knowledge.updatedAt * 1000).toLocaleString('ja-JP')}</p>
        </div>
      </div>
    </Layout>
  );
}
