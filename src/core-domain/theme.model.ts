import { randomUUID } from 'node:crypto';

/**
 * テーマのドメインモデル
 * difficultyとcategoryは今後の拡張用
 */

export interface Theme {
  readonly __tag: 'Theme';

  /**
   * テーマの一意なID
   */
  readonly id: string;

  /**
   * テーマ単語（例：「学習」「チームワーク」「効率化」）
   */
  readonly word: string;

  /**
   * テーマのカテゴリ（例：「教育」「コミュニケーション」「業務改善」）
   */
  readonly category: string;

  /**
   * テーマの難易度
   */
  readonly difficulty: 'easy' | 'medium' | 'hard';

  /**
   * テーマが有効かどうか
   */
  readonly isActive: boolean;

  /**
   * テーマの作成日時 (UNIX タイムスタンプ)
   */
  readonly createdAt: number;
}

/**
 * テーマを新規作成する
 *
 * @param word テーマ単語
 * @param category テーマのカテゴリ
 * @param difficulty テーマの難易度
 * @returns 新規作成されたテーマ
 */
function create(word: Theme['word'], category: Theme['category'], difficulty: Theme['difficulty']): Theme {
  const now = Math.floor(Date.now() / 1000);

  return {
    __tag: 'Theme',
    id: randomUUID(),
    word,
    category,
    difficulty,
    isActive: true,
    createdAt: now,
  };
}

/**
 * テーマを無効化する
 *
 * @param theme 無効化対象のテーマ
 * @returns 無効化されたテーマ
 */
function deactivate(self: Theme): Theme {
  return {
    ...self,
    isActive: false,
  };
}

/**
 * テーマを有効化する
 *
 * @param theme 有効化対象のテーマ
 * @returns 有効化されたテーマ
 */
function activate(self: Theme): Theme {
  return {
    ...self,
    isActive: true,
  };
}

export const Theme = {
  create,
  deactivate,
  activate,
};
