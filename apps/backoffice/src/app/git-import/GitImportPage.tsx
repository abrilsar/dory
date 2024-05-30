
import InstallGitApp from "./Install-gitapp"
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useEffect, useState } from "react";
import RepositoryPage from "./RepositoryPage";
import { useSession } from "next-auth/react";
import { useDataContex } from "@/hooks/useDataContext";

export default function GitImportPage() {
  const axiosAuth = useAxiosAuth();
  const { installation_id, setInstallationID } = useDataContex()
  const { data: session } = useSession()

  const getListInstallation = (data: any, installation: any) => {
    const newList = [installation.id]
    data.installations.map((element: any) => { if (!newList.includes(element.id)) newList.push(element.id) })
    setInstallationID(newList)
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const checkInstallation = async () => {
      const data = await axiosAuth.post('/v1/github-app/get-data', {
        url: `/user/installations`,
      }).then(response => response.data)
      if (data.total_count !== 0) {
        const installation = data.installations.find((installation: { app_id: number; account: { id: string } }) => installation.app_id === 883977 && installation.account.id.toString() === session?.user._id);
        installation ? getListInstallation(data, installation) : []
      }

    }

    if (session && installation_id.length === 0) {
      checkInstallation()
    }

    return () => {
      isMounted = false;
      controller.abort();
    }

  }, [session])

  return (installation_id.length === 0) ? <InstallGitApp /> : <RepositoryPage />;



}