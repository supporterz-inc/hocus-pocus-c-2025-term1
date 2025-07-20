export function CommonScripts() {
    const scriptContent = `
      // 共通の削除関数
      window.deleteKnowledge = function(id, redirectPath = '/knowledge') {
        if (confirm('本当に削除しますか？')) {
          fetch('/knowledge/' + id, { method: 'DELETE' })
            .then(response => {
              if (response.ok) {
                window.location.href = redirectPath;
              } else {
                alert('削除に失敗しました');
              }
            })
            .catch(err => {
              console.error('Delete error:', err);
              alert('削除処理中にエラーが発生しました');
            });
        }
      };
    `;
  
    return <script dangerouslySetInnerHTML={{ __html: scriptContent }}></script>;
  }