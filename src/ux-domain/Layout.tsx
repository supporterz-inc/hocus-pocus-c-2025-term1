export function Layout({ children }: { children?: import('hono/jsx').Child }) {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Hocus Pocus | Knowledge Sharing Platform</title>
        <link href="/index.css" rel="stylesheet" />
      </head>

      <body class="bg-gray-100 min-h-screen">
        {/* ヘッダー */}
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="w-[375px] mx-auto px-s py-s">
            <h1 class="text-20 font-bold text-gray-900">
              <a class="text-blue-500" href="/">
                Hocus Pocus パルプンテ
              </a>
            </h1>
            <nav class="mt-2xs">
              <a class="text-14 text-blue-500 mr-s" href="/knowledge">
                一覧
              </a>
              <a class="text-14 text-blue-500" href="/knowledge/new">
                新規投稿
              </a>
            </nav>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main class="w-[375px] mx-auto px-s py-m">{children || <div>コンテンツがありません</div>}</main>
      </body>
    </html>
  );
}
