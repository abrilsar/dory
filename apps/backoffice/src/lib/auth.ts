/* eslint-disable turbo/no-undeclared-env-vars */
import type { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from "next-auth/providers/github";
import { axios, getFetch } from './api';

/**
 * @see https://codevoweb.com/setup-and-use-nextauth-in-nextjs-13-app-directory/
 */



export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  // pages: {
  //   signIn: '/auth-error',
  // },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    })
  ],
  callbacks: {
    async jwt({ token, user, account, session, trigger }) {
      if (account) {
        //creacion BD

        const auth = {
          accessToken: account.access_token,
          expireAccess: account.expires_at,
          refreshToken: account.refresh_token,
          expireRefresh: account.refresh_token_expires_in,
        }

        const newUser = {
          _id: account.providerAccountId,
          name: token.name,
          email: token.email,
          auth: auth,
        };

        const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        };

        await axios.post('/v1/create-user', newUser)
        //Termina creacion BD

        return {
          ...token,
          accessToken: account.access_token,
          id: account.providerAccountId
        };
      }

      if (trigger === "update") {
        return { ...token, accessToken: session.user.token }
      }
      return { ...token }
    },
    async session({ session, token, user }) {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            _id: token.id,
            token: token.accessToken,
          }
        };
      }
      return session

    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
