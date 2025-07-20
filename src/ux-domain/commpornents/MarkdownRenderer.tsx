import DOMPurify from 'dompurify';

// シンプルなMarkdown変換関数
function parseMarkdown(content: string): string {
  return (
    content
      // 見出し
      .replace(/^### (.*$)/gm, '<h3 class="text-18 font-bold mt-l mb-s text-gray-900">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-20 font-bold mt-l mb-s text-gray-900">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-24 font-bold mt-l mb-s text-gray-900">$1</h1>')

      // 太字
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')

      // イタリック
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

      // コード（インライン）
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-14 font-mono">$1</code>')

      // リンク
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 underline">$1</a>')

      // 改行を<br>に変換
      .replace(/\n/g, '<br>')

      // 段落分け
      .replace(/\r\n\r\n|\r\r|\n\n/g, '</p><p class="mb-s">')
  );
}

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const htmlContent = parseMarkdown(content);
  const sanitizedHtml = DOMPurify.sanitize(`<p class="mb-s">${htmlContent}</p>`);

  // biome-ignore lint/security/noDangerouslySetInnerHtml: DOMPurifyでサニタイズ済み
  return <div class="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
