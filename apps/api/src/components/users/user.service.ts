import { User } from '@/components/users/user.model';
import { Project, Deploy } from '../deployments/deployment.model';


async function findOne(args: any) {

  const user = await User.findOne({ _id: args })

  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  const projects = await Project.find({
    '_id': { $in: user.projects }
  });

  let deployments: any[] = []

  if (projects.length !== 0) {
    deployments = await Promise.all(
      projects.map(async (project) => {
        const deploy = await Deploy.findById(project.deploy);

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
        return schema;
      }
      )
    );
  }

  return {
    user: user,
    deployments: deployments
  }
}

async function findAll(args: any) {
  return User.find({ ...args });
}

async function updateOne(args: any) {
  return User.findOneAndUpdate(args.filter, args.update, { new: true });
}


async function createUser(args: any) {
  const existingUser = await User.findOne({ _id: args._id })
  if (existingUser) {
    if (args.auth.refreshToken !== existingUser.auth.refreshToken) {
      const aux = {
        filter: { _id: args._id },
        update: { refreshToken: args.auth.refreshToken }
      }
      updateOne(aux)
    }
    // throw new Error('El usuario ya existe');
    return
  }
  const newUser = new User({ ...args });
  await newUser.save();
  return newUser;
}

export const userService = Object.freeze({
  findOne,
  findAll,
  createUser,
});
