import { z } from 'zod';
import { Schema, Types, type Document } from 'mongoose';


const authSchema = z.object({
  accessToken: z.string(),
  expireAccess: z.string(),
  refreshToken: z.string(),
  expireRefresh: z.string(),
});


export const userDefinition = z.object({
  _id: z.string().min(3),
  name: z.string().min(3),
  email: z.string().email().min(5),
  projects: z.array(z.instanceof(Types.ObjectId)),
  createdAt: z.string().datetime().or(z.date()).nullable().optional(),
  auth: authSchema
});

