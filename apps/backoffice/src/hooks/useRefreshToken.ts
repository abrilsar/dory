"use client";
import { axios } from "@/lib/api";

import { SignInPageUrl } from "@/constants/urls";

import { signOut, useSession } from "next-auth/react";
import { Newsreader } from "next/font/google";
import { useEffect, useState } from "react";
import { string } from "zod";

type ResponseType = {
    new_token: string,
    error: string
}
export const useRefreshToken = (initialErrorStatus: number) => {
    const { data: session, update } = useSession();
    const [errorStatus, setErrorStatus] = useState(initialErrorStatus);

    const getRefreshToken = async (newErrorStatus: number) => {
        setErrorStatus(newErrorStatus)
        if (newErrorStatus === 401) {
            try {
                const data: ResponseType = await axios.post('/v1/github-app/refresh-token', { githubId: session?.user._id }).then(response => response.data);
                if (data?.error === 'RefreshAccessTokenError' || data?.new_token === null) {
                    signOut({ callbackUrl: SignInPageUrl })
                } else {
                    console.log("Antes", session?.user.token)

                    const newSession = await update({
                        ...session,
                        user: {
                            ...session?.user,
                            token: data?.new_token,
                        }
                    });
                    console.log("Despues", session?.user.token)
                    return newSession
                }
            } catch (error) {
                console.log('error en el useRefreseTOken')
                signOut({ callbackUrl: SignInPageUrl })

                // Manejar errores de actualización de token
            }
        }
    };


    return { errorStatus, setErrorStatus, getRefreshToken };
};