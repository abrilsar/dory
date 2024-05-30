import { model } from 'mongoose';
import { deploySchema, projectSchema } from '@avila-tek/models';


export const Project = model('Project', projectSchema);
export const Deploy = model('Deploy', deploySchema);
