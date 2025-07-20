import type { Knowledge } from '../core-domain/knowledge.model.js';

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const date = new Date(timestamp * 1000); // UNIXタイムスタンプ（秒）をミリ秒に変換
  const diffMs = now - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return 'たった今';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分前`;
  } else if (diffHours < 24) {
    return `${diffHours}時間前`;
  } else if (diffDays < 7) {
    return `${diffDays}日前`;
  } else {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

interface KnowledgeListProps {
  knowledgeList?: Knowledge[];
  error?: string;
}

export function KnowledgeList({ knowledgeList = [], error }: KnowledgeListProps) {
  if (error) {
    return (
      <div class="bg-red-50 border border-red-200 rounded-md p-m">
        <p class="text-red-700">エラーが発生しました: {error}</p>
      </div>
    );
  }

  if (knowledgeList.length === 0) {
    return (
      <div class="text-center py-xl">
        <p class="text-gray-500 text-16">まだナレッジが投稿されていません</p>
        <a 
          href="/knowledge/new" 
          class="inline-block mt-m px-m py-s bg-blue-500 text-white rounded-md text-14 hover:bg-blue-600 transition-colors"
        >
          最初のナレッジを投稿する
        </a>
      </div>
    );
  }

  return (
    <div class="space-y-s">
      <div class="flex justify-between items-center mb-m">
        <h2 class="text-18 font-semibold text-gray-900">
          ナレッジ一覧 ({knowledgeList.length}件)
        </h2>
        <a 
          href="/knowledge/new" 
          class="px-s py-xs bg-blue-500 text-white rounded-md text-14 hover:bg-blue-600 transition-colors"
        >
          新規投稿
        </a>
      </div>
      
      {knowledgeList.map((knowledge) => (
        <div key={knowledge.id} class="bg-white border border-gray-200 rounded-md p-m hover:shadow-sm transition-shadow">
          <div class="flex justify-between items-start mb-xs">
            <div class="flex flex-col">
              <span class="text-12 text-gray-500">
                {formatRelativeTime(knowledge.updatedAt)}
              </span>
              <span class="text-10 text-gray-400" title={formatDateTime(knowledge.updatedAt)}>
                {formatDateTime(knowledge.updatedAt)}
              </span>
            </div>
            <span class="text-12 text-gray-500">
              by {knowledge.authorId}
            </span>
          </div>
          
          <div class="mb-s">
            <p class="text-gray-700 text-14 line-clamp-3">
              {knowledge.content.slice(0, 150)}
              {knowledge.content.length > 150 ? '...' : ''}
            </p>
          </div>
          
          <div class="flex justify-between items-center">
            <a 
              href={`/knowledge/${knowledge.id}/view`}
              class="text-blue-500 text-14 hover:text-blue-700 transition-colors"
            >
              詳細を見る →
            </a>
            <div class="flex gap-xs">
              <a 
                href={`/knowledge/${knowledge.id}/edit`}
                class="text-gray-500 text-12 hover:text-gray-700 transition-colors"
              >
                編集
              </a>
              <button 
                onclick={`deleteKnowledge('${knowledge.id}')`}
                class="text-red-500 text-12 hover:text-red-700 transition-colors"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}