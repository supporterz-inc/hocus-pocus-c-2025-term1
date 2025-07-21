/**
 * コンテンツ検証結果
 */
export interface ValidationResult {
  /**
   * 検証が成功したかどうか
   */
  readonly isValid: boolean;

  /**
   * 検出されたテーマ単語の配列
   */
  readonly detectedWords: string[];

  /**
   * 検証失敗時の理由（成功時はundefined）
   */
  readonly reason?: string;

  /**
   * 検証対象のテーマ単語
   */
  readonly themeWord: string;
}

/**
 * コンテンツ検証サービス
 * 投稿内容がテーマ単語を含んでいるかをチェックする
 */
export class ContentValidatorService {
  /**
   * メイン検証機能
   * 投稿内容にテーマ単語が含まれているかを検証する
   *
   * @param content 投稿内容
   * @param themeWord テーマ単語
   * @returns 検証結果
   */
  validateThemeContent(content: string, themeWord: string): ValidationResult {
    if (!content || content.trim().length === 0) {
      return {
        isValid: false,
        detectedWords: [],
        reason: '投稿内容が空です',
        themeWord,
      };
    }

    if (!themeWord || themeWord.trim().length === 0) {
      return {
        isValid: false,
        detectedWords: [],
        reason: 'テーマ単語が設定されていません',
        themeWord,
      };
    }

    // 基本的な単語含有チェック
    const isIncluded = this.checkThemeWordInclusion(content, themeWord);

    if (isIncluded) {
      return {
        isValid: true,
        detectedWords: [themeWord],
        themeWord,
      };
    } else {
      return {
        isValid: false,
        detectedWords: [],
        reason: `今日のテーマ「${themeWord}」を含む投稿をしてください`,
        themeWord,
      };
    }
  }

  /**
   * 投稿内容から単語を抽出する（シンプル版）
   *
   * @param content 投稿内容
   * @returns 抽出された単語の配列
   */
  extractWords(content: string): string[] {
    if (!content) return [];

    // 簡単な単語分割（スペース、句読点で分割）
    const words = content
      .split(/[\s\n\r、。！？,.!?]+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 0);

    return words;
  }

  /**
   * テーマ単語含有チェック
   * 大文字小文字を無視してチェックする
   *
   * @param content 投稿内容
   * @param themeWord テーマ単語
   * @returns 含まれているかどうか
   */
  private checkThemeWordInclusion(content: string, themeWord: string): boolean {
    const normalizedContent = this.normalizeText(content);
    const normalizedTheme = this.normalizeText(themeWord);

    // 基本的な文字列含有チェック
    if (normalizedContent.includes(normalizedTheme)) {
      return true;
    }

    // ひらがな・カタカナ・漢字の変換を考慮した簡易チェック
    return this.checkWithVariations(normalizedContent, normalizedTheme);
  }

  /**
   * テキスト正規化
   * 大文字小文字統一、空白除去など
   *
   * @param text 対象テキスト
   * @returns 正規化されたテキスト
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '') // 空白文字を除去
      .trim();
  }

  /**
   * 簡易的な文字バリエーション対応
   * ひらがな・カタカナの違いなどを考慮
   *
   * @param content 投稿内容（正規化済み）
   * @param themeWord テーマ単語（正規化済み）
   * @returns マッチするかどうか
   */
  private checkWithVariations(content: string, themeWord: string): boolean {
    // ひらがな・カタカナ変換の簡易実装
    const hiraganaToKatakana = (str: string): string => {
      return str.replace(/[\u3041-\u3096]/g, (match) => {
        return String.fromCharCode(match.charCodeAt(0) + 0x60);
      });
    };

    const katakanaToHiragana = (str: string): string => {
      return str.replace(/[\u30a1-\u30f6]/g, (match) => {
        return String.fromCharCode(match.charCodeAt(0) - 0x60);
      });
    };

    // 各種バリエーションでチェック
    const variations = [themeWord, hiraganaToKatakana(themeWord), katakanaToHiragana(themeWord)];

    return variations.some((variation) => content.includes(variation));
  }

  /**
   * 複数のテーマ単語に対する検証（将来拡張用）
   *
   * @param content 投稿内容
   * @param themeWords テーマ単語の配列
   * @returns 検証結果
   */
  validateMultipleThemes(content: string, themeWords: string[]): ValidationResult {
    if (themeWords.length === 0) {
      return {
        isValid: false,
        detectedWords: [],
        reason: 'テーマ単語が設定されていません',
        themeWord: '',
      };
    }

    const detectedWords: string[] = [];

    for (const themeWord of themeWords) {
      if (this.checkThemeWordInclusion(content, themeWord)) {
        detectedWords.push(themeWord);
      }
    }

    const firstThemeWord = themeWords[0] || '';

    if (detectedWords.length > 0) {
      return {
        isValid: true,
        detectedWords,
        themeWord: firstThemeWord,
      };
    } else {
      return {
        isValid: false,
        detectedWords: [],
        reason: `次のテーマ単語のいずれかを含む投稿をしてください: ${themeWords.join(', ')}`,
        themeWord: firstThemeWord,
      };
    }
  }
}
