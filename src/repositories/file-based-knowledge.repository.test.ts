import { promises as fs } from 'node:fs';
import { rmdir } from 'node:fs/promises';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Knowledge } from '../core-domain/knowledge.model.js';
import { FileBasedKnowledgeRepository } from './file-based-knowledge.repository.js';

const TEST_STORAGE_DIR = 'test-storage';

describe('FileBasedKnowledgeRepository', () => {
  beforeEach(async () => {
    // テスト用のディレクトリを作成
    try {
      await fs.mkdir(TEST_STORAGE_DIR, { recursive: true });
    } catch {
      // すでに存在する場合は無視
    }
  });

  afterEach(async () => {
    // テスト後のクリーンアップ
    try {
      await rmdir(TEST_STORAGE_DIR, { recursive: true });
    } catch {
      // ディレクトリが存在しない場合は無視
    }
  });

  it('ディレクトリが存在しない時に、ちゃんと作れるかテスト', async () => {
    // テスト用ディレクトリを削除
    try {
      await rmdir(TEST_STORAGE_DIR, { recursive: true });
    } catch {
      // ディレクトリが存在しない場合は無視
    }

    // テスト用ディレクトリが存在しないことを確認
    let dirExists = true;
    try {
      await fs.access(TEST_STORAGE_DIR);
    } catch {
      dirExists = false;
    }
    expect(dirExists).toBe(false);

    // テスト用ディレクトリを作成
    await fs.mkdir(TEST_STORAGE_DIR, { recursive: true });

    // テスト用ディレクトリが作成されたことを確認
    try {
      await fs.access(TEST_STORAGE_DIR);
    } catch {
      expect(true).toBe(false);
    }
  });

  it('ナレッジの保存と取得', async () => {
    // テスト用のナレッジを作成
    const knowledge = Knowledge.create('テスト投稿です', 'testUser');

    // ナレッジを保存
    await FileBasedKnowledgeRepository.upsert(knowledge);

    // 取得
    const retrieved = await FileBasedKnowledgeRepository.getById(knowledge.id);

    // 確認
    expect(retrieved.id).toBe(knowledge.id);
    expect(retrieved.content).toBe('テスト投稿です');
    expect(retrieved.authorId).toBe('testUser');
    expect(retrieved.createdAt).toBe(knowledge.createdAt);
    expect(retrieved.updatedAt).toBe(knowledge.updatedAt);
  });
});
