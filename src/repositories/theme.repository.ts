import type { Theme } from '../core-domain/theme.model.js';

/**
 * テーマリポジトリのインターフェース
 */
export interface ThemeRepository {
  /**
   * 全てのテーマを取得する
   *
   * @returns 全テーマの配列
   */
  getAll(): Promise<Theme[]>;

  /**
   * 有効なテーマのみを取得する
   *
   * @returns 有効なテーマの配列
   */
  getActiveThemes(): Promise<Theme[]>;

  /**
   * IDによってテーマを取得する
   *
   * @param id テーマID
   * @returns テーマ、存在しない場合はnull
   */
  getById(id: string): Promise<Theme | null>;

  /**
   * テーマを作成する
   *
   * @param theme 作成するテーマ
   */
  create(theme: Theme): Promise<void>;

  /**
   * テーマを更新する
   *
   * @param theme 更新するテーマ
   */
  update(theme: Theme): Promise<void>;

  /**
   * テーマを削除する
   *
   * @param id 削除するテーマのID
   */
  delete(id: string): Promise<void>;
}
