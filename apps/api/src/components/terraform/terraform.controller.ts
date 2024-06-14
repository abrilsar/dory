import { FastifyReply, FastifyRequest } from "fastify";
import { terraformService } from "./terraform.service";
import { Deploy, EnvState, AppVariable } from "../../../../backoffice/types/interfaces";


async function deploy(
  request: FastifyRequest,
  reply: FastifyReply) {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': request.headers.origin || "*",
  };
  reply.raw.writeHead(200, headers)
  return terraformService.executeTerraform(reply, request);
}

async function pullRequestTerraform(
  request: FastifyRequest,
  reply: FastifyReply) {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': request.headers.origin,
  };
  reply.raw.writeHead(200, headers)
  return terraformService.executeTerraformPullRequest(reply, request);
}

async function script(
  request: FastifyRequest<{ Body: EnvState }>,
  reply: FastifyReply) {
  return terraformService.createScript(request.body);

}

async function terrafromVar(
  request: FastifyRequest<{ Body: EnvState }>,
  reply: FastifyReply) {
  return terraformService.createTerraformVar(request.body);
}

async function deleteFile(
  request: FastifyRequest<{ Body: string }>,
  reply: FastifyReply) {
  return terraformService.deleteFile(request.body);
}

async function generateSSHKeys(
  request: FastifyRequest<{ Body: string }>,
  reply: FastifyReply) {
  return terraformService.generateSSHKeys(request.body);
}
async function registerSSHKeys(
  request: FastifyRequest<{ Body: EnvState }>,
  reply: FastifyReply) {
  return terraformService.registerSSHKeys(request.body);
}

async function pullRequest(
  request: FastifyRequest<{ Body: Deploy, Params: { pull: string } }>,
  reply: FastifyReply) {
  const { pull } = request.params;
  return terraformService.pullRequest(request.body, pull);
}
async function deleteDroplet(
  request: FastifyRequest<{ Body: Deploy }>,
  reply: FastifyReply) {
  return terraformService.deleteDroplet(request.body);;
}


export const terraformController = Object.freeze({ deploy, pullRequestTerraform, script, terrafromVar, deleteFile, generateSSHKeys, registerSSHKeys, pullRequest, deleteDroplet });