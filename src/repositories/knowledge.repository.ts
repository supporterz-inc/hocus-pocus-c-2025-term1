import type { Knowledge } from '../core-domain/knowledge.model.js';

export interface KnowledgeRepository {
  getById: (id: string) => Promise<Knowledge>;
  getAll: () => Promise<Knowledge[]>;
  upsert: (knowledge: Knowledge) => Promise<void>;
  deleteById: (id: string) => Promise<void>;
}
