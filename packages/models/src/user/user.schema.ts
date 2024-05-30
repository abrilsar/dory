import type { z } from 'zod';
import { Schema, Types, type Document } from 'mongoose';
import { userDefinition } from './user.dto';

const authType = {
  accessToken: String,
  expireAccess: String,
  refreshToken: String,
  expireRefresh: String,
};

export type IUser = z.infer<typeof userDefinition>;
export type UserDocument = IUser & Document<Types.ObjectId, any, IUser>;

export const userSchema = new Schema<IUser, UserDocument>(
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
    email: {
      type: String,
      required: [true, ''],
      trim: true,
      lowercase: true,
    },
    projects: {
      type: [Types.ObjectId],
      default: [],
    },
    auth: {
      type: authType,
      required: [true, ''],
      default: {}
    }
  },
  { timestamps: true }
);
