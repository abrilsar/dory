import { z } from "zod";
import { Schema, Types, type Document } from "mongoose";

const appSchema = z.object({
  _id: z.string().min(5),
  name: z.string(),
  port: z.string(),
});

const configSchema = z.object({
  domain: z.string().url().min(3),
  puerto: z.number(),
  puertoBack: z.number(),
  env: z.boolean(),
  apiUrl: z.string(),
  endpoints: z.string(),
  apps: z.array(appSchema),
});

const commitSchema = z.object({
  _id: z.string().min(5),
  time: z.string().datetime(),
  previous: z.number(),
});

const repositorySchema = z.object({
  nameRepo: z.string(),
  source: z.string().min(1),
  repositoryLink: z.string(),
  lastCommit: z.number(),
  commits: z.array(commitSchema),
});

export const deployDefinition = z.object({
  _id: z.string().min(3),
  terraformVar: z.instanceof(Types.ObjectId),
  repository: repositorySchema,
  config: configSchema,
});
