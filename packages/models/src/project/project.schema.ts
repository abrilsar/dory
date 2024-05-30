import { boolean, type z } from 'zod';
import { Schema, Types, type Document } from 'mongoose';
import { projectDefinition } from './project.dto';

export type IProject = z.infer<typeof projectDefinition>;
export type projectDocument = IProject & Document<Types.ObjectId, any, IProject>;

export const projectSchema = new Schema<IProject, projectDocument>(
  {
    nameProject: {
      type: String,
      required: [true, ''],
      trim: true,
    },
    status: {
      type: String,
      required: [true, ''],
      trim: true,
    },
    terraform_output: {
      type: String,
      required: [true, ''],
      trim: true,
    },
    deploy: {
      type: Schema.Types.ObjectId,
      default: null
    },
  },
  { timestamps: true }
);
