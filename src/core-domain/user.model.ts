import { randomUUID } from 'node:crypto';

// ユーザーのデータ構造を定義
export interface User {
  readonly id: string;
  readonly name: string;
  // passwordの代わりに、ハッシュ化済みのパスワードを保持する
  readonly passwordHash: string;
}

/**
 * ユーザーを新規作成する
 * @param name ユーザー名
 * @param passwordHash ハッシュ化済みのパスワード
 * @returns 新規作成されたユーザー
 */
function create(name: User['name'], passwordHash: User['passwordHash']): User {
  return {
    id: randomUUID(),
    name,
    passwordHash, // ここも passwordHash に変更
  };
}

export const User = {
  create,
};
