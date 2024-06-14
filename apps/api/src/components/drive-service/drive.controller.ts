import { FastifyReply, FastifyRequest } from "fastify";
import { driveService } from "./drive.service";


async function uploadFile(request: FastifyRequest, reply: FastifyReply) {
    return driveService.uploadFile(request.body);
}


async function readFile(request: FastifyRequest, reply: FastifyReply) {
    return driveService.readFile(request.body);
}


async function updateFileContent(request: FastifyRequest, reply: FastifyReply) {
    return driveService.updateFileContent(request.body);
}


async function deleteFile(request: FastifyRequest, reply: FastifyReply) {
    return driveService.deleteFile(request.body);
}


export const driveController = Object.freeze({
    uploadFile,
    readFile,
    updateFileContent,
    deleteFile,
});
