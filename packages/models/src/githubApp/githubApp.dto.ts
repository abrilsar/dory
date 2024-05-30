import { z } from 'zod';
import { Schema, Types, type Document } from 'mongoose';


export const githubAppDefinition = z.object({
  _id: z.string().min(3),
  name: z.string().min(3),
  users: z.array(z.instanceof(Types.ObjectId)),
});
