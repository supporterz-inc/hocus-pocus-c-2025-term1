import { Layout } from "./Layout.js";

interface KnowledgeEditProps {
  knowledge?: {
    id: string;
    content: string;
    authorId: string;
    createdAt: number;
    updatedAt: number;
  };
}

export function KnowledgeEdit({ knowledge }: KnowledgeEditProps) {
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

  // スクリプトの内容を別の変数として定義
  const scriptContent = `
    // フォームの要素を取得
    const form = document.getElementById('edit-knowledge-form');

    // フォームの submit イベントを監視
    form.addEventListener('submit', async (e) => {
      // デフォルトのフォーム送信をキャンセル
      e.preventDefault();
      
      console.log('Edit form submission intercepted.'); // ★デバッグ用ログ

      // フォームから content の値を取得
      const content = e.target.elements.content.value;

      // 本文が空の場合はアラートを出して処理を中断
      if (!content || content.trim() === '') {
        alert('本文を入力してください。');
        return;
      }
      
      console.log('Sending PUT request...'); // ★デバッグ用ログ

      try {
        const response = await fetch('/knowledge/${knowledge.id}', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });

        if (response.ok) {
          // 更新が成功したら詳細ページにリダイレクト
          window.location.href = '/knowledge/${knowledge.id}/view'; 
        } else {
          // サーバーからエラーが返ってきた場合
          const error = await response.json();
          alert('更新に失敗しました: ' + (error.error || 'Unknown error'));
        }
      } catch (err) {
        // ネットワークエラーなど、fetch自体に失敗した場合
        console.error('Fetch error:', err);
        alert('更新処理中にエラーが発生しました。');
      }
    });

    // キャンセルボタンの処理
    function cancelEdit() {
      if (confirm('編集をキャンセルしますか？変更内容は保存されません。')) {
        window.location.href = '/knowledge/${knowledge.id}/view';
      }
    }
  `;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('ja-JP');
  };

  return (
    <Layout>
      <div class="bg-white rounded-8 shadow-sm border border-gray-200 p-l">
        {/* ヘッダー情報 */}
        <div class="border-b border-gray-200 pb-s mb-l">
          <h2 class="text-20 font-bold mb-xs">ナレッジを編集</h2>
          <p class="text-12 text-gray-500">作成者: {knowledge.authorId}</p>
          <p class="text-12 text-gray-500">作成: {formatDate(knowledge.createdAt)}</p>
          {knowledge.updatedAt !== knowledge.createdAt && (
            <p class="text-12 text-gray-500">最終更新: {formatDate(knowledge.updatedAt)}</p>
          )}
        </div>

        {/* 編集フォーム */}
        <form id="edit-knowledge-form">
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
              rows={15}
              class="w-full border border-gray-300 rounded-4 p-s text-14 font-mono"
              placeholder="Markdown 形式で入力してください"
            >{knowledge.content}</textarea>
          </div>

          {/* アクションボタン */}
          <div class="flex justify-between">
            <button
              type="button"
              onclick="cancelEdit()"
              class="px-s py-2xs bg-gray-500 text-white text-14 rounded-4 hover:bg-gray-600"
            >
              キャンセル
            </button>
            <div class="flex gap-xs">
              <a
                href={`/knowledge/${knowledge.id}/view`}
                class="px-s py-2xs bg-blue-100 text-blue-700 text-14 rounded-4 hover:bg-blue-200"
              >
                プレビュー
              </a>
              <button
                type="submit"
                class="px-s py-2xs bg-blue-500 text-white text-14 rounded-4 hover:bg-blue-600"
              >
                更新する
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* JavaScriptを埋め込む */}
      <script dangerouslySetInnerHTML={{ __html: scriptContent }}></script>
    </Layout>
  );
}