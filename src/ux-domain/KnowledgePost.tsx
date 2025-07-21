import { Layout } from './Layout.js';

export function KnowledgePost() {
  return (
    <Layout>
      <div class="bg-white rounded-8 shadow-sm border border-gray-200 p-l">
        <h2 class="text-20 font-bold mb-m">新規投稿</h2>

        <div class="mb-m p-m border border-blue-200 bg-blue-50 rounded-md">
          <p class="text-14 font-medium text-gray-700 mb-xs">今日のテーマ</p>
          <div id="themeResult">
            <p class="text-12 text-gray-500">作成者IDを入力して「テーマを確認」ボタンを押してください。</p>
          </div>
        </div>

        <form action="/api/knowledge" method="post">
          <div class="mb-m">
            <label class="block text-14 font-medium text-gray-700 mb-xs" for="authorId">
              作成者ID
            </label>
            <div class="flex items-center gap-s">
              <input
                class="flex-grow border border-gray-300 rounded-4 p-s text-14"
                id="authorId"
                name="authorId"
                placeholder="your-user-id"
                required
              />
              <button
                class="px-s py-2xs bg-yellow-500 text-white text-14 rounded-4 hover:bg-yellow-600"
                type="button"
                onclick={`
                  (async () => {
                    const authorIdInput = document.getElementById('authorId');
                    const resultDiv = document.getElementById('themeResult');
                    if (!authorIdInput || !authorIdInput.value) {
                      resultDiv.innerHTML = '<p class="text-red-500">作成者IDを入力してください。</p>';
                      return;
                    }
                    const userId = authorIdInput.value;
                    resultDiv.innerHTML = '<p class="text-gray-500">取得中...</p>';
                    try {
                      const response = await fetch('/api/users/' + userId + '/today-theme');
                      if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.error || 'テーマの取得に失敗しました。');
                      }
                      const data = await response.json();
                      if (data.error) {
                        throw new Error(data.error);
                      }
                      const theme = data.theme;
                      resultDiv.innerHTML =
                        '<p class="text-16 font-bold text-gray-800">「' + theme.word + '」</p>' +
                        '<p class="text-12 text-gray-600 mt-xs">(カテゴリ: ' + theme.category + ' / 難易度: ' + theme.difficulty + ')</p>';
                    } catch (error) {
                      resultDiv.innerHTML = '<p class="text-red-500">' + error.message + '</p>';
                    }
                  })();
                `}
              >
                テーマを確認
              </button>
            </div>
          </div>

          <div class="mb-m">
            <label class="block text-14 font-medium text-gray-700 mb-xs" for="content">
              ナレッジ本文 (Markdown)
            </label>
            <textarea
              class="w-full border border-gray-300 rounded-4 p-s text-14"
              id="content"
              name="content"
              placeholder="今日のテーマに沿った内容を Markdown 形式で入力してください"
              required
              rows={10}
            />
          </div>

          <div class="flex justify-end gap-s">
            <a class="px-s py-2xs bg-gray-200 text-gray-700 rounded-4 text-14 hover:bg-gray-300" href="/knowledge">
              キャンセル
            </a>
            <button class="px-s py-2xs bg-blue-500 text-white text-14 rounded-4 hover:bg-blue-600" type="submit">
              投稿する
            </button>
          </div>
        </form>
      </div>
      {/* 以前の<script>タグは不要なので削除します */}
    </Layout>
  );
}
