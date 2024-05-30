'use client'
import { axios } from "../lib/api";
import { signOut, useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { useRefreshToken } from "./useRefreshToken";


const useAxios = () => {
    const { data: session } = useSession();
    const { setErrorStatus, getRefreshToken } = useRefreshToken(200);

    useEffect(() => {
        const requestIntercept = axios.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `token ${session?.user?.token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error.response.status === 401 && !prevRequest?.sent) {
                    setErrorStatus(401)
                    prevRequest.sent = true;

                    const newAccessToken = await getRefreshToken(401)

                    if (newAccessToken) {
                        prevRequest.headers["Authorization"] = `token ${newAccessToken?.user.token}`;
                        setErrorStatus(200)
                        return axios(prevRequest);
                    }
                    setErrorStatus(200)

                }
                if (error.response.status === 404 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    return Promise.resolve(error.response);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestIntercept);
            axios.interceptors.response.eject(responseIntercept);
        };
    }, [session]);

    return axios;
};

export default useAxios;