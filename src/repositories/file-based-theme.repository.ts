import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { Theme } from '../core-domain/theme.model.js';
import type { ThemeRepository } from './theme.repository.js';

/**
 * ファイルベースのテーマリポジトリ実装
 */
export class FileBasedThemeRepository implements ThemeRepository {
  private readonly themesDataPath: string;

  constructor(basePath = './storage') {
    this.themesDataPath = join(basePath, 'themes', 'themes-data.json');
  }

  /**
   * テーマデータファイルを読み込む
   */
  private async loadThemes(): Promise<Theme[]> {
    try {
      const data = await readFile(this.themesDataPath, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed.themes || [];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // ファイルが存在しない場合は空配列を返す
        return [];
      }
      throw new Error(`Failed to load themes: ${(error as Error).message}`);
    }
  }

  /**
   * テーマデータをファイルに保存する
   */
  private async saveThemes(themes: Theme[]): Promise<void> {
    try {
      // ディレクトリが存在しない場合は作成
      await mkdir(dirname(this.themesDataPath), { recursive: true });

      const data = JSON.stringify({ themes }, null, 2);
      await writeFile(this.themesDataPath, data, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save themes: ${(error as Error).message}`);
    }
  }

  async getAll(): Promise<Theme[]> {
    return await this.loadThemes();
  }

  async getActiveThemes(): Promise<Theme[]> {
    const themes = await this.loadThemes();
    return themes.filter((theme) => theme.isActive);
  }

  async getById(id: string): Promise<Theme | null> {
    const themes = await this.loadThemes();
    return themes.find((theme) => theme.id === id) || null;
  }

  async create(theme: Theme): Promise<void> {
    const themes = await this.loadThemes();

    // 同じIDのテーマが既に存在する場合はエラー
    if (themes.some((existing) => existing.id === theme.id)) {
      throw new Error(`Theme with ID ${theme.id} already exists`);
    }

    themes.push(theme);
    await this.saveThemes(themes);
  }

  async update(theme: Theme): Promise<void> {
    const themes = await this.loadThemes();
    const index = themes.findIndex((existing) => existing.id === theme.id);

    if (index === -1) {
      throw new Error(`Theme with ID ${theme.id} not found`);
    }

    themes[index] = theme;
    await this.saveThemes(themes);
  }

  async delete(id: string): Promise<void> {
    const themes = await this.loadThemes();
    const filteredThemes = themes.filter((theme) => theme.id !== id);

    if (filteredThemes.length === themes.length) {
      throw new Error(`Theme with ID ${id} not found`);
    }

    await this.saveThemes(filteredThemes);
  }
}
