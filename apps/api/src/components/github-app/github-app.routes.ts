import { githubAppController } from '@/components/github-app/github-app.controller';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

export async function githubAppRouter(
  fastify: FastifyInstance,
  options?: FastifyPluginOptions
) {

  fastify.post('/v1/github-app/get-data', githubAppController.findData);
  fastify.post('/v1/github-app/refresh-token', githubAppController.refreshToken);
}
