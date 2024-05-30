import util from 'util';
import { Deploy, EnvState, } from '../../../../backoffice/types/interfaces';
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
import { ExecException } from 'child_process';
import * as childProcess from 'child_process';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';


async function executeTerraform(reply: FastifyReply, request: FastifyRequest): Promise<void> {
  try {
    if (process.env.NODE_ENV === "production"){
      const terraform_innit = childProcess.spawn('terraform', ['init'], { cwd: "terraform/create" });
    }
    const terraform = childProcess.spawn('terraform', ['apply', '-auto-approve'], { cwd: "terraform/create" });
    terraform.stdout.on('data', (data: Buffer) => {
      console.log(`Terraform output: ${data.toString()}`);
      reply.raw.write(`data: ${data.toString()}\n\n`)
    });
    terraform.stderr.on('data', (data: Buffer) => {
      console.error(`Terraform error: ${data.toString()}`);
      reply.raw.write(`data: ${data.toString()}\n\n`)

    });
    await new Promise<void>((resolve, reject) => {
      terraform.on('close', (code: number) => {
        if (code === 0) {
          reply.raw.write(`data: ${'Terraform process completed successfully'}\n\n`)
          resolve();
        } else {
          reject(new Error(`Terraform failed with code: ${code}`));
        }
      });
    });
  } catch (error: any) {
    reply.raw.write(`data: ${'Terraform process failed'}\n\n`)
    reply.raw.end();
    throw error;
  }

  request.raw.on('close', () => {
    console.log('terminó')
  })
}

async function executeTerraformPullRequest(path: string): Promise<void> {
  try {
    if (process.env.NODE_ENV === "production"){
      const terraform_innit = childProcess.spawn('terraform', ['init'], { cwd: "terraform/create" });
    }
    const terraform = childProcess.spawn('terraform', ['apply', '-auto-approve'], { cwd: `terraform/${path}` });
    terraform.stdout.on('data', (data: Buffer) => {
      console.log(`Terraform output: ${data.toString()}`);
    });
    terraform.stderr.on('data', (data: Buffer) => {
      console.error(`Terraform error: ${data.toString()}`);

    });
    await new Promise<void>((resolve, reject) => {
      terraform.on('close', (code: number) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Terraform failed with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error(`Error executing Terraform: ${error}`);
    throw new Error('500-Terraform Failed');
  }
}

async function createScript(envState: EnvState) {
  try {
    // console.log('appList:', envState.appList);
    // const envContent = `${envState.appList
    //   .map(envVar => `${envVar.name}=${envVar.port}`)
    //   .join('\n')}`;
    // const content = envContent + '\n' + envState.envString
    const switched = await switchVar(envState)

    fs.writeFileSync('./terraform/create/.env', switched + '\n');
  } catch (error) {
    throw new Error('500-Error creando el archivo');
  }
}

async function switchVar(envState:EnvState):Promise<string>{
  let envString = envState.envString
  for (const item of envState.appList) {
    const regex = new RegExp(`http://localhost:${item.port}`, 'g');
    envString = envString.replace(regex, `https://${item.name}.deploy-tap.site`);
}
  return envString;
}


async function createTerraformVar(envState: EnvState) {
  try {
    // console.log('terraformVar:', envState.terraformVar);
    const varContent = Object.entries(envState.terraformVar)
      .map(([key, value]) => `${key}="${value}"`)
      .join('\n');

    const apps = `${envState.appList
      .map(item => `{name="${item.name}",port="${item.port}"}`)
      .join(',')}`;

    const apps_string = "\napps=[" + apps + "]";

    fs.writeFileSync('./terraform/create/terraform.tfvars', varContent + apps_string);
  } catch (error) {
    throw new Error('500-Error creando el archivo');
  }

}

async function deleteFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    try {
      await fs.promises.unlink(filePath);
      console.log('Archivo eliminado correctamente');
    } catch (error) {
      console.log('No se pudo eliminar el archivo:', error);
      throw new Error('500-Error eliminando el archivo');
    }
  } else {
    console.log('El archivo no existe');
  }
};

async function generateSSHKeys(file_path: string) {
  if (!fs.existsSync(file_path)) {
    fs.mkdirSync(file_path);
  }
  return new Promise((resolve, reject) => {
    exec(`ssh-keygen -f ${file_path}/id_rsa -N ""`, (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        reject(error);
      } else {
        try {
          const pubKey = fs.readFileSync(`${file_path}/id_rsa.pub`, 'utf8').trim();
          console.log(pubKey)
          resolve(pubKey);
        } catch (error) {
          reject(error);
          throw error;
        }
      }
    });
  });
}

async function registerSSHKeys(envState: EnvState) {
  try {
    const response = await fetch('https://api.digitalocean.com/v2/account/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${envState.terraformVar.do_token}`,
      },
      body: JSON.stringify({
        name: envState.terraformVar.name_project,
        public_key: envState.terraformVar.pub_key,
      }),
    });

    const data = await response.json();
  } catch (error) {
    console.error('Error registering SSH key:', error);
    throw error;
  }
};

interface props {
  url: string
  method: string
}

async function deleteFolder(folderPath: string) {
  if (fs.existsSync(folderPath)) {
    try {
      // await fs.promises.rmdir(folderPath, { recursive: true });
      await fs.promises.rmdir(folderPath, { recursive: true });
      console.log('Carpeta eliminada correctamente');
    } catch (error) {
      console.log('No se pudo eliminar la carpeta:', error);
      throw new Error('500-Error eliminando la carpeta');
    }
  } else {
    console.log('La carpeta no existe');
  }
}

async function pullRequest(deploy: Deploy, pull: string) {
  try {
    const data = await getInfoDO({ url: `droplets?name=${deploy.name_project}`, method: 'GET' })
    const droplet = data.droplets[0]
    console.log(droplet.networks.v4[0].ip_address)
    const docker_exec = deploy.env ? 'docker-compose --env-file /etc/.env up -d' : 'docker-compose up -d'
    const terraformVar = {
      ip: droplet.networks.v4[0].ip_address,
      do_token: process.env.DO_TOKEN as string,
      pvt_key: `${process.env.PATH_SSH}${deploy.name_project}/id_rsa`,
      pwd: process.env.PWD,
      github_repo: deploy.name_repo,
      github_branch: deploy.source,
      docker_command: docker_exec,
      pull: pull === 'true' ? true : false
    }
    const varContent = Object.entries(terraformVar)
      .map(([key, value]) => `${key}="${value}"`)
      .join('\n');

    fs.writeFileSync('./terraform/pull_request/terraform.tfvars', varContent);
  } catch (error) {
    throw error;
  }
}

async function deleteDroplet(deploy: Deploy) {
  try {
    const idSSH = await getId(deploy.name_project, 'account/keys', 'ssh');
    // const idRecordA = await getId(deploy.name_repo.toLowerCase(), 'domains/deploy-tap.site/records', 'record');
    // const idRecordCNAME = await getId(`www.${deploy.name_repo.toLowerCase()}`, 'domains/deploy-tap.site/records', 'record');

    await Promise.all([
      deleteResource(`account/keys/${idSSH}`),
      deleteResource(`domains/${deploy.name_project}.deploy-tap.site`)
      // deleteResource(`domains/deploy-tap.site/records/${idRecordA}`),
      // deleteResource(`domains/deploy-tap.site/records/${idRecordCNAME}`),
    ]);

    await deleteFolder(`${process.env.PATH_SSH}${deploy.name_project}`);

    const data = await getInfoDO({ url: `droplets?name=${deploy.name_project}`, method: 'GET' });
    const dropletId = data.droplets[0].id;
    await deleteResource(`droplets/${dropletId}`);
  } catch (error) {
    console.error('Error deleting droplet:', error);
  }
}

async function getId(name: string, url: string, search: string) {
  try {
    const data = await getInfoDO({ url, method: 'GET' });
    console.log(data);
    if (search === 'ssh') {
      for (const key of data.ssh_keys) {
        if (key.name === name) {
          return key.id;
        }
      }
    } else {
      for (const record of data.domain_records) {
        if (record.name === name) {
          return record.id;
        }
      }
    }
    return null;
  } catch (error) {
    console.error(`Error getting ID for ${name}:`, error);
    return null;
  }
}

async function getInfoDO({ url, method }: props) {
  try {
    const response = await fetch(`https://api.digitalocean.com/v2/${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DO_TOKEN}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error with request:', error);
    throw error;
  }
}

async function deleteResource(url: string) {
  try {
    await getInfoDO({ url, method: 'DELETE' });
  } catch (error) {
    console.error(`Error deleting resource ${url}:`, error);
  }
}


export const terraformService = Object.freeze({
  executeTerraform,
  executeTerraformPullRequest,
  createScript,
  createTerraformVar,
  deleteFile,
  generateSSHKeys,
  registerSSHKeys,
  pullRequest,
  deleteDroplet,
});


