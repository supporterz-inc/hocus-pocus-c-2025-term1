import { Layout } from "./Layout.js";

export function KnowledgePost() {
  // スクリプトの内容を別の変数として定義
  const scriptContent = `
    // フォームの要素を取得
    const form = document.getElementById('new-knowledge-form');

    // フォームの submit イベントを監視
    form.addEventListener('submit', async (e) => {
      // デフォルトのフォーム送信をキャンセル
      e.preventDefault();
      
      console.log('Form submission intercepted.'); // ★デバッグ用ログ

      // フォームから content の値を取得
      const content = e.target.elements.content.value;
      
      // TODO: authorId は認証情報から取得するように変更する
      const authorId = 'testUser';

      // 本文が空の場合はアラートを出して処理を中断
      if (!content || content.trim() === '') {
        alert('本文を入力してください。');
        return;
      }
      
      console.log('Sending fetch request...'); // ★デバッグ用ログ

      try {
        const response = await fetch('/knowledge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content, authorId }),
        });

        if (response.ok) {
          // 投稿が成功したらトップページにリダイレクト
          window.location.href = '/'; 
        } else {
          // サーバーからエラーが返ってきた場合
          const error = await response.json();
          alert('投稿に失敗しました: ' + (error.error || 'Unknown error'));
        }
      } catch (err) {
        // ネットワークエラーなど、fetch自体に失敗した場合
        console.error('Fetch error:', err);
        alert('投稿処理中にエラーが発生しました。');
      }
    });
  `;

  return (
    <Layout>
      <div class="bg-white rounded-8 shadow-sm border border-gray-200 p-l">
        <h2 class="text-20 font-bold mb-m">新規投稿</h2>
        <form id="new-knowledge-form">
          <div class="mb-m">
            <label
              for="content"
              class="block text-14 font-medium text-gray-700 mb-xs"
            >
              ナレッジ本文 (Markdown)
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              class="w-full border border-gray-300 rounded-4 p-s text-14"
              placeholder="Markdown 形式で入力してください"
            ></textarea>
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="px-s py-2xs bg-blue-500 text-white text-14 rounded-4 hover:bg-blue-600"
            >
              投稿する
            </button>
          </div>
        </form>
      </div>
      {/* dangerouslySetInnerHTML を使ってスクリプトを埋め込む */}
      <script dangerouslySetInnerHTML={{ __html: scriptContent }}></script>
    </Layout>
  );
}
