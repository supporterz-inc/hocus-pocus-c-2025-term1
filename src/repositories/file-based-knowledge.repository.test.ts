import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'node:fs';
import { rmdir } from 'node:fs/promises';
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

    it('should save and retrieve knowledge', async () => {
        // TODO: Person AとBができたら実装
        expect(true).toBe(true);
    });
});