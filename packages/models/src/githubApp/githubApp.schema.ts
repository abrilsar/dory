import type { z } from 'zod';
import { Schema, Types, type Document } from 'mongoose';
import { githubAppDefinition } from './githubApp.dto';

export type IGithubApp = z.infer<typeof githubAppDefinition>;
export type GithubAppDocument = IGithubApp & Document<Types.ObjectId, any, IGithubApp>;

export const githubAppSchema = new Schema<IGithubApp, GithubAppDocument>(
  {
    _id: {
      type: String,
      required: [true, ''],
      trim: true,
    },
    name: {
      type: String,
      required: [true, ''],
      trim: true,
    },
    users: {
      type: [Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true }
);
