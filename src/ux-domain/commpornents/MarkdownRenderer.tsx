interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // 安全にプレーンテキストとして表示
  const lines = content.split('\n');

  return (
    <div class="prose max-w-none">
      {lines.map((line, index) => (
        <div class="mb-2" key={`line-${index}-${line.slice(0, 10)}`}>
          {line.startsWith('# ') ? (
            <h1 class="text-24 font-bold mt-l mb-s text-gray-900">{line.slice(2)}</h1>
          ) : line.startsWith('## ') ? (
            <h2 class="text-20 font-bold mt-l mb-s text-gray-900">{line.slice(3)}</h2>
          ) : line.startsWith('### ') ? (
            <h3 class="text-18 font-bold mt-l mb-s text-gray-900">{line.slice(4)}</h3>
          ) : line.startsWith('- ') ? (
            <li class="ml-4 text-gray-700">{line.slice(2)}</li>
          ) : line.trim() === '' ? (
            <br />
          ) : (
            <p class="text-gray-700 mb-s">{line}</p>
          )}
        </div>
      ))}
    </div>
  );
}
