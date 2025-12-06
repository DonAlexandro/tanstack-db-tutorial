import { z } from "zod";

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  isFavorite: z.boolean(),
});

export type Project = z.infer<typeof projectSchema>;

export const todoSchema = z.object({
  id: z.string(),
  name: z.string(),
  completed: z.boolean(),
  projectId: z.string(),
});

export type Todo = z.infer<typeof todoSchema>;
