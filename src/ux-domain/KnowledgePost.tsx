import { Layout } from './Layout.js';

export function KnowledgePost() {
  return (
    <Layout>
      <div class="bg-white rounded-8 shadow-sm border border-gray-200 p-l">
        <h2 class="text-20 font-bold mb-m">新規投稿</h2>
        <form method="post" action="/api/knowledge">
          <div class="mb-m">
            <label class="block text-14 font-medium text-gray-700 mb-xs" for="authorId">
              作成者ID
            </label>
            <input
              class="w-full border border-gray-300 rounded-4 p-s text-14"
              id="authorId"
              name="authorId"
              placeholder="your-user-id"
              required
            />
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
              rows={10}
              required
            />
          </div>
          <div class="flex justify-end gap-s">
            <a
              href="/knowledge"
              class="px-s py-2xs bg-gray-200 text-gray-700 rounded-4 text-14 hover:bg-gray-300"
            >
              キャンセル
            </a>
            <button 
              class="px-s py-2xs bg-blue-500 text-white text-14 rounded-4 hover:bg-blue-600"
              type="submit"
            >
              投稿する
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}