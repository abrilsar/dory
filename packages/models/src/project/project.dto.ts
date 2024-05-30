import { z } from 'zod';
import { Schema, Types, type Document } from 'mongoose';

export const projectDefinition = z.object({
  // deployment: z.string().url().min(5),
  nameProject: z.string(),
  status: z.string().min(5),
  createdAt: z.string().datetime().or(z.date()).nullable().optional(),
  updatedAt: z.string().datetime().or(z.date()).nullable().optional(),
  terraform_output: z.string(),
  deploy: z.instanceof(Types.ObjectId)
});

