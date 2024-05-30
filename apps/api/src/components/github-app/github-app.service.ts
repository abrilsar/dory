import { Octokit } from "@octokit/core";
import { User } from '@/components/users/user.model';
import { error } from "console";
import axios from 'axios';
import { errorHandler } from "@sentry/node/types/handlers";

async function findData(args: any) {
  const octokit = new Octokit({
    auth: args.token
  })
  try {
    const response = await octokit.request(`GET ${args.url}`, {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json",
      }
    })
    return response.data
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error('404-Not Found');
    }
    throw new Error('401-Unauthorized');
  }
}

async function refreshToken(args: any) {
  const user = await User.findOne({ githubId: args.githubId });
  try {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_ID as string,
      client_secret: process.env.GITHUB_SECRET as string,
      grant_type: "refresh_token",
      refresh_token: user?.auth.refreshToken as string,
    })

    const refreshedTokens = await axios.post("https://github.com/login/oauth/access_token", params).then(response => {
      const params = new URLSearchParams(response.data);
      return {
        accessToken: params.get('access_token'),
        tokenType: params.get('token_type'),
        scope: params.get('scope'),
      };
    })
    console.log('El refresh token es: ', refreshToken)
    return {
      new_token: refreshedTokens.accessToken,
      error: ''
    }
  } catch (error) {
    return {
      new_token: '',
      error: "RefreshAccessTokenError",
    }
  }
}


export const githubAppService = Object.freeze({
  findData,
  refreshToken,
});

