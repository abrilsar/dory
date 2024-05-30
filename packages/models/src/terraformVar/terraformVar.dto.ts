import { z } from 'zod';
import { Schema, Types, type Document } from 'mongoose';


export const terraformVarDefinition = z.object({
  size: z.string(),
  region: z.string(),
  domain: z.string(),
  pwd: z.string(),
  email: z.string(),
});
