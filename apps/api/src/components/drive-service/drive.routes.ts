
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { driveController } from './drive.controller';

export async function driveRouter(
    fastify: FastifyInstance,
    options?: FastifyPluginOptions
) {
    fastify.post('/v1/drive/create', driveController.uploadFile);

    fastify.post('/v1/drive/read', driveController.readFile);

    fastify.post('/v1/drive/update', driveController.updateFileContent);

    fastify.post('/v1/drive/delete', driveController.deleteFile);

}
