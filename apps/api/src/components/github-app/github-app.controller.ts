import type { FastifyRequest, FastifyReply } from 'fastify';
import { githubAppService } from '@/components/github-app/github-app.service';

interface RequestBody {
  url: string
}

async function findData(request: FastifyRequest, reply: FastifyReply) {
  const data = request.body as RequestBody
  const args = {
    url: data.url,
    token: request.headers.authorization
  }
  return githubAppService.findData(args);
}

interface RequestBodyID {
  user_id: string
}
async function refreshToken(request: FastifyRequest, reply: FastifyReply) {
  const arg = request.body as String
  return githubAppService.refreshToken(arg);
}

export const githubAppController = Object.freeze({
  findData,
  refreshToken,
});