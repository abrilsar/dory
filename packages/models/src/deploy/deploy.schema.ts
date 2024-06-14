import type { z } from "zod";
import { Schema, Types, type Document } from "mongoose";
import { deployDefinition } from "./deploy.dto";

const configType = {
  domain: String,
  puerto: Number,
  puertoBack: Number,
  env: Boolean,
  apiUrl: String,
  endpoints: String,
  apps: [
    {
      _id: String,
      name: String,
      port: String,
    },
  ],
};

const repoType = {
  nameRepo: String,
  source: String,
  repositoryLink: String,
  lastCommit: Number,
  commits: [
    {
      _id: String,
      time: String,
      previous: Number,
    },
  ],
};

export type IDeploy = z.infer<typeof deployDefinition>;
export type DeployDocument = IDeploy & Document<Types.ObjectId, any, IDeploy>;

export const deploySchema = new Schema<IDeploy, DeployDocument>(
  {
    config: {
      type: configType,
      required: [true, ""],
      trim: true,
    },

    repository: {
      type: repoType,
      required: [true, ""],
      trim: true,
    },
    terraformVar: {
      type: Schema.Types.ObjectId,
      required: [true, ""],
    },
  },
  { timestamps: true },
);
