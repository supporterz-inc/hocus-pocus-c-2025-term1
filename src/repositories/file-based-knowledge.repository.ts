// getAll: storage/フォルダの全.jsonファイルを読んで配列で返す
// getById: storage/knowledge-{id}.json を読んで1つ返す
export const FileBasedKnowledgeRepository: KnowledgeRepository = {
  // 指定されたIDの単一ナレッジを取得
  // readSingleKnowledgeを使用してファイルから読み込み
  // ナレッジが見つからない場合はErrorをスロー（明確なエラーメッセージ付き）
  async getById(id: string): Promise<Knowledge> {
    const knowledge = await readSingleKnowledge(id);
    if (!knowledge) {
      throw new Error(`Knowledge with id ${id} not found`);
    }
    return knowledge;
  },

  // 全ナレッジの一覧を取得する複雑な処理を実装
  // ディレクトリ操作: readdirでストレージディレクトリ内のファイル一覧を取得
  // ファイルフィルタリング: knowledge-*.jsonパターンにマッチするファイルのみを対象
  // エラー耐性: 個別ファイルの読み込みエラーは無視して処理続行
  // ソート機能: updatedAtの降順で結果をソート（最新更新順）
  // フォールバック: ディレクトリアクセスエラー時は空配列を返す
  async getAll(): Promise<Knowledge[]> {
    try {
      await ensureStorageDir();
      const files = await fs.readdir(STORAGE_DIR);
      const knowledgeFiles = files.filter(file => file.startsWith('knowledge-') && file.endsWith('.json'));
      
      const knowledgeList: Knowledge[] = [];
      for (const file of knowledgeFiles) {
        try {
          const filePath = join(STORAGE_DIR, file);
          const data = await fs.readFile(filePath, 'utf-8');
          const knowledge = JSON.parse(data);
          knowledgeList.push(knowledge);
        } catch {
          // ファイル読み込みエラーは無視して続行
        }
      }
      
      return knowledgeList.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch {
      return [];
    }
  },


  // @ts-ignore TODO: (学生向け) 実装する
  upsert: async (knowledge) => {},
  // @ts-ignore TODO: (学生向け) 実装する
  deleteById: async (id) => {},
};
