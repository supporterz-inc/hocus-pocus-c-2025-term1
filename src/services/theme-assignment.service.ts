import type { Theme } from '../core-domain/theme.model.js';
import type { ThemeRepository } from '../repositories/theme.repository.js';

/**
 * 日別テーマ割り振りのドメインモデル
 */
export interface DailyThemeAssignment {
  readonly __tag: 'DailyThemeAssignment';
  readonly userId: string;
  readonly themeId: string;
  readonly assignedDate: string; // YYYY-MM-DD
  readonly createdAt: number;
}

/**
 * テーマ割り振りサービス
 * ユーザーID + 日付でハッシュ化して決定的にテーマを決定する
 */
export class ThemeAssignmentService {
  constructor(private readonly themeRepository: ThemeRepository) {}

  /**
   * 指定ユーザーの今日のテーマを取得する
   *
   * @param userId ユーザーID
   * @returns 今日のテーマ
   */
  async getTodayTheme(userId: string): Promise<Theme> {
    const today = this.getCurrentDate();
    return await this.getThemeForDate(userId, today);
  }

  /**
   * 指定ユーザーの指定日のテーマを取得する
   *
   * @param userId ユーザーID
   * @param date 日付 (YYYY-MM-DD)
   * @returns 指定日のテーマ
   */
  async getThemeForDate(userId: string, date: string): Promise<Theme> {
    const activeThemes = await this.themeRepository.getActiveThemes();

    if (activeThemes.length === 0) {
      throw new Error('No active themes available');
    }

    // ハッシュベースでテーマを決定
    const hash = this.generateThemeHash(userId, date);
    const themeIndex = hash % activeThemes.length;

    const selectedTheme = activeThemes[themeIndex];
    if (!selectedTheme) {
      throw new Error('Failed to select theme from active themes');
    }

    return selectedTheme;
  }

  /**
   * 指定ユーザーの指定日のテーマIDを取得する
   *
   * @param userId ユーザーID
   * @param date 日付 (YYYY-MM-DD)
   * @returns テーマID
   */
  async getThemeIdForDate(userId: string, date: string): Promise<string> {
    const theme = await this.getThemeForDate(userId, date);
    return theme.id;
  }

  /**
   * ユーザーID + 日付からハッシュ値を生成する
   * 同じユーザー・日付で常に同じテーマが返されることを保証
   *
   * @param userId ユーザーID
   * @param date 日付 (YYYY-MM-DD)
   * @returns ハッシュ値
   */
  private generateThemeHash(userId: string, date: string): number {
    const combined = `${userId}-${date}`;
    let hash = 0;

    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 32bit整数に変換
    }

    return Math.abs(hash);
  }

  /**
   * 現在の日付を YYYY-MM-DD 形式で取得する
   *
   * @returns 現在の日付
   */
  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0] || '';
  }

  /**
   * DailyThemeAssignment オブジェクトを作成する
   *
   * @param userId ユーザーID
   * @param themeId テーマID
   * @param date 日付 (YYYY-MM-DD)
   * @returns DailyThemeAssignment オブジェクト
   */
  createAssignment(userId: string, themeId: string, date: string): DailyThemeAssignment {
    return {
      __tag: 'DailyThemeAssignment',
      userId,
      themeId,
      assignedDate: date,
      createdAt: Math.floor(Date.now() / 1000),
    };
  }

  /**
   * 複数日のテーマ予告を取得する（管理者機能・デバッグ用）
   *
   * @param userId ユーザーID
   * @param days 何日分取得するか
   * @returns 日付とテーマのペア配列
   */
  async getUpcomingThemes(userId: string, days: number = 7): Promise<Array<{ date: string; theme: Theme }>> {
    const result: Array<{ date: string; theme: Theme }> = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      const dateStr = targetDate.toISOString().split('T')[0] || '';

      const theme = await this.getThemeForDate(userId, dateStr);
      result.push({ date: dateStr, theme });
    }

    return result;
  }
}
