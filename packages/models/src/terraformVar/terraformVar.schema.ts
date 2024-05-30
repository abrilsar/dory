import type { z } from 'zod';
import { Schema, Types, type Document } from 'mongoose';
import { terraformVarDefinition } from './terraformVar.dto';

export type ITerraformVar = z.infer<typeof terraformVarDefinition>;
export type TerraformVarDocument = ITerraformVar & Document<Types.ObjectId, any, ITerraformVar>;

export const terraformVarSchema = new Schema<ITerraformVar, TerraformVarDocument>(
  {
    size: {
      type: String,
      required: [true, ''],
      trim: true,
    },
    region: {
      type: String,
      required: [true, ''],
      trim: true,
    },
    domain: {
      type: String,
      required: [true, ''],
      trim: true,
    },
    pwd: {
      type: String,
      required: [true, ''],
      trim: true,
    },
    email: {
      type: String,
      required: [true, ''],
      trim: true,
    }
  },
  { timestamps: true }
);
