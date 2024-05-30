import type { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from '@/components/users/user.service';

interface ParamsType {
  id: string;
}

async function findOne(request: FastifyRequest<{ Params: ParamsType }>, reply: FastifyReply) {
  return userService.findOne(request.params.id);
}


async function createUser(request: FastifyRequest, reply: FastifyReply) {
  return userService.createUser(request.body);
}

export const userController = Object.freeze({
  findOne,
  createUser,
});
