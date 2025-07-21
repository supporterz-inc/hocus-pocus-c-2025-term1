import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import type { User } from '../core-domain/user.model.js';

// 他のリポジトリと共有できるよう、ストレージのパスは定数化
const STORAGE_DIR = './storage';

/**
 * ストレージディレクトリの存在を確認し、なければ作成する
 */
async function ensureStorageDir(): Promise<void> {
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }
}

/**
 * ユーザーIDに基づいて、保存先のファイルパスを生成する
 * @param id ユーザーID
 * @returns ファイルパス
 */
function getUserFilePath(id: string): string {
  return join(STORAGE_DIR, `user-${id}.json`);
}

/**
 * 単一のユーザーデータをJSONファイルとして保存する
 * @param user 保存するユーザーオブジェクト
 */
async function writeSingleUser(user: User): Promise<void> {
  await ensureStorageDir();
  const filePath = getUserFilePath(user.id);
  // JSONを整形して保存することで、手動でのデバッグが容易になります
  await fs.writeFile(filePath, JSON.stringify(user, null, 2));
}

/**
 * ファイルベースのユーザーリポジトリの実装
 */
export const FileBasedUserRepository = {
  /**
   * 指定されたIDのユーザーを取得する
   * @param id ユーザーID
   * @returns ユーザーオブジェクト
   * @throws ユーザーが見つからない場合にエラーをスローする
   */
  async getById(id: string): Promise<User> {
    try {
      const filePath = getUserFilePath(id);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as User;
    } catch {
      throw new Error(`User with id ${id} not found`);
    }
  },

  /**
   * 指定された名前のユーザーを検索する
   * @param name ユーザー名
   * @returns ユーザーオブジェクト、見つからない場合はnull
   */
  async findByName(name: string): Promise<User | null> {
    try {
      await ensureStorageDir();
      const files = await fs.readdir(STORAGE_DIR);
      // user-*.json ファイルのみを対象にする
      const userFiles = files.filter((file) => file.startsWith('user-') && file.endsWith('.json'));

      for (const file of userFiles) {
        try {
          const filePath = join(STORAGE_DIR, file);
          const data = await fs.readFile(filePath, 'utf-8');
          const user = JSON.parse(data) as User;
          if (user.name === name) {
            return user; // マッチするユーザーが見つかったら即座に返す
          }
        } catch {
          // 個別のファイルの読み込みエラーは無視して処理を続行
        }
      }

      return null; // 最後まで見つからなかった場合
    } catch {
      // ディレクトリの読み取りエラーなど、予期せぬエラーの場合はnullを返す
      return null;
    }
  },

  /**
   * ユーザーを新規保存、または上書き保存する
   * @param user 保存するユーザーオブジェクト
   */
  async upsert(user: User): Promise<void> {
    await writeSingleUser(user);
  },
};
