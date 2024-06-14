import { Deploy, Project } from '@/components/deployments/deployment.model';
import { User } from '@/components/users/user.model';
import { deploymentRouter } from './deployment.routes';
import { Types } from 'mongoose';
import { file } from 'babel-types';

const getSchema = (project: any, deploy: any) => {
  const schema = {
    _id: project._id,
    repository_link: deploy?.repository.repositoryLink,
    domain: deploy?.config.domain,
    status: project.status,
    lastCommit: deploy?.repository.lastCommit,
    commits: deploy?.repository.commits,
    source: deploy?.repository.source,
    createdAt: project.createdAt,
    name_repo: deploy?.repository.nameRepo,
    name_project: project.nameProject,
    env: deploy?.config.env,
    terraform_output: project.terraform_output,
    apps: deploy?.config.apps
  }
  return schema
}

async function findAll(args: any) {
  const projects = await Project.find({ ...args })
  let deployments: any[] = []

  if (projects.length !== 0) {
    deployments = await Promise.all(
      projects.map(async (project: { deploy: any; }) => {
        const deploy = await Deploy.findById(project.deploy);
        const schema = getSchema(project, deploy)
        return schema;
      }));
  }
  return deployments;
}


async function deleteOne(args: any) {
  const project = await Project.findByIdAndDelete({ _id: args._id });
  const deploy = await Deploy.findByIdAndDelete({ _id: project?.deploy })
  const user = await User.findOne({ _id: args.user_id })
  if (user) {
    const index = user.projects.indexOf(args._id);
    if (index > -1) {
      user.projects.splice(index, 1);
    }
  }
  await user?.save();
}


async function createDeployment(args: any) {
  const user = await User.findOne({ _id: args.user_id })
  const newProject = new Project(args.project);

  const newDeploy = new Deploy(args.deploy);

  newProject.deploy = new Types.ObjectId(newDeploy._id)

  await newProject.save();
  await newDeploy.save();

  if (user) {
    user?.projects.push(newProject._id)
    await user.save()
  }
  return getSchema(newProject, newDeploy);
}


async function findOne(args: any) {
  const project = await Project.findOne({ _id: args })
  let deployment = {}

  if (project) {
    const deploy = await Deploy.findById(project.deploy);
    deployment = getSchema(project, deploy)
  }

  return deployment
}


async function updateOne(args: any) {
  const project = await Project.findById(args.project)
  const deploy = await Deploy.findById({ _id: project?.deploy })

  if (args.type === 'updateLastCommit') {
    if (deploy) deploy.repository.lastCommit = args.update.lastCommit as number

  } else if (args.type === 'updateStatus') {

    if (project) {
      project.status = args.update.status
      await project.save()
    }

  } else {
    deploy?.repository.commits.push(args.update)
  }
  if (deploy) await deploy.save()
}


export const deploymentService = Object.freeze({
  findAll,
  createDeployment,
  deleteOne,
  findOne,
  updateOne
});




