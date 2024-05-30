'use client'
import { useEffect, useState } from "react";
import Details from "./Details";
import { useDataContex } from "@/hooks/useDataContext";
import { Deploy } from "types/interfaces";
import { axios } from "@/lib/api";
import useAxiosAuth from "@/hooks/useAxiosAuth";

export default function DeployDetails({ params }: { params: { deployId: string } }) {
  // const [index, setIndex] = useState<number>(-1)
  const [update, setUpdate] = useState<boolean>(false)
  const [deploy, setDeploy] = useState<Deploy>()
  const axiosAuth = useAxiosAuth();


  const getDeploy = async () => {
    try {
      await axios.get(`/v1/deployments/${params.deployId}`).then(response => setDeploy(response.data))
    } catch (error) { console.log(error) }
  }

  const getCommit = async () => {
    try {
      const auxCommit = deploy?.commits.length
      const infoRepo = deploy?.repository_link.split("https://github.com/")[1]
      await axiosAuth.post('/v1/github-app/get-data', {
        url: `/repos/${infoRepo}/branches/${deploy?.source}`,
      }).then(response => response.data).then(data => data.commit.sha).then(commit => {
        commit !== deploy?.commits[auxCommit! - 1]?._id ? setUpdate(true) : setUpdate(false);
      })
    } catch (error) { console.log(error) }
  }

  useEffect(() => {
    if (!deploy) {
      getDeploy()
    }
    deploy && getCommit()
  }, [deploy])

  return deploy ? <Details deploy={deploy} changes={update} setChanges={setUpdate} /> : <div></div>
}