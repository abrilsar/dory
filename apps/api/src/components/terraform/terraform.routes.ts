import { terraformController } from './terraform.controller';
import { FastifyReply, FastifyRequest, type FastifyInstance, type FastifyPluginOptions } from 'fastify';

export async function terraformRouter(
  fastify: FastifyInstance,
  options?: FastifyPluginOptions
) {
  fastify.get('/v1/terraform/deploy', terraformController.deploy);
  fastify.post('/v1/terraform/deployPullRequest', terraformController.pullRequestTerraform);
  fastify.post('/v1/terraform/env', terraformController.script);
  fastify.post('/v1/terraform/var', terraformController.terrafromVar);
  fastify.post('/v1/terraform/delete', terraformController.deleteFile);
  fastify.post('/v1/terraform/ssh', terraformController.generateSSHKeys);
  fastify.post('/v1/terraform/registerSSH', terraformController.registerSSHKeys);
  fastify.post('/v1/terraform/pullRequest/:pull', terraformController.pullRequest);
  fastify.post('/v1/terraform/deleteDroplet', terraformController.deleteDroplet);

}

