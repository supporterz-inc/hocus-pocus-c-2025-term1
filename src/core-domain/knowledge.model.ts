import { randomUUID } from 'node:crypto';

/**
 * ナレッジのドメインモデル
 */
export interface Knowledge {
  readonly __tag: 'Knowledge';

  /**
   * ナレッジの一意な ID
   */
  readonly id: string;

  /**
   * ナレッジの作成者の ID
   */
  readonly authorId: string;

  /**
   * ナレッジの本文 (Markdown)
   *
   * @todo: (学生向け) 空白の場合は不正な Knowledge とみなす
   */
  readonly content: string;

  /**
   * ナレッジの作成日時 (UNIX タイムスタンプ)
   */
  readonly createdAt: number;

  /**
   * ナレッジの更新日時 (UNIX タイムスタンプ)
   */
  readonly updatedAt: number;
}

/**
 * ナレッジを新規作成する
 *
 * @param content ナレッジの本文
 * @param authorId ナレッジの作成者の ID
 * @returns 新規作成されたナレッジ
 */
function create(content: Knowledge['content'], authorId: Knowledge['authorId']): Knowledge {
  const now = Math.floor(Date.now() / 1000);

  return {
    __tag: 'Knowledge',
    id: randomUUID(),
    content,
    authorId,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * ナレッジを更新する
 *
 * @param knowledge 更新対象のナレッジ
 * @param content 新しいナレッジの本文
 * @returns 更新されたナレッジ
 */
function update(self: Knowledge, content: Knowledge['content']): Knowledge {
  return {
    ...self,
    content,
    updatedAt: Math.floor(Date.now() / 1000),
  };
}

export const Knowledge = {
  create,
  update,
};
