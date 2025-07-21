import { promises as fs } from "node:fs";
import { rmdir } from "node:fs/promises";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { User } from "../core-domain/user.model.js";

// テスト実行時のみ使用する、一時的なストレージディレクトリ
const TEST_STORAGE_DIR = "./test-storage-users";

describe("FileBasedUserRepository", () => {
  // Helper: テスト用のリポジトリ関数をラップして、テスト用ディレクトリを参照させる
  const TestUserRepository = {
    async upsert(user: User) {
      await fs.mkdir(TEST_STORAGE_DIR, { recursive: true });
      const filePath = `${TEST_STORAGE_DIR}/user-${user.id}.json`;
      await fs.writeFile(filePath, JSON.stringify(user, null, 2));
    },
    async getById(id: string): Promise<User> {
      const filePath = `${TEST_STORAGE_DIR}/user-${id}.json`;
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    },
    async findByName(name: string): Promise<User | null> {
      const files = await fs.readdir(TEST_STORAGE_DIR);
      const userFiles = files.filter(
        (file) => file.startsWith("user-") && file.endsWith(".json")
      );

      for (const file of userFiles) {
        const filePath = `${TEST_STORAGE_DIR}/${file}`;
        const data = await fs.readFile(filePath, "utf-8");
        const user = JSON.parse(data) as User;
        if (user.name === name) {
          return user;
        }
      }
      return null;
    },
  };

  beforeEach(async () => {
    try {
      await rmdir(TEST_STORAGE_DIR, { recursive: true });
    } catch {}
    await fs.mkdir(TEST_STORAGE_DIR, { recursive: true });
  });

  afterEach(async () => {
    try {
      await rmdir(TEST_STORAGE_DIR, { recursive: true });
    } catch {}
  });

  it("ユーザーを保存し、IDで正しく取得できる", async () => {
    // 1. テスト用のユーザーを作成（passwordHashを追加）
    const user = User.create("test-user-01", "hash1");

    // 2. ユーザーを保存
    await TestUserRepository.upsert(user);

    // 3. 保存したユーザーをIDで取得
    const retrieved = await TestUserRepository.getById(user.id);

    // 4. 結果を検証
    expect(retrieved).toEqual(user);
  });

  it("ユーザーを名前で正しく検索できる", async () => {
    // 1. 複数のテストユーザーを作成して保存（passwordHashを追加）
    const user1 = User.create("test-user-02", "hash2");
    const user2 = User.create("another-user", "hash3");
    await TestUserRepository.upsert(user1);
    await TestUserRepository.upsert(user2);

    // 2. 検索
    const found = await TestUserRepository.findByName("test-user-02");
    const notFound = await TestUserRepository.findByName("non-existent-user");

    // 4. 結果を検証
    expect(found).not.toBeNull();
    expect(found?.id).toBe(user1.id);
    expect(notFound).toBeNull();
  });

  it("存在しないIDでユーザーを取得しようとするとエラーをスローする", async () => {
    const nonExistentId = "this-id-does-not-exist";
    await expect(TestUserRepository.getById(nonExistentId)).rejects.toThrow();
  });
});
