import type { FastifyRequest, FastifyReply } from 'fastify';
import { deploymentService } from '@/components/deployments/deployment.service';


interface ParamsType {
  id: string;
}

interface RequestBody {
  user_id: string;
}

async function findAll(request: FastifyRequest, reply: FastifyReply) {
  return deploymentService.findAll({});
}
async function findOne(request: FastifyRequest<{ Params: ParamsType }>, reply: FastifyReply) {
  return deploymentService.findOne(request.params.id);
}


async function createDeployment(request: FastifyRequest, reply: FastifyReply) {
  return deploymentService.createDeployment(request.body);
}

async function deleteOne(request: FastifyRequest<{ Params: ParamsType }>, reply: FastifyReply) {
  const args = {
    _id: request.params.id,
    user_id: (request.body as RequestBody).user_id
  }
  return deploymentService.deleteOne(args);
}

async function updateOne(request: FastifyRequest, reply: FastifyReply) {
  return deploymentService.updateOne(request.body);
}

export const deploymentController = Object.freeze({
  findAll,
  createDeployment,
  deleteOne,
  findOne,
  updateOne
});

