import { deploymentController } from '@/components/deployments/deployment.controller';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

export async function deploymentRouter(
  fastify: FastifyInstance,
  options?: FastifyPluginOptions
) {
  fastify.get('/v1/deployments', deploymentController.findAll);

  fastify.get('/v1/deployments/:id', deploymentController.findOne);

  fastify.post('/v1/create-deployment', deploymentController.createDeployment);

  fastify.post('/v1/deployments/:id', deploymentController.deleteOne);

  fastify.post('/v1/update-deployment', deploymentController.updateOne);


}


