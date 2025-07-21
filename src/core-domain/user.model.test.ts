import { describe, expect, it } from "vitest";
import { User } from "./user.model.js";

describe("Create User", () => {
  it("Userが正しく作成できる", () => {
    // 1. テスト用のユーザー名と、ダミーのパスワードハッシュを準備
    const userName = "test-user";
    const dummyPasswordHash = "salt.hash_value_for_testing";

    // 2. 実際にユーザー作成関数を呼び出す
    const user = User.create(userName, dummyPasswordHash);

    // 3. 結果を検証する
    expect(user.name).toBe(userName);
    expect(user.passwordHash).toBe(dummyPasswordHash); // passwordHashが正しく設定されているか
    expect(typeof user.id).toBe("string");
    expect(user.id.length).toBeGreaterThan(0);
  });
});
