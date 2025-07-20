import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import type { Knowledge } from '../core-domain/knowledge.model.js';
import type { KnowledgeRepository } from './knowledge.repository.js';

const STORAGE_DIR = './storage';

// ストレージディレクトリの存在確認と作成
// ディレクトリが存在しない場合は再帰的に作成
async function ensureStorageDir(): Promise<void> {
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }
}

// IDに基づいて個別ファイルのパスを生成
// 文字列型にして、JSONファイルとして保存
function getKnowledgeFilePath(id: string): string {
  return join(STORAGE_DIR, `knowledge-${id}.json`);
}

// 指定IDの個別JSONファイルからナレッジデータを読み込み
// ファイルが存在しない場合はnullを返す
// エラーハンドリングでファイルアクセス失敗に対応
async function readSingleKnowledge(id: string): Promise<Knowledge | null> {
  try {
    const filePath = getKnowledgeFilePath(id);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// 単一のナレッジデータを個別JSONファイルに書き込み
// ナレッジのIDを使ってファイル名を決定
// インデント付きで整形して保存
async function writeSingleKnowledge(knowledge: Knowledge): Promise<void> {
  await ensureStorageDir();
  const filePath = getKnowledgeFilePath(knowledge.id);
  await fs.writeFile(filePath, JSON.stringify(knowledge, null, 2));
}

// ファイルベースのナレッジリポジトリの実装
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

  // ディレクトリ操作: readdirでストレージディレクトリ内のファイル一覧を取得
  // ファイルフィルタリング: knowledge-*.jsonパターンにマッチするファイルのみを対象
  // エラー耐性: 個別ファイルの読み込みエラーは無視して処理続行
  // ソート機能: updatedAtの降順で結果をソート（最新更新順）
  // フォールバック: ディレクトリアクセスエラー時は空配列を返す
  async getAll(): Promise<Knowledge[]> {
    try {
      await ensureStorageDir();
      const files = await fs.readdir(STORAGE_DIR);
      const knowledgeFiles = files.filter((file) => file.startsWith('knowledge-') && file.endsWith('.json'));

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


  async upsert(knowledge: Knowledge): Promise<void> {
    await writeSingleKnowledge(knowledge);

  },

  async deleteById(id: string): Promise<void> {
    try {
      const filePath = getKnowledgeFilePath(id);
      await fs.unlink(filePath);
    } catch {
      throw new Error(`Knowledge with id ${id} not found`);
    }
  },
};
