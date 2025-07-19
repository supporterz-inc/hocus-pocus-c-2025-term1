import type { KnowledgeRepository } from './knowledge.repository.js';

export const FileBasedKnowledgeRepository: KnowledgeRepository = {
  // @ts-ignore TODO: (学生向け) 実装する
  getById: async (id) => {},
  // @ts-ignore TODO: (学生向け) 実装する
  getAll: async () => {},
  // @ts-ignore TODO: (学生向け) 実装する
  upsert: async (knowledge) => {
    const filepath = path.join(
      __dirname,
      `strage/knowledge-${knowledge.id}.json`
    );
    const content = `${knowledge}`;
    await writeFile(filepath, content, "utf-8");
  },
  // @ts-ignore TODO: (学生向け) 実装する
  deleteById: async (id) => {
    const filepath = path.join(__dirname, `strage/knowledge-${id}.json`);
    await unlink(filepath);
  },
};
